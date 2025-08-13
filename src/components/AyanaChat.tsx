import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ayanaAvatar from '@/assets/ayana-avatar.png';
import { BreathingExercise } from './BreathingExercise';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [showBreathing, setShowBreathing] = useState(false);
  const [sentiment, setSentiment] = useState<SentimentIndicator | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const conversationFlow = [
    {
      type: 'user',
      content: "I'm so tired of this. I can't keep up.",
      sentiment: {
        level: 'moderate distress',
        type: 'burnout',
        module: 'breathing guide'
      }
    },
    {
      type: 'ayana',
      content: "That sounds like a lot, Steve. Want to take a moment to breathe together?",
      buttons: [
        { text: 'Try breathing', action: 'breathing' },
        { text: 'Not now', action: 'skip_breathing' }
      ]
    },
    {
      type: 'ayana',
      content: "You did well. Want me to check in with you tomorrow?",
      buttons: [
        { text: 'Yes, please', action: 'check_in' },
        { text: "No, I'm okay", action: 'no_check_in' }
      ]
    },
    {
      type: 'ayana',
      content: "Would you like me to notify someone you trust?",
      buttons: [
        { text: 'Yes – message my brother', action: 'notify_contact' },
        { text: 'No, keep it private', action: 'keep_private' }
      ]
    }
  ];

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

  const simulateTyping = (callback: () => void, delay = 1500) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const handleButtonClick = (action: string) => {
    switch (action) {
      case 'breathing':
        setShowBreathing(true);
        break;
      case 'skip_breathing':
        simulateTyping(() => {
          addMessage('ayana', "That's okay. I'm here whenever you need me.");
          setTimeout(() => nextStep(), 1000);
        });
        break;
      case 'check_in':
        addMessage('ayana', "Perfect. I'll gently reach out tomorrow evening. Take care of yourself, Steve. 💙");
        setTimeout(() => nextStep(), 1000);
        break;
      case 'no_check_in':
        addMessage('ayana', "I understand. Remember, I'm always here if you need support.");
        setTimeout(() => nextStep(), 1000);
        break;
      case 'notify_contact':
        addMessage('ayana', "I'll send a gentle message to your brother letting him know you could use some support. You're not alone in this.");
        break;
      case 'keep_private':
        addMessage('ayana', "Of course. Your privacy is important. I'll keep this between us.");
        break;
    }
  };

  const nextStep = () => {
    if (currentStep < conversationFlow.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const onBreathingComplete = () => {
    setShowBreathing(false);
    simulateTyping(() => {
      addMessage('ayana', "You did well. Want me to check in with you tomorrow?", [
        { text: 'Yes, please', action: 'check_in' },
        { text: "No, I'm okay", action: 'no_check_in' }
      ]);
      setCurrentStep(2);
    });
  };

  useEffect(() => {
    // Start the conversation
    setTimeout(() => {
      addMessage('user', "I'm so tired of this. I can't keep up.");
      setSentiment({
        level: 'moderate distress',
        type: 'burnout',
        module: 'breathing guide'
      });
    }, 1000);

    setTimeout(() => {
      simulateTyping(() => {
        addMessage('ayana', "That sounds like a lot, Steve. Want to take a moment to breathe together?", [
          { text: 'Try breathing', action: 'breathing' },
          { text: 'Not now', action: 'skip_breathing' }
        ]);
        setCurrentStep(1);
      });
    }, 2500);
  }, []);

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
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-border/50">
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
            <div className="space-y-6 max-h-96 overflow-y-auto">
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
                      S
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
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};