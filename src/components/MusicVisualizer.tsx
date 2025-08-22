
"use client";
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface MusicVisualizerProps {
  isPlaying: boolean;
  category: string | null;
}

const animationConfig: Record<string, { animation: string, duration: string }> = {
    'Pop': { animation: 'energetic-pulse', duration: '3s' },
    'Rock': { animation: 'energetic-pulse', duration: '2s' },
    'Hip-Hop': { animation: 'energetic-pulse', duration: '2.5s' },
    'Electronic': { animation: 'slow-spin', duration: '20s' },
    'Classical': { animation: 'gentle-float', duration: '8s' },
    'Niche': { animation: 'slow-spin', duration: '30s' },
    'Study': { animation: 'gentle-float', duration: '12s' },
    'Love': { animation: 'gentle-float', duration: '10s' },
    'Healing': { animation: 'gentle-float', duration: '15s' },
    'Motivational': { animation: 'energetic-pulse', duration: '3s' },
};

const defaultAnimation = { animation: 'gentle-float', duration: '10s' };

export const MusicVisualizer: React.FC<MusicVisualizerProps> = ({ isPlaying, category }) => {
  const getAnimationProperties = (cat: string | null) => {
    if (cat && animationConfig[cat]) {
      return animationConfig[cat];
    }
    return defaultAnimation;
  };
  
  const animationProps = useMemo(() => getAnimationProperties(category), [category]);
  const animationClass = `animate-${animationProps.animation}`;

  const baseCircleClass = 'absolute rounded-full bg-gradient-to-br filter blur-xl transition-all duration-1000';
  const playingCircleClass = isPlaying ? 'opacity-50 dark:opacity-30' : 'opacity-10 dark:opacity-5';
  
  const getDynamicStyle = (delay: string): React.CSSProperties => ({
      animationDuration: animationProps.duration,
      animationPlayState: isPlaying ? 'running' : 'paused',
      animationDelay: delay,
  });

  return (
    <div className="absolute inset-0 overflow-hidden bg-background -z-10">
       <div
        className={cn(baseCircleClass, playingCircleClass, animationClass, 'w-96 h-96 -top-20 -left-20 from-blue-300 to-cyan-300 dark:from-blue-900/70 dark:to-cyan-900/70')}
        style={getDynamicStyle('0s')}
      />
      <div
        className={cn(baseCircleClass, playingCircleClass, animationClass, 'w-72 h-72 bottom-[-15%] right-[5%]', 'from-purple-300 to-indigo-300 dark:from-purple-900/70 dark:to-indigo-900/70')}
        style={getDynamicStyle('-2s')}
      />
      <div
        className={cn(baseCircleClass, playingCircleClass, animationClass, 'w-56 h-56 top-[15%] right-[10%]', 'from-pink-300 to-red-300 dark:from-pink-900/70 dark:to-red-900/70')}
        style={getDynamicStyle('-4s')}
      />
      <div
        className={cn(baseCircleClass, playingCircleClass, animationClass, 'w-48 h-48 bottom-[20%] left-[15%]', 'from-green-300 to-teal-300 dark:from-green-900/70 dark:to-teal-900/70')}
        style={getDynamicStyle('-6s')}
      />
       <div
        className={cn(baseCircleClass, playingCircleClass, animationClass, 'w-80 h-80 top-[40%] left-[30%] hidden md:block', 'from-yellow-200 to-orange-300 dark:from-yellow-900/70 dark:to-orange-900/70')}
        style={getDynamicStyle('-8s')}
      />
    </div>
  );
};
