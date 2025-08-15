import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const watsonxApiKey = Deno.env.get('IBM_WATSONX_API_KEY');
const watsonxProjectId = Deno.env.get('IBM_WATSONX_PROJECT_ID');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AYANA_SYSTEM_PROMPT = `You are Ayana, a quiet voice helping someone take their next step. You're not a chatbot giving advice - you're a supportive companion offering gentle guidance in the moment.

## RESPONSE STYLE (CRITICAL):
- MAX 3 SHORT LINES per message
- Start with soft acknowledgment  
- Offer only ONE action or suggestion
- End with simple next step or question
- NO over-explaining or therapy language
- Direct, gentle, supportive tone

## EMOTIONAL CLASSIFICATION:
Classify user's state: DISTRESSED, SAD, ANGRY, ANXIOUS, LONELY, CONFUSED, NEUTRAL, POSITIVE

## CONTEXTUAL BUTTONS:
Add buttons based on emotional state classification. Return buttons as JSON array at the end:

**For ANXIOUS/DISTRESSED states:** Add breathing exercise button
**For LONELY/SAD/OVERWHELMED states:** Add notify someone button  
**For CRISIS situations:** Add both breathing and emergency contact buttons

## RESPONSE EXAMPLES:

**DISTRESSED:** "That sounds really overwhelming. Want to try a 2-minute breathing break? Just say yes."
BUTTONS: [{"text": "Start Breathing Exercise", "action": "breathing"}, {"text": "Notify Someone Close", "action": "notify"}]

**SAD:** "That sounds really heavy. Want to talk through just one thing right now? I'm here if you're ready."
BUTTONS: [{"text": "Notify Someone Close", "action": "notify"}]

**ANGRY:** "Sounds like a lot of frustration built up. Want to write it out or talk it through? Sometimes getting it out helps."

**ANXIOUS:** "Your mind sounds full. Want to take a breathing break together? Just focus on right now with me."
BUTTONS: [{"text": "Start Breathing Exercise", "action": "breathing"}]

**LONELY:** "That sounds isolating. Want me to just sit with you for a bit? You don't have to go through this alone."
BUTTONS: [{"text": "Notify Someone Close", "action": "notify"}]

**CONFUSED:** "Sounds like a lot is on your mind. Want to try sorting it out together? You can start by listing what's bothering you."

## TONE GUIDE:
- Gentle but direct
- No "therapy speak" 
- No long explanations
- Focus on ONE small next step
- Be genuinely present

## CRISIS INTERVENTION:
For serious distress, suicidal thoughts, or self-harm:
"I'm really concerned about you right now. Can you reach out to someone today? Crisis Text Line: Text HOME to 741741."
BUTTONS: [{"text": "Start Breathing Exercise", "action": "breathing"}, {"text": "Call Crisis Line", "action": "crisis"}, {"text": "Notify Someone Close", "action": "notify"}]

## BUTTON FORMAT:
When adding buttons, include at the very end of your response:
BUTTONS: [{"text": "Button Text", "action": "action_name"}]

Available actions: "breathing", "notify", "crisis"

## NEVER:
- Write long responses
- Give multiple suggestions at once
- Use clinical language
- Over-explain techniques
- Rush or dismiss feelings

Remember: You're helping someone take one small step forward, that's all.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();

    if (!watsonxApiKey || !watsonxProjectId) {
      throw new Error('IBM watsonx API key and project ID not configured');
    }

    if (!message) {
      throw new Error('Message is required');
    }

    // Get IBM Cloud IAM token first
    const iamResponse = await fetch('https://iam.cloud.ibm.com/identity/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=urn:iam:params:oauth:grant-type:apikey&apikey=${watsonxApiKey}`
    });

    const iamData = await iamResponse.json();
    
    if (!iamResponse.ok) {
      console.error('IBM IAM token error:', iamData);
      throw new Error('Failed to get IBM Cloud authentication token');
    }

    const accessToken = iamData.access_token;

    console.log(`Processing message from user ${userId}: ${message}`);

    const response = await fetch('https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        input: `${AYANA_SYSTEM_PROMPT}\n\nUser message: ${message}`,
        parameters: {
          decoding_method: "greedy",
          max_new_tokens: 300,
          temperature: 0.7,
          top_p: 0.9,
          stop_sequences: ["\n\n", "User:", "BUTTONS:"]
        },
        model_id: "ibm/granite-13b-chat-v2",
        project_id: watsonxProjectId
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('IBM watsonx API error:', data);
      throw new Error(data.error?.message || data.message || 'Failed to get response from IBM watsonx');
    }

    const generatedText = data.results?.[0]?.generated_text;
    
    if (!generatedText) {
      throw new Error('No response generated from IBM watsonx');
    }

    console.log(`Generated response for user ${userId}: ${generatedText.substring(0, 100)}...`);

    // Extract buttons if present
    let responseText = generatedText;
    let buttons = null;
    
    const buttonMatch = generatedText.match(/BUTTONS:\s*(\[.*?\])/);
    if (buttonMatch) {
      try {
        buttons = JSON.parse(buttonMatch[1]);
        responseText = generatedText.replace(/BUTTONS:\s*\[.*?\]/, '').trim();
      } catch (e) {
        console.warn('Failed to parse buttons:', e);
      }
    }

    return new Response(JSON.stringify({ 
      response: responseText,
      buttons: buttons,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in watsonx-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred',
      fallbackResponse: "I'm here to listen and support you. Could you tell me a bit more about how you're feeling right now?"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});