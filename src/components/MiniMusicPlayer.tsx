
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useMusic } from '@/context/MusicContext';
import { Button } from './ui/button';
import { Music, Play, Pause, X, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

const LOCAL_STORAGE_POSITION_KEY = 'weekglance_mini_player_position_v1';

export const MiniMusicPlayer = () => {
    const { tracks, currentTrack, isPlaying, handlePlayPause, handleNextTrack, handlePrevTrack, closePlayer } = useMusic();
    const pathname = usePathname();
    const router = useRouter();
    const playerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 10 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const hasBeenPositioned = useRef(false);

    useEffect(() => {
        if (currentTrack && pathname !== '/private-music-player') {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [currentTrack, pathname]);


    useEffect(() => {
        if (isVisible && playerRef.current && !hasBeenPositioned.current) {
            try {
                const savedPosition = localStorage.getItem(LOCAL_STORAGE_POSITION_KEY);
                if (savedPosition) {
                    const parsedPosition = JSON.parse(savedPosition);
                     if (typeof parsedPosition.x === 'number' && typeof parsedPosition.y === 'number') {
                        // Clamp to screen bounds on load
                        const clampedX = Math.max(0, Math.min(parsedPosition.x, window.innerWidth - playerRef.current.offsetWidth));
                        const clampedY = Math.max(0, Math.min(parsedPosition.y, window.innerHeight - playerRef.current.offsetHeight));
                        setPosition({ x: clampedX, y: clampedY });
                    }
                } else {
                    // Set initial position to top-right with margin
                    const initialX = window.innerWidth - playerRef.current.offsetWidth - 10;
                    setPosition({ x: initialX, y: 10 });
                }
            } catch (e) {
                console.error("Failed to parse or set mini player position from localStorage", e);
                if (playerRef.current) {
                    const initialX = window.innerWidth - playerRef.current.offsetWidth - 10;
                    setPosition({ x: initialX, y: 10 });
                }
            }
            hasBeenPositioned.current = true;
        }
    }, [isVisible]);

    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
          if (!isDragging || !playerRef.current) return;
          
          const dx = e.clientX - dragStartPos.current.x;
          const dy = e.clientY - dragStartPos.current.y;
  
          setPosition(prevPos => {
            const newX = prevPos.x + dx;
            const newY = prevPos.y + dy;
            
            const clampedX = Math.max(0, Math.min(newX, window.innerWidth - playerRef.current!.offsetWidth));
            const clampedY = Math.max(0, Math.min(newY, window.innerHeight - playerRef.current!.offsetHeight));

            return { x: clampedX, y: clampedY };
          });

          dragStartPos.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
            }
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

    useEffect(() => {
        if (!isDragging && hasBeenPositioned.current) {
            try {
                localStorage.setItem(LOCAL_STORAGE_POSITION_KEY, JSON.stringify(position));
            } catch (e) {
                console.error("Failed to save mini player position to localStorage", e);
            }
        }
    }, [isDragging, position]);


    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
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
            className={cn(
                "fixed z-[101] flex items-center gap-2 p-2 rounded-full bg-purple-100/80 dark:bg-purple-900/80 backdrop-blur-lg shadow-xl border border-purple-200 dark:border-purple-700/50 cursor-move transition-opacity duration-300",
                !hasBeenPositioned.current && "opacity-0"
            )}
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
                    "flex items-center justify-center h-10 w-10 bg-purple-200 dark:bg-purple-800/50 rounded-full cursor-pointer hover:bg-purple-300/70 dark:hover:bg-purple-800 transition-colors",
                    isPlaying && "animate-[bounce_2s_ease-in-out_infinite]"
                )}
                aria-label="Go to Music Player"
            >
                <Music className="h-5 w-5 text-purple-600 dark:text-purple-300" />
            </button>

            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full cursor-pointer text-purple-700 dark:text-purple-200 hover:bg-purple-200/50 dark:hover:bg-purple-800/60" onClick={handlePrevTrack} disabled={!canSkip}>
                <SkipBack className="h-5 w-5" />
            </Button>
            <Button size="icon" className="h-10 w-10 rounded-full cursor-pointer bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500 text-white" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full cursor-pointer text-purple-700 dark:text-purple-200 hover:bg-purple-200/50 dark:hover:bg-purple-800/60" onClick={handleNextTrack} disabled={!canSkip}>
                <SkipForward className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full cursor-pointer text-purple-500 dark:text-purple-400 hover:bg-purple-200/50 dark:hover:bg-purple-800/60" onClick={closePlayer}>
                <X className="h-5 w-5" />
            </Button>
        </div>
    );
};
