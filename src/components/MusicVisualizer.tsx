
"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getColorsFromCategory } from '@/lib/utils';


interface MusicVisualizerProps {
  isPlaying: boolean;
  category: string | null;
}

const animationConfig: Record<string, { animation: string }> = {
    'Pop': { animation: 'animate-energetic-pulse-slow' },
    '流行': { animation: 'animate-energetic-pulse-slow' },
    'Rock': { animation: 'animate-energetic-pulse-fast' },
    '摇滚': { animation: 'animate-energetic-pulse-fast' },
    'Hip-Hop': { animation: 'animate-energetic-pulse-normal' },
    '嘻哈': { animation: 'animate-energetic-pulse-normal' },
    'Electronic': { animation: 'animate-slow-spin-fast' },
    '电子': { animation: 'animate-slow-spin-fast' },
    'Classical': { animation: 'animate-gentle-float' },
    '古典': { animation: 'animate-gentle-float' },
    'Niche': { animation: 'animate-slow-spin-slow' },
    '小众': { animation: 'animate-slow-spin-slow' },
    'Study': { animation: 'animate-gentle-float-study' },
    '学习': { animation: 'animate-gentle-float-study' },
    'Love': { animation: 'animate-gentle-float-love' },
    '恋爱': { animation: 'animate-gentle-float-love' },
    'Healing': { animation: 'animate-gentle-float-healing' },
    '治愈': { animation: 'animate-gentle-float-healing' },
    'Motivational': { animation: 'animate-energetic-pulse-slow' },
    '励志': { animation: 'animate-energetic-pulse-slow' },
    'emo': { animation: 'animate-default-float' },
};

const defaultAnimation = { animation: 'animate-default-float' };

interface Orb {
  size: string;
  top: string;
  left: string;
  delay: string;
  className?: string;
}

const generateOrbs = (count: number): Orb[] => {
    return Array.from({ length: count }, (_, i) => {
        const size = Math.random() * 20 + 10; // 10rem to 30rem
        const top = Math.random() * 100 - 10; // -10% to 90%
        const left = Math.random() * 100 - 10; // -10% to 90%
        const delay = `-${Math.random() * 10}s`;
        
        return {
            size: `${size}rem`,
            top: `${top}%`,
            left: `${left}%`,
            delay: delay,
            className: i > 3 ? 'hidden md:block' : '', // Hide extra orbs on mobile
        };
    });
};


export const MusicVisualizer: React.FC<MusicVisualizerProps> = ({ isPlaying, category }) => {
  const [orbs, setOrbs] = useState<Orb[]>([]);

  useEffect(() => {
    // Generate new orb positions when the category (song) changes
    setOrbs(generateOrbs(5));
  }, [category]);


  const animationClass = useMemo(() => {
    const mainCategory = category?.split(',')[0].trim();
    if (mainCategory && animationConfig[mainCategory]) {
      return animationConfig[mainCategory].animation;
    }
    return defaultAnimation.animation;
  }, [category]);
  
  const colors = useMemo(() => getColorsFromCategory(category), [category]);
  const hasColors = colors.length > 0 && colors[0] !== 'hsl(var(--primary))';


  const baseCircleClass = 'absolute rounded-full bg-gradient-to-br filter blur-xl transition-all duration-1000';
  const animationPlayState = isPlaying ? 'running' : 'paused';
  const playingCircleClass = isPlaying ? 'opacity-50 dark:opacity-30' : 'opacity-10 dark:opacity-5';
  
  return (
    <div className="absolute inset-0 overflow-hidden bg-transparent z-0">
       {orbs.map((orb, index) => {
         const color = hasColors ? colors[index % colors.length] : 'hsl(var(--primary))';
         return (
             <div
                key={index}
                className={cn(baseCircleClass, playingCircleClass, animationClass, orb.className)}
                style={{ 
                    width: orb.size, 
                    height: orb.size, 
                    top: orb.top, 
                    left: orb.left, 
                    backgroundColor: color, 
                    animationDelay: orb.delay, 
                    animationPlayState: animationPlayState as React.CSSProperties['animationPlayState']
                }}
              />
          );
       })}
    </div>
  );
};
