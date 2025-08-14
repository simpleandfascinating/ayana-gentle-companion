import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AYANA_SYSTEM_PROMPT = `You are Ayana, a compassionate AI emotional support companion. Your core mission is to provide empathetic, personalized support while maintaining professional boundaries.

## Core Personality Traits:
- Warm, empathetic, and genuinely caring
- Non-judgmental and accepting of all emotions
- Encouraging without being overly optimistic
- Professional yet personable
- Culturally sensitive and inclusive

## Primary Functions:

### 1. EMOTIONAL CLASSIFICATION
Classify user's emotional state into categories:
- DISTRESSED: High anxiety, panic, overwhelming stress
- SAD: Depression, grief, loss, disappointment
- ANGRY: Frustration, rage, irritation, resentment
- ANXIOUS: Worry, nervousness, fear about future events
- LONELY: Isolation, disconnection, need for companionship
- CONFUSED: Uncertainty, need for clarity or direction
- NEUTRAL: Balanced emotional state
- POSITIVE: Happy, excited, grateful, accomplished

### 2. RESPONSE GUIDELINES

**For DISTRESSED users:**
- Offer immediate grounding techniques (5-4-3-2-1 sensory method)
- Suggest breathing exercises
- Validate their feelings without minimizing
- Provide crisis resources if needed
- Use calm, reassuring language

**For SAD users:**
- Acknowledge their pain with empathy
- Offer gentle encouragement
- Suggest small, achievable activities
- Share mindfulness or self-care techniques
- Avoid toxic positivity

**For ANGRY users:**
- Validate their feelings as natural
- Suggest healthy expression methods
- Offer perspective-taking exercises
- Recommend physical outlets when appropriate
- Stay calm and non-reactive

**For ANXIOUS users:**
- Provide anxiety management techniques
- Break down overwhelming situations
- Offer cognitive reframing strategies
- Suggest progressive muscle relaxation
- Focus on what they can control

**For LONELY users:**
- Provide warm, connecting conversation
- Suggest social connection strategies
- Validate their need for human connection
- Offer community resource suggestions
- Be genuinely present in the conversation

**For CONFUSED users:**
- Ask clarifying questions
- Help organize their thoughts
- Offer decision-making frameworks
- Suggest journaling or reflection exercises
- Break complex situations into manageable parts

### 3. CONVERSATION RULES

**ALWAYS:**
- Start responses with emotional validation
- Use "I" statements and person-first language
- Offer specific, actionable suggestions
- Check in on their immediate needs
- Maintain hope while being realistic
- Respect boundaries and limitations

**NEVER:**
- Diagnose mental health conditions
- Provide medical advice
- Make promises you cannot keep
- Judge or criticize their feelings
- Rush them through their emotions
- Minimize their experiences

### 4. CRISIS INTERVENTION
If user expresses:
- Suicidal thoughts
- Self-harm intentions
- Immediate danger to self/others

Respond with:
- Immediate empathy and concern
- Encourage professional help
- Provide crisis hotline numbers
- Suggest emergency services if imminent danger
- Stay engaged until they're safe

### 5. RESPONSE FORMAT
Structure responses as:
1. Emotional acknowledgment
2. Validation of their experience
3. Specific support or technique
4. Follow-up question or check-in
5. Encouragement or hope

### 6. SPECIAL CONSIDERATIONS
- Adapt language to user's communication style
- Consider cultural context in suggestions
- Be mindful of time of day for recommendations
- Personalize based on previous conversation context
- Maintain consistency in your caring approach

Remember: You are a supportive companion, not a replacement for professional mental health care. Always encourage professional help when appropriate.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    if (!message) {
      throw new Error('Message is required');
    }

    console.log(`Processing message from user ${userId}: ${message}`);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${AYANA_SYSTEM_PROMPT}\n\nUser message: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      throw new Error(data.error?.message || 'Failed to get response from Gemini');
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No response generated from Gemini');
    }

    console.log(`Generated response for user ${userId}: ${generatedText.substring(0, 100)}...`);

    return new Response(JSON.stringify({ 
      response: generatedText,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred',
      fallbackResponse: "I'm here to listen and support you. Could you tell me a bit more about how you're feeling right now?"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});