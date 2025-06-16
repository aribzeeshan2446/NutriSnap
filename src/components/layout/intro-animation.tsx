
'use client';

import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';

type AnimationPhase = 'idle' | 'panelsClosing' | 'contentRevealing' | 'holding' | 'fadingOut' | 'hidden';

interface IntroAnimationProps {
  duration: number;
  onComplete: () => void;
}

const LOGO_TEXT_ENTRY_DELAY_MS = 150; // Delay for the logo/text opacity/scale transition to start

export function IntroAnimation({ duration, onComplete }: IntroAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('idle');

  useEffect(() => {
    setAnimationPhase('panelsClosing');
    const timers: NodeJS.Timeout[] = [];

    // Define timings for each phase based on the passed 'duration'
    const panelAnimationTime = 500; // Duration of panel open/close animations

    const contentRevealStartTime = panelAnimationTime - 50; 
    const contentAnimationActualDuration = 600; 

    const holdStartTime = contentRevealStartTime + contentAnimationActualDuration + LOGO_TEXT_ENTRY_DELAY_MS; 

    const fadeOutEffectDuration = 600; 
    const fadeOutStartTime = Math.max(holdStartTime + 200, duration - fadeOutEffectDuration); 


    timers.push(setTimeout(() => setAnimationPhase('contentRevealing'), contentRevealStartTime)); 
    timers.push(setTimeout(() => setAnimationPhase('holding'), holdStartTime)); 
    timers.push(setTimeout(() => setAnimationPhase('fadingOut'), fadeOutStartTime)); 

    timers.push(setTimeout(() => {
      setAnimationPhase('hidden');
      if (typeof onComplete === 'function') {
        onComplete();
      } else {
        console.error('IntroAnimation Error: onComplete prop was not a function when invoked.');
      }
    }, duration));

    return () => {
      timers.forEach(clearTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]); 

  const showContent = animationPhase === 'contentRevealing' || animationPhase === 'holding';

  // CSS transition/animation classes
  const panelTransformDuration = "duration-500"; 
  const panelEase = "ease-in-out";

  const contentOpacityScaleDuration = "duration-600"; 
  const contentEase = "ease-out";

  const fruitEntryDuration = "0.7s";
  const fruitEntryEase = "cubic-bezier(0.25, 0.1, 0.25, 1)";

  const overallFadeDuration = "duration-600"; 
  const overallFadeEase = "ease-in-out";


  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-900 overflow-hidden",
        `transition-opacity ${overallFadeDuration} ${overallFadeEase}`,
        animationPhase === 'fadingOut' ? 'opacity-0' : 'opacity-100',
        animationPhase === 'hidden' ? 'opacity-0 pointer-events-none !hidden' : ''
      )}
    >
        <>
          {/* Panels */}
          <div
            className={cn(`absolute bg-slate-800 transition-transform ${panelTransformDuration} ${panelEase}`, "top-0 left-0 w-full h-1/2 origin-bottom")}
            style={{ transform: (animationPhase === 'panelsClosing' || animationPhase === 'contentRevealing') ? 'scaleY(1)' : 'scaleY(0)' }}
          />
          <div
            className={cn(`absolute bg-slate-800 transition-transform ${panelTransformDuration} ${panelEase}`, "bottom-0 left-0 w-full h-1/2 origin-top")}
            style={{ transform: (animationPhase === 'panelsClosing' || animationPhase === 'contentRevealing') ? 'scaleY(1)' : 'scaleY(0)' }}
          />
          <div
            className={cn(`absolute bg-slate-800 transition-transform ${panelTransformDuration} ${panelEase}`, "top-0 left-0 w-1/2 h-full origin-right")}
            style={{ transform: (animationPhase === 'panelsClosing' || animationPhase === 'contentRevealing') ? 'scaleX(1)' : 'scaleX(0)', transitionDelay: `${100}ms` }}
          />
          <div
            className={cn(`absolute bg-slate-800 transition-transform ${panelTransformDuration} ${panelEase}`, "top-0 right-0 w-1/2 h-full origin-left")}
            style={{ transform: (animationPhase === 'panelsClosing' || animationPhase === 'contentRevealing') ? 'scaleX(1)' : 'scaleX(0)', transitionDelay: `${100}ms` }}
          />

          {/* Logo and App Name */}
          <div
            className={cn(
              "absolute flex flex-col items-center justify-center text-center",
              `transition-all ${contentOpacityScaleDuration} ${contentEase}`,
              showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90',
              animationPhase === 'holding' && 'animate-logo-pulse'
            )}
            style={{ transitionDelay: showContent ? `${LOGO_TEXT_ENTRY_DELAY_MS}ms` : '0ms' }}
          >
            <Icons.Flame className="h-28 w-28 text-primary mb-3" />
            <h1 className="text-4xl font-bold text-white tracking-tight">
              NutriSnap
            </h1>
          </div>

          {/* Animated Fruit Icons - Conditionally render based on showContent for performance */}
          {showContent && (
            <>
              <Icons.Apple className={cn("absolute h-16 w-16 text-white/70 animate-fruit-apple", "opacity-0")} style={{ top: '20%', left: '15%', animationDelay: '0.3s' }} data-ai-hint="apple fruit"/>
              <Icons.Grape className={cn("absolute h-16 w-16 text-white/70 animate-fruit-grape", "opacity-0")} style={{ top: '60%', right: '10%', animationDelay: '0.45s' }} data-ai-hint="grape fruit"/>
              <Icons.Citrus className={cn("absolute h-16 w-16 text-white/70 animate-fruit-citrus", "opacity-0")} style={{ bottom: '20%', left: '25%', animationDelay: '0.6s' }} data-ai-hint="citrus fruit"/>
              <Icons.Cherry className={cn("absolute h-16 w-16 text-white/70 animate-fruit-cherry", "opacity-0")} style={{ top: '15%', right: '20%', animationDelay: '0.75s' }} data-ai-hint="cherry fruit"/>
            </>
          )}

          <style jsx global>{`
            @keyframes logoPulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.02); }
            }
            .animate-logo-pulse {
              animation: logoPulse 2s ease-in-out infinite;
            }

            @keyframes foodIconFloat {
              0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
              25% { transform: translateY(-8px) translateX(-2px) rotate(-2deg); }
              50% { transform: translateY(0px) translateX(0px) rotate(0deg); }
              75% { transform: translateY(8px) translateX(2px) rotate(2deg); }
            }

            @keyframes fruitEnterSmooth {
              0% { opacity: 0; transform: scale(0.6) rotate(-10deg); }
              100% { opacity: 1; transform: scale(1) rotate(0deg); }
            }

            .animate-fruit-apple, .animate-fruit-grape, .animate-fruit-citrus, .animate-fruit-cherry {
              animation-fill-mode: forwards;
            }

            .animate-fruit-apple {
              animation-name: fruitEnterSmooth, foodIconFloat;
              animation-duration: ${fruitEntryDuration}, 6.8s;
              animation-timing-function: ${fruitEntryEase}, ease-in-out;
              animation-delay: inherit, calc(${fruitEntryDuration} + var(--animation-delay, 0.3s));
              animation-iteration-count: 1, infinite;
              transform-origin: center center;
            }
            .animate-fruit-grape {
              animation-name: fruitEnterSmooth, foodIconFloat;
              animation-duration: ${fruitEntryDuration}, 7.2s;
              animation-timing-function: ${fruitEntryEase}, ease-in-out;
              animation-delay: inherit, calc(${fruitEntryDuration} + var(--animation-delay, 0.45s));
              animation-iteration-count: 1, infinite;
              transform-origin: center center;
            }
            .animate-fruit-citrus {
              animation-name: fruitEnterSmooth, foodIconFloat;
              animation-duration: ${fruitEntryDuration}, 6.3s;
              animation-timing-function: ${fruitEntryEase}, ease-in-out;
              animation-delay: inherit, calc(${fruitEntryDuration} + var(--animation-delay, 0.6s));
              animation-iteration-count: 1, infinite;
              transform-origin: center center;
            }
            .animate-fruit-cherry {
              animation-name: fruitEnterSmooth, foodIconFloat;
              animation-duration: ${fruitEntryDuration}, 7.8s;
              animation-timing-function: ${fruitEntryEase}, ease-in-out;
              animation-delay: inherit, calc(${fruitEntryDuration} + var(--animation-delay, 0.75s));
              animation-iteration-count: 1, infinite;
              transform-origin: center center;
            }

            .animate-fruit-apple.opacity-0,
            .animate-fruit-grape.opacity-0,
            .animate-fruit-citrus.opacity-0,
            .animate-fruit-cherry.opacity-0 {
                opacity: 0;
            }
          `}</style>
        </>
    </div>
  );
}
