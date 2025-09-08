"use client";

import React, { useEffect, useRef } from 'react';

interface Wave {
  amplitude: number;
  frequency: number;
  phase: number;
  speed: number;
  color: string;
  opacity: number;
}

export const OceanWavesAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const wavesRef = useRef<Wave[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initWaves();
    };

    const initWaves = () => {
      wavesRef.current = [
        {
          amplitude: canvas.height * 0.1,
          frequency: 0.005,
          phase: 0,
          speed: 0.02,
          color: '#1976d2',
          opacity: 0.6
        },
        {
          amplitude: canvas.height * 0.08,
          frequency: 0.008,
          phase: Math.PI / 3,
          speed: 0.015,
          color: '#1e88e5',
          opacity: 0.5
        },
        {
          amplitude: canvas.height * 0.06,
          frequency: 0.012,
          phase: Math.PI / 2,
          speed: 0.025,
          color: '#2196f3',
          opacity: 0.4
        },
        {
          amplitude: canvas.height * 0.04,
          frequency: 0.015,
          phase: Math.PI,
          speed: 0.03,
          color: '#42a5f5',
          opacity: 0.3
        },
        {
          amplitude: canvas.height * 0.03,
          frequency: 0.02,
          phase: Math.PI * 1.5,
          speed: 0.035,
          color: '#64b5f6',
          opacity: 0.25
        }
      ];
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawBackground = () => {
      // 海洋渐变背景
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#87ceeb'); // 天空蓝
      gradient.addColorStop(0.3, '#4fc3f7'); // 浅蓝
      gradient.addColorStop(0.6, '#29b6f6'); // 中蓝
      gradient.addColorStop(1, '#0277bd'); // 深蓝
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawSun = () => {
      const sunX = canvas.width * 0.8;
      const sunY = canvas.height * 0.2;
      const sunRadius = Math.min(canvas.width, canvas.height) * 0.06;

      // 太阳光晕
      const glowGradient = ctx.createRadialGradient(
        sunX, sunY, sunRadius * 0.3,
        sunX, sunY, sunRadius * 4
      );
      glowGradient.addColorStop(0, 'rgba(255, 193, 7, 0.8)');
      glowGradient.addColorStop(0.3, 'rgba(255, 193, 7, 0.4)');
      glowGradient.addColorStop(1, 'rgba(255, 193, 7, 0)');
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 4, 0, Math.PI * 2);
      ctx.fill();

      // 太阳本体
      const sunGradient = ctx.createRadialGradient(
        sunX - sunRadius * 0.3, sunY - sunRadius * 0.3, 0,
        sunX, sunY, sunRadius
      );
      sunGradient.addColorStop(0, '#fff176');
      sunGradient.addColorStop(0.7, '#ffeb3b');
      sunGradient.addColorStop(1, '#ffc107');
      
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      // 太阳反射在水面上
      const reflectionY = canvas.height * 0.7;
      const reflectionGradient = ctx.createLinearGradient(
        sunX, reflectionY - sunRadius,
        sunX, reflectionY + sunRadius * 2
      );
      reflectionGradient.addColorStop(0, 'rgba(255, 193, 7, 0.6)');
      reflectionGradient.addColorStop(1, 'rgba(255, 193, 7, 0)');
      
      ctx.fillStyle = reflectionGradient;
      ctx.fillRect(sunX - sunRadius * 0.5, reflectionY, sunRadius, sunRadius * 2);
    };

    const drawWave = (wave: Wave, baseY: number) => {
      ctx.save();
      ctx.globalAlpha = wave.opacity;
      
      const gradient = ctx.createLinearGradient(0, baseY - wave.amplitude, 0, canvas.height);
      gradient.addColorStop(0, wave.color);
      gradient.addColorStop(1, 'rgba(2, 119, 189, 0.8)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      
      for (let x = 0; x <= canvas.width; x += 2) {
        const y = baseY + Math.sin(x * wave.frequency + wave.phase) * wave.amplitude;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();
      
      // 添加白色波浪泡沫
      if (wave.opacity > 0.4) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let x = 0; x <= canvas.width; x += 2) {
          const y = baseY + Math.sin(x * wave.frequency + wave.phase) * wave.amplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      
      ctx.restore();
    };

    const drawBubbles = () => {
      // 绘制气泡效果
      for (let i = 0; i < 10; i++) {
        const x = (timeRef.current * 0.5 + i * 50) % (canvas.width + 50);
        const y = canvas.height * 0.6 + Math.sin(timeRef.current * 0.01 + i) * 100;
        const size = 3 + Math.sin(timeRef.current * 0.05 + i) * 2;
        const alpha = 0.3 + Math.sin(timeRef.current * 0.03 + i) * 0.2;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    const animate = () => {
      timeRef.current += 1;
      
      drawBackground();
      drawSun();
      
      // 更新和绘制波浪
      wavesRef.current.forEach((wave, index) => {
        wave.phase += wave.speed;
        const baseY = canvas.height * (0.5 + index * 0.1);
        drawWave(wave, baseY);
      });
      
      drawBubbles();
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
};