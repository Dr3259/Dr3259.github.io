
"use client";

import React, { useRef, useEffect } from 'react';
import { useMusic } from '@/context/MusicContext';
import { cn } from '@/lib/utils';
import { getHslColorsFromCategory } from '@/lib/utils';

interface RhythmVisualizerProps {
  className?: string;
}

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
      
      const barWidth = canvas.width / bufferLength;
      let x = 0;

      const hslColors = getHslColorsFromCategory(currentTrack?.category);

      for (let i = 0; i < bufferLength; i++) {
        const distanceFromCenter = Math.abs(i - bufferLength / 2);
        const normalizedDistance = distanceFromCenter / (bufferLength / 2);
        // Create a parabolic scaling factor: 1 at the center, dropping to ~0.2 at the edges.
        const scalingFactor = Math.max(0.2, 1 - Math.pow(normalizedDistance, 2) * 0.8);

        const barHeight = (dataArray[i] * scalingFactor) / 2;
        
        let color;
        const activeColors = hslColors.filter(c => c !== null) as [number, number, number][];

        if (activeColors.length > 0 && activeColors[0] !== null) {
            const gradient = canvasCtx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
            
            activeColors.forEach((hsl, index) => {
                 if (hsl) {
                    const [h, s, lBase] = hsl;
                    const lightness = Math.max(25, Math.min(85, lBase - 20 + (barHeight / 128) * 40));
                    const stopColor = `hsl(${h}, ${s}%, ${lightness}%)`;
                    const stopPosition = activeColors.length > 1 ? index / (activeColors.length - 1) : 0;
                    gradient.addColorStop(stopPosition, stopColor);
                    if (activeColors.length === 1) { 
                         const brighterStopColor = `hsl(${h}, ${s}%, ${Math.min(95, lightness + 15)}%)`;
                         gradient.addColorStop(1, brighterStopColor);
                    }
                 }
            });
            color = gradient;
        } else {
            const primaryColorHslString = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            const opacity = Math.max(0.3, Math.min(1, (barHeight / 128) * 0.8 + 0.2));
            color = `hsla(${primaryColorHslString}, ${opacity})`;
        }

        canvasCtx.fillStyle = color;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth;
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

  return <canvas ref={canvasRef} className={cn("w-full h-24", className)} />;
};
