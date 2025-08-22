
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useMusic } from '@/context/MusicContext';
import { Button } from './ui/button';
import { Music, Play, Pause, X, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export const MiniMusicPlayer = () => {
    const { tracks, currentTrack, isPlaying, handlePlayPause, handleNextTrack, handlePrevTrack, closePlayer } = useMusic();
    const pathname = usePathname();
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

    if (!isVisible) {
        return null;
    }

    const canSkip = tracks.length > 1;

    return (
        <div
            ref={playerRef}
            className="fixed z-[101] flex items-center gap-2 p-2 rounded-full bg-background/80 backdrop-blur-md shadow-2xl border cursor-move transition-opacity duration-300"
            style={{ 
                left: `${position.x}px`, 
                top: `${position.y}px`,
                touchAction: 'none' // prevent scrolling on mobile
            }}
            onMouseDown={handleMouseDown}
        >
            <div className="flex items-center justify-center h-10 w-10 bg-primary/20 rounded-full animate-pulse">
                <Music className="h-5 w-5 text-primary" />
            </div>

            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full cursor-pointer" onClick={handlePrevTrack} disabled={!canSkip}>
                <SkipBack className="h-5 w-5" />
            </Button>
            <Button size="icon" className="h-10 w-10 rounded-full cursor-pointer" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full cursor-pointer" onClick={handleNextTrack} disabled={!canSkip}>
                <SkipForward className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full cursor-pointer" onClick={closePlayer}>
                <X className="h-5 w-5 text-muted-foreground" />
            </Button>
        </div>
    );
};
