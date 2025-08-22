
"use client";
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { getColorsFromCategory } from '@/lib/utils';


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
    const mainCategory = category?.split(',')[0].trim();
    if (mainCategory && animationConfig[mainCategory]) {
      return animationConfig[mainCategory].animation;
    }
    return defaultAnimation.animation;
  }, [category]);
  
  const colors = useMemo(() => getColorsFromCategory(category), [category]);

  const baseCircleClass = 'absolute rounded-full bg-gradient-to-br filter blur-xl transition-all duration-1000';
  const animationPlayState = isPlaying ? 'running' : 'paused';
  const playingCircleClass = isPlaying ? 'opacity-50 dark:opacity-30' : 'opacity-10 dark:opacity-5';

  const orbs = [
      { size: '24rem', top: '-5rem', left: '-5rem', delay: '0s', color: colors[0] },
      { size: '18rem', bottom: '-15%', right: '5%', delay: '-2s', color: colors[1] || colors[0] },
      { size: '14rem', top: '15%', right: '10%', delay: '-4s', color: colors[0] },
      { size: '12rem', bottom: '20%', left: '15%', delay: '-6s', color: colors[1] || colors[0] },
      { size: '20rem', top: '40%', left: '30%', delay: '-8s', className: 'hidden md:block', color: colors[0] },
  ];
  
  return (
    <div className="absolute inset-0 overflow-hidden bg-transparent z-0">
       {orbs.map((orb, index) => (
         <div
            key={index}
            className={cn(baseCircleClass, playingCircleClass, animationClass, orb.className)}
            style={{ 
                width: orb.size, 
                height: orb.size, 
                top: orb.top, 
                left: orb.left, 
                bottom: orb.bottom,
                right: orb.right,
                backgroundColor: orb.color, 
                animationDelay: orb.delay, 
                animationPlayState: animationPlayState as React.CSSProperties['animationPlayState']
            }}
          />
       ))}
    </div>
  );
};
