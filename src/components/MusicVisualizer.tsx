
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
  const pausedAnimationClass = !isPlaying ? 'animation-paused' : '';

  return (
    <div className="absolute inset-0 overflow-hidden bg-background -z-10">
       <div
        className={cn(baseCircleClass, playingCircleClass, animationClass, pausedAnimationClass, 'w-96 h-96 -top-20 -left-20 from-blue-300 to-cyan-300 dark:from-blue-900/70 dark:to-cyan-900/70')}
        style={{ animationDelay: '0s' }}
      />
      <div
        className={cn(baseCircleClass, playingCircleClass, animationClass, pausedAnimationClass, 'w-72 h-72 bottom-[-15%] right-[5%]', 'from-purple-300 to-indigo-300 dark:from-purple-900/70 dark:to-indigo-900/70')}
        style={{ animationDelay: '-2s' }}
      />
      <div
        className={cn(baseCircleClass, playingCircleClass, animationClass, pausedAnimationClass, 'w-56 h-56 top-[15%] right-[10%]', 'from-pink-300 to-red-300 dark:from-pink-900/70 dark:to-red-900/70')}
        style={{ animationDelay: '-4s' }}
      />
      <div
        className={cn(baseCircleClass, playingCircleClass, animationClass, pausedAnimationClass, 'w-48 h-48 bottom-[20%] left-[15%]', 'from-green-300 to-teal-300 dark:from-green-900/70 dark:to-teal-900/70')}
        style={{ animationDelay: '-6s' }}
      />
       <div
        className={cn(baseCircleClass, playingCircleClass, animationClass, pausedAnimationClass, 'w-80 h-80 top-[40%] left-[30%] hidden md:block', 'from-yellow-200 to-orange-300 dark:from-yellow-900/70 dark:to-orange-900/70')}
        style={{ animationDelay: '-8s' }}
      />
    </div>
  );
};
