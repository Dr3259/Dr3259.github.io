
"use client";

import React, { useRef, useEffect } from 'react';
import { useMusic } from '@/context/MusicContext';
import { cn } from '@/lib/utils';

interface RhythmVisualizerProps {
  className?: string;
}

const getTagColorHsl = (tagName: string | null | undefined): [number, number, number] | null => {
    if (!tagName) return null;
    let hash = 0;
    for (let i = 0; i < tagName.length; i++) {
        hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
        hash |= 0; // Ensure 32bit integer
    }
    const h = Math.abs(hash % 360);
    return [h, 70, 65]; // Hue, Saturation, Base Lightness
};


export const RhythmVisualizer: React.FC<RhythmVisualizerProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { audioRef, isPlaying, currentTrack } = useMusic();

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    if (!audioRef.current) return;

    const setupAudioContext = () => {
        if (!audioContextRef.current) {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = context;
            
            const analyser = context.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;
        }
        if (!sourceRef.current) {
            try {
                const source = audioContextRef.current.createMediaElementSource(audioRef.current);
                sourceRef.current = source;
                source.connect(analyserRef.current!);
                analyserRef.current!.connect(audioContextRef.current.destination);
            } catch (error) {
                // This can happen if the source is already connected.
                if (error instanceof DOMException && error.name === 'InvalidStateError') {
                    console.warn("Audio source already connected.");
                } else {
                    throw error;
                }
            }
        }
    }
    
    setupAudioContext();

    const draw = () => {
      const canvas = canvasRef.current;
      const analyser = analyserRef.current;
      if (!canvas || !analyser) return;

      const canvasCtx = canvas.getContext('2d');
      if (!canvasCtx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      analyser.getByteFrequencyData(dataArray);
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      const firstCategory = currentTrack?.category?.split(',')[0].trim();
      const baseHsl = getTagColorHsl(firstCategory);

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2; // Scale down for aesthetics
        
        let color;
        if (baseHsl) {
            const [h, s, lBase] = baseHsl;
            const lightness = Math.max(25, Math.min(85, lBase - 20 + (barHeight / 128) * 40));
            color = `hsl(${h}, ${s}%, ${lightness}%)`;
        } else {
            // Fallback color using CSS variables for theme consistency
            const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            const opacity = Math.max(0.3, Math.min(1, (barHeight / 128) * 0.8 + 0.2));
            color = `hsla(${primaryColor}, ${opacity})`;
        }

        canvasCtx.fillStyle = color;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      if (isPlaying) {
        animationFrameId.current = requestAnimationFrame(draw);
      }
    };

    const startVisualization = () => {
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        draw();
    };

    const stopVisualization = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        const canvas = canvasRef.current;
        if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    
    if (isPlaying) {
      startVisualization();
    } else {
      stopVisualization();
    }
    
    const handleFirstPlay = () => {
        setupAudioContext();
        if (audioRef.current) audioRef.current.removeEventListener('play', handleFirstPlay);
    };

    if (audioRef.current) audioRef.current.addEventListener('play', handleFirstPlay);

    return () => {
      stopVisualization();
      if (audioRef.current) audioRef.current.removeEventListener('play', handleFirstPlay);
    };
  }, [isPlaying, audioRef, currentTrack]);

  return <canvas ref={canvasRef} className={cn("w-full h-full", className)} />;
};

