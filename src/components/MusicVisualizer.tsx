
"use client";
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface MusicVisualizerProps {
  isPlaying: boolean;
  category: string | null;
}

const animationConfig: Record<string, { animation: string }> = {
    'Pop': { animation: 'animate-energetic-pulse-slow' },
    'Rock': { animation: 'animate-energetic-pulse-fast' },
    'Hip-Hop': { animation: 'animate-energetic-pulse-normal' },
    'Electronic': { animation: 'animate-slow-spin-fast' },
    'Classical': { animation: 'animate-gentle-float' },
    'Niche': { animation: 'animate-slow-spin-slow' },
    'Study': { animation: 'animate-gentle-float-study' },
    'Love': { animation: 'animate-gentle-float-love' },
    'Healing': { animation: 'animate-gentle-float-healing' },
    'Motivational': { animation: 'animate-energetic-pulse-slow' },
};

const defaultAnimation = { animation: 'animate-default-float' };

export const MusicVisualizer: React.FC<MusicVisualizerProps> = ({ isPlaying, category }) => {
  const animationClass = useMemo(() => {
    if (category && animationConfig[category]) {
      return animationConfig[category].animation;
    }
    return defaultAnimation.animation;
  }, [category]);

  const baseCircleClass = 'absolute rounded-full bg-gradient-to-br filter blur-xl transition-all duration-1000';
  const playingCircleClass = isPlaying ? 'opacity-50 dark:opacity-30' : 'opacity-10 dark:opacity-5';
  const animationPlayState = isPlaying ? 'running' : 'paused';
  
  return (
    <div className="absolute inset-0 overflow-hidden bg-transparent z-0">
       <div
        className={cn(baseCircleClass, playingCircleClass, animationClass)}
        style={{ width: '24rem', height: '24rem', top: '-5rem', left: '-5rem', backgroundColor: 'var(--color-blue-300)', animationDelay: '0s', animationPlayState }}
      />
      <div
        className={cn(baseCircleClass, playingCircleClass, animationClass)}
        style={{ width: '18rem', height: '18rem', bottom: '-15%', right: '5%', backgroundColor: 'var(--color-purple-300)', animationDelay: '-2s', animationPlayState }}
      />
      <div
        className={cn(baseCircleClass, playingCircleClass, animationClass)}
        style={{ width: '14rem', height: '14rem', top: '15%', right: '10%', backgroundColor: 'var(--color-pink-300)', animationDelay: '-4s', animationPlayState }}
      />
      <div
        className={cn(baseCircleClass, playingCircleClass, animationClass)}
        style={{ width: '12rem', height: '12rem', bottom: '20%', left: '15%', backgroundColor: 'var(--color-green-300)', animationDelay: '-6s', animationPlayState }}
      />
       <div
        className={cn(baseCircleClass, playingCircleClass, animationClass, 'hidden md:block')}
        style={{ width: '20rem', height: '20rem', top: '40%', left: '30%', backgroundColor: 'var(--color-yellow-200)', animationDelay: '-8s', animationPlayState }}
      />
    </div>
  );
};
