import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface BreathingExerciseProps {
  onComplete: () => void;
}

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const phaseInstructions = {
    inhale: 'Breathe in slowly...',
    hold: 'Hold your breath...',
    exhale: 'Breathe out gently...'
  };

  const phaseDurations = {
    inhale: 4,
    hold: 4,
    exhale: 6
  };

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Move to next phase
          if (phase === 'inhale') {
            setPhase('hold');
            return phaseDurations.hold;
          } else if (phase === 'hold') {
            setPhase('exhale');
            return phaseDurations.exhale;
          } else {
            // Completed one cycle
            const newCycle = cycle + 1;
            setCycle(newCycle);
            
            if (newCycle >= 3) {
              // Complete the exercise after 3 cycles
              setIsActive(false);
              setTimeout(onComplete, 2000);
              return 0;
            }
            
            setPhase('inhale');
            return phaseDurations.inhale;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, cycle, onComplete]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCountdown(phaseDurations.inhale);
    setCycle(0);
  };

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-100';
      case 'hold':
        return 'scale-110';
      case 'exhale':
        return 'scale-75';
      default:
        return 'scale-100';
    }
  };

  const getCircleColor = () => {
    switch (phase) {
      case 'inhale':
        return 'bg-breathing-primary';
      case 'hold':
        return 'bg-breathing-secondary';
      case 'exhale':
        return 'bg-breathing-primary';
      default:
        return 'bg-breathing-primary';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-breathing flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        {!isActive && cycle === 0 ? (
          // Start screen
          <>
            <div className="space-y-4">
              <h2 className="text-3xl font-light text-ayana-text">Let's breathe together</h2>
              <p className="text-lg text-ayana-text-soft max-w-md mx-auto">
                We'll do a simple 4-4-6 breathing exercise. Follow the circle and my guidance.
              </p>
            </div>
            
            <div className="relative">
              <div className="w-32 h-32 mx-auto rounded-full bg-breathing-primary/20 border-2 border-breathing-primary/30"></div>
            </div>
            
            <Button 
              onClick={startExercise}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full text-lg transition-all duration-300 hover:scale-105"
            >
              Start breathing exercise
            </Button>
          </>
        ) : cycle >= 3 ? (
          // Completion screen
          <>
            <div className="space-y-4">
              <div className="w-32 h-32 mx-auto rounded-full bg-breathing-primary/30 animate-gentle-pulse"></div>
              <h2 className="text-3xl font-light text-ayana-text">Well done</h2>
              <p className="text-lg text-ayana-text-soft">
                You completed the breathing exercise. Take a moment to notice how you feel.
              </p>
            </div>
          </>
        ) : (
          // Active exercise
          <>
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-light text-ayana-text">
                  {phaseInstructions[phase]}
                </h2>
                <p className="text-4xl font-light text-ayana-text">{countdown}</p>
                <p className="text-sm text-ayana-text-soft">
                  Cycle {cycle + 1} of 3
                </p>
              </div>
              
              <div className="relative flex items-center justify-center">
                <div 
                  className={`
                    w-40 h-40 rounded-full transition-all duration-1000 ease-breathing
                    ${getCircleColor()} ${getCircleScale()}
                    shadow-2xl opacity-80
                  `}
                  style={{
                    filter: 'blur(1px)',
                    boxShadow: `0 0 40px ${phase === 'inhale' ? 'hsl(var(--breathing-primary))' : 'hsl(var(--breathing-secondary))'}`
                  }}
                ></div>
                
                {/* Inner circle */}
                <div 
                  className={`
                    absolute w-24 h-24 rounded-full transition-all duration-1000 ease-breathing
                    ${getCircleColor()} ${getCircleScale()}
                    opacity-60
                  `}
                ></div>
                
                {/* Center dot */}
                <div className="absolute w-4 h-4 rounded-full bg-white/80"></div>
              </div>
            </div>
            
            <Button 
              variant="secondary" 
              onClick={onComplete}
              className="bg-card/80 hover:bg-card text-ayana-text border border-border/50 backdrop-blur-sm"
            >
              Skip exercise
            </Button>
          </>
        )}
      </div>
    </div>
  );
};