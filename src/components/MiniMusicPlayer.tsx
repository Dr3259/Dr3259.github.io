
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useMusic } from '@/context/MusicContext';
import { Button } from './ui/button';
import { Music, Play, Pause, X, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

export const MiniMusicPlayer = () => {
    const { tracks, currentTrack, isPlaying, handlePlayPause, handleNextTrack, handlePrevTrack, closePlayer } = useMusic();
    const pathname = usePathname();
    const router = useRouter();
    const playerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 20, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Set initial position once window is available on the client
        setPosition({ x: 20, y: window.innerHeight - 80 });
    }, []);

    useEffect(() => {
        // Only show if there's a track and we are NOT on the main player page
        if (currentTrack && pathname !== '/private-music-player') {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [currentTrack, pathname]);
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
          if (!isDragging || !playerRef.current) return;
          
          const dx = e.clientX - dragStartPos.current.x;
          const dy = e.clientY - dragStartPos.current.y;
  
          setPosition(prevPos => {
            const newX = prevPos.x + dx;
            const newY = prevPos.y + dy;
            
            // Clamp position to be within viewport
            const clampedX = Math.max(0, Math.min(newX, window.innerWidth - playerRef.current!.offsetWidth));
            const clampedY = Math.max(0, Math.min(newY, window.innerHeight - playerRef.current!.offsetHeight));

            return { x: clampedX, y: clampedY };
          });

          dragStartPos.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };
    
        if (isDragging) {
            document.body.style.userSelect = 'none';
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            document.body.style.userSelect = '';
        }
    
        return () => {
          document.body.style.userSelect = '';
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);


    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        // Prevent dragging when clicking on buttons
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        setIsDragging(true);
        dragStartPos.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push('/private-music-player');
    };

    if (!isVisible) {
        return null;
    }

    const canSkip = tracks.length > 1;

    return (
        <div
            ref={playerRef}
            className="fixed z-[101] flex items-center gap-2 p-2 rounded-full bg-rose-100/80 dark:bg-rose-900/80 backdrop-blur-lg shadow-xl border border-rose-200 dark:border-rose-700/50 cursor-move transition-opacity duration-300"
            style={{ 
                left: `${position.x}px`, 
                top: `${position.y}px`,
                touchAction: 'none'
            }}
            onMouseDown={handleMouseDown}
        >
            <button 
                onClick={handleIconClick}
                className={cn(
                    "flex items-center justify-center h-10 w-10 bg-rose-200 dark:bg-rose-800/50 rounded-full cursor-pointer hover:bg-rose-300/70 dark:hover:bg-rose-800 transition-colors",
                    isPlaying && "animate-[bounce_2s_ease-in-out_infinite]"
                )}
                aria-label="Go to Music Player"
            >
                <Music className="h-5 w-5 text-rose-600 dark:text-rose-300" />
            </button>

            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full cursor-pointer text-rose-700 dark:text-rose-200 hover:bg-rose-200/50 dark:hover:bg-rose-800/60" onClick={handlePrevTrack} disabled={!canSkip}>
                <SkipBack className="h-5 w-5" />
            </Button>
            <Button size="icon" className="h-10 w-10 rounded-full cursor-pointer bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500 text-white" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full cursor-pointer text-rose-700 dark:text-rose-200 hover:bg-rose-200/50 dark:hover:bg-rose-800/60" onClick={handleNextTrack} disabled={!canSkip}>
                <SkipForward className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full cursor-pointer text-rose-500 dark:text-rose-400 hover:bg-rose-200/50 dark:hover:bg-rose-800/60" onClick={closePlayer}>
                <X className="h-5 w-5" />
            </Button>
        </div>
    );
};
