
"use client";

import React, { useRef, useEffect } from 'react';
import { useMusic } from '@/context/MusicContext';
import { cn } from '@/lib/utils';

interface RhythmVisualizerProps {
  className?: string;
}

export const RhythmVisualizer: React.FC<RhythmVisualizerProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { audioRef, isPlaying } = useMusic();

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    if (!audioRef.current) return;

    const setupAudioContext = () => {
        // Initialize AudioContext and Analyser only once
        if (!audioContextRef.current) {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = context;
            
            const analyser = context.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;
        }

        // Connect source only if it doesn't exist
        if (!sourceRef.current) {
            const source = audioContextRef.current.createMediaElementSource(audioRef.current);
            sourceRef.current = source;
            source.connect(analyserRef.current!);
            analyserRef.current!.connect(audioContextRef.current.destination);
        }
    }
    
    // Attempt to set up on mount, but it might need user interaction
    setupAudioContext();

    const draw = () => {
      const canvas = canvasRef.current;
      const analyser = analyserRef.current;
      if (!canvas || !analyser) {
        return;
      }
      const canvasCtx = canvas.getContext('2d');
      if (!canvasCtx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
      const primaryHsl = primaryColor.match(/(\d+)\s*(\d+)%?\s*(\d+)%?/);

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        let color;
        if(primaryHsl) {
            const [h, s, l] = primaryHsl.slice(1).map(Number);
            // Vary lightness based on bar height
            const lightness = Math.max(30, Math.min(70, 40 + (dataArray[i] / 255) * 40));
            color = `hsl(${h}, ${s}%, ${lightness}%)`;
        } else {
             color = `rgba(135, 206, 235, ${Math.max(0.2, barHeight / canvas.height)})` // Fallback
        }

        canvasCtx.fillStyle = color;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 2; // Add spacing between bars
      }

      if (isPlaying) {
        animationFrameId.current = requestAnimationFrame(draw);
      }
    };

    const startVisualization = () => {
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
        draw();
    };

    const stopVisualization = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        
        const canvas = canvasRef.current;
        if (canvas) {
            const canvasCtx = canvas.getContext('2d');
            canvasCtx?.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    };
    
    if (isPlaying) {
      startVisualization();
    } else {
      stopVisualization();
    }
    
    // Add event listener to handle first user interaction
    const handleFirstPlay = () => {
        setupAudioContext();
        if (audioRef.current) {
            audioRef.current.removeEventListener('play', handleFirstPlay);
        }
    };

    if (audioRef.current) {
        audioRef.current.addEventListener('play', handleFirstPlay);
    }

    return () => {
      stopVisualization();
      if (audioRef.current) {
         audioRef.current.removeEventListener('play', handleFirstPlay);
      }
      // Do not disconnect or close context, as it can be reused.
    };
  }, [isPlaying, audioRef]);

  return <canvas ref={canvasRef} className={cn("w-full h-16", className)} />;
};
