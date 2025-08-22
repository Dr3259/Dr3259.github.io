
"use client";
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface MusicVisualizerProps {
  isPlaying: boolean;
  category: string | null;
}

const animationMap: Record<string, string> = {
    'Pop': 'animate-[energetic-pulse_3s_ease-in-out_infinite]',
    'Rock': 'animate-[energetic-pulse_2s_ease-in-out_infinite]',
    'Hip-Hop': 'animate-[energetic-pulse_2.5s_ease-in-out_infinite]',
    'Electronic': 'animate-[slow-spin_20s_linear_infinite]',
    'Classical': 'animate-[gentle-float_8s_ease-in-out_infinite]',
    'Niche': 'animate-[slow-spin_30s_linear_infinite]',
    'Study': 'animate-[gentle-float_12s_ease-in-out_infinite]',
    'Love': 'animate-[gentle-float_10s_ease-in-out_infinite]',
    'Healing': 'animate-[gentle-float_15s_ease-in-out_infinite]',
    'Motivational': 'animate-[energetic-pulse_3s_ease-in-out_infinite]',
};

const defaultAnimation = 'animate-[gentle-float_10s_ease-in-out_infinite]';

export const MusicVisualizer: React.FC<MusicVisualizerProps> = ({ isPlaying, category }) => {
  const animationClass = useMemo(() => {
    if (!isPlaying) return 'paused';
    if (category && animationMap[category]) {
      return animationMap[category];
    }
    return defaultAnimation;
  }, [isPlaying, category]);

  const baseCircleClass = 'absolute rounded-full bg-gradient-to-br filter blur-xl transition-all duration-1000';
  const playingCircleClass = isPlaying ? 'opacity-50 dark:opacity-30' : 'opacity-10 dark:opacity-5';

  return (
    <div className="absolute inset-0 overflow-hidden bg-background -z-10">
      <div
        className={cn(baseCircleClass, playingCircleClass, 'w-64 h-64 top-[-10%] left-[-5%]', 'from-blue-300 to-cyan-300', animationClass)}
        style={{ animationDelay: '0s' }}
      />
      <div
        className={cn(baseCircleClass, playingCircleClass, 'w-72 h-72 bottom-[-15%] right-[5%]', 'from-purple-300 to-indigo-300', animationClass)}
        style={{ animationDelay: '-2s' }}
      />
      <div
        className={cn(baseCircleClass, playingCircleClass, 'w-56 h-56 top-[15%] right-[10%]', 'from-pink-300 to-red-300', animationClass)}
        style={{ animationDelay: '-4s' }}
      />
      <div
        className={cn(baseCircleClass, playingCircleClass, 'w-48 h-48 bottom-[20%] left-[15%]', 'from-green-300 to-teal-300', animationClass)}
        style={{ animationDelay: '-6s' }}
      />
       <div
        className={cn(baseCircleClass, playingCircleClass, 'w-80 h-80 top-[40%] left-[30%] hidden md:block', 'from-yellow-200 to-orange-300', animationClass)}
        style={{ animationDelay: '-8s' }}
      />
    </div>
  );
};
