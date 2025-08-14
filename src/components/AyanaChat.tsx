import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ayanaAvatar from '@/assets/ayana-avatar.png';
import { BreathingExercise } from './BreathingExercise';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'user' | 'ayana';
  content: string;
  timestamp: Date;
  buttons?: Array<{
    text: string;
    action: string;
  }>;
}

interface SentimentIndicator {
  level: string;
  type: string;
  module: string;
}

export const AyanaChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showBreathing, setShowBreathing] = useState(false);
  const [sentiment, setSentiment] = useState<SentimentIndicator | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const addMessage = (sender: 'user' | 'ayana', content: string, buttons?: Array<{text: string; action: string}>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender,
      content,
      timestamp: new Date(),
      buttons
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (delay = 1500) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, delay);
  };

  const handleButtonClick = (action: string) => {
    switch (action) {
      case 'breathing':
        setShowBreathing(true);
        break;
      case 'notify':
        simulateTyping();
        setTimeout(() => {
          addMessage('ayana', "Reaching out is a brave step. Want to text someone now, or would you like me to help you think of what to say?");
        }, 1500);
        break;
      case 'crisis':
        window.open('tel:988', '_blank');
        simulateTyping();
        setTimeout(() => {
          addMessage('ayana', "I'm proud of you for reaching out. You're not alone in this.");
        }, 1500);
        break;
      case 'skip_breathing':
        simulateTyping();
        setTimeout(() => {
          addMessage('ayana', "That's okay. I'm here whenever you need me. How are you feeling right now?");
        }, 1500);
        break;
      case 'start_chat':
        setHasStarted(true);
        addMessage('user', "I'd like to talk");
        simulateTyping();
        setTimeout(() => {
          addMessage('ayana', "I'm so glad you're here. This is a safe space where you can share whatever is on your mind. What's bringing you here today?");
        }, 1500);
        break;
    }
  };

  const handleUserMessage = async () => {
    if (!userInput.trim() || isAiResponding || !user) return;

    const message = userInput.trim();
    setUserInput('');
    
    // Add user message
    addMessage('user', message);
    
    setIsAiResponding(true);
    simulateTyping();

    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { 
          message: message,
          userId: user.id 
        }
      });

      if (error) throw error;

      // Add AI response
      setTimeout(() => {
        setIsTyping(false);
        addMessage('ayana', data.response || data.fallbackResponse || "I'm here to support you. Could you tell me more about how you're feeling?", data.buttons);
        setIsAiResponding(false);
      }, 1500);

    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);
      setIsAiResponding(false);
      addMessage('ayana', "I'm having trouble connecting right now, but I'm here to listen. Could you tell me more about what's on your mind?");
      toast.error('Connection issue. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserMessage();
    }
  };

  const onBreathingComplete = () => {
    setShowBreathing(false);
    simulateTyping();
    setTimeout(() => {
      addMessage('ayana', "You did wonderfully with that breathing exercise. How are you feeling now? Would you like to talk about what brought you here today?");
    }, 1500);
  };

  useEffect(() => {
    // Start with welcome message
    setTimeout(() => {
      addMessage('ayana', "Hello, I'm Ayana. I'm here to provide you with emotional support and a safe space to talk. How would you like to begin?", [
        { text: 'Start chatting', action: 'start_chat' },
        { text: 'Try breathing exercise', action: 'breathing' }
      ]);
    }, 1000);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (showBreathing) {
    return <BreathingExercise onComplete={onBreathingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-calming flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Sentiment Indicators */}
        {sentiment && (
          <div className="mb-6 space-y-2">
            <div className="flex gap-4 text-sm">
              <span className="px-3 py-1 bg-ayana-warm rounded-full text-ayana-text">
                Sentiment detected: {sentiment.level}
              </span>
              <span className="px-3 py-1 bg-ayana-secondary rounded-full text-ayana-text">
                Crisis type: {sentiment.type}
              </span>
              <span className="px-3 py-1 bg-ayana-sage rounded-full text-ayana-text">
                Response module triggered: {sentiment.module}
              </span>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <Card className="shadow-gentle border-0 bg-card/80 backdrop-blur-sm">
          <div className="flex flex-col h-[600px]">
            {/* Header */}
            <div className="flex items-center gap-4 p-6 border-b border-border/50">
              <div className="relative">
                <img 
                  src={ayanaAvatar} 
                  alt="Ayana" 
                  className="w-16 h-16 rounded-full animate-gentle-pulse"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-card"></div>
              </div>
              <div>
                <h2 className="text-xl font-medium text-ayana-text">Ayana</h2>
                <p className="text-sm text-ayana-text-soft">Your gentle AI companion</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {messages.map((message, index) => (
                <div 
                  key={message.id}
                  className={`animate-fade-in flex gap-4 ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {message.sender === 'ayana' && (
                    <img 
                      src={ayanaAvatar} 
                      alt="Ayana" 
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                  )}
                  
                  <div className="flex-1 max-w-xs">
                    <div className={`
                      p-4 rounded-2xl transition-all duration-300
                      ${message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground ml-auto' 
                        : 'bg-card shadow-card border border-border/50'
                      }
                    `}>
                      <p className={`text-base leading-relaxed ${
                        message.sender === 'user' ? 'text-primary-foreground' : 'text-ayana-text'
                      }`}>
                        {message.content}
                      </p>
                    </div>
                    
                    {message.buttons && (
                      <div className="flex gap-2 mt-3">
                        {message.buttons.map((button, idx) => (
                          <Button
                            key={idx}
                            variant="secondary"
                            size="sm"
                            className="text-xs rounded-full bg-ayana-secondary hover:bg-ayana-primary hover:text-white transition-all duration-300"
                            onClick={() => handleButtonClick(button.action)}
                          >
                            {button.text}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ayana-primary to-ayana-secondary flex items-center justify-center text-white font-medium flex-shrink-0">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-4 animate-fade-in">
                  <img 
                    src={ayanaAvatar} 
                    alt="Ayana" 
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="bg-card shadow-card border border-border/50 p-4 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-ayana-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-ayana-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-ayana-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {hasStarted && (
              <div className="p-4 border-t bg-card">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Share what's on your mind..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isAiResponding}
                    className="flex-1 bg-background"
                  />
                  <Button 
                    onClick={handleUserMessage}
                    disabled={!userInput.trim() || isAiResponding}
                    variant="default"
                    className="bg-ayana-primary hover:bg-ayana-primary/90"
                  >
                    Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};