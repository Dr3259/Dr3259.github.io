"use client";

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  color: string;
}

export const StarryNightAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initStars();
    };

    const starColors = [
      '#ffffff',
      '#ffe082',
      '#81d4fa',
      '#c5e1a5',
      '#ffab91',
      '#ce93d8'
    ];

    const initStars = () => {
      starsRef.current = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 2000);
      
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          brightness: Math.random(),
          twinkleSpeed: Math.random() * 0.05 + 0.01,
          color: starColors[Math.floor(Math.random() * starColors.length)]
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawBackground = () => {
      // 夜空渐变
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a2e');
      gradient.addColorStop(0.3, '#16213e');
      gradient.addColorStop(0.7, '#1a1a2e');
      gradient.addColorStop(1, '#000000');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawMoon = () => {
      const moonX = canvas.width * 0.8;
      const moonY = canvas.height * 0.2;
      const moonRadius = Math.min(canvas.width, canvas.height) * 0.08;

      // 月亮光晕
      const glowGradient = ctx.createRadialGradient(
        moonX, moonY, moonRadius * 0.5,
        moonX, moonY, moonRadius * 3
      );
      glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      glowGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
      glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius * 3, 0, Math.PI * 2);
      ctx.fill();

      // 月亮本体
      const moonGradient = ctx.createRadialGradient(
        moonX - moonRadius * 0.3, moonY - moonRadius * 0.3, 0,
        moonX, moonY, moonRadius
      );
      moonGradient.addColorStop(0, '#ffffff');
      moonGradient.addColorStop(0.7, '#f5f5f5');
      moonGradient.addColorStop(1, '#e0e0e0');
      
      ctx.fillStyle = moonGradient;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fill();

      // 月亮表面细节
      ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
      ctx.beginPath();
      ctx.arc(moonX - moonRadius * 0.3, moonY - moonRadius * 0.2, moonRadius * 0.15, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(moonX + moonRadius * 0.2, moonY + moonRadius * 0.3, moonRadius * 0.1, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawStars = () => {
      starsRef.current.forEach(star => {
        // 计算闪烁效果
        const twinkle = Math.sin(timeRef.current * star.twinkleSpeed) * 0.5 + 0.5;
        const alpha = star.brightness * twinkle;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // 星星光晕
        const glowSize = star.size * 3;
        const starGlow = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, glowSize
        );
        starGlow.addColorStop(0, star.color);
        starGlow.addColorStop(1, 'transparent');
        
        ctx.fillStyle = starGlow;
        ctx.beginPath();
        ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 星星本体
        ctx.fillStyle = star.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // 十字星芒效果（对于较大的星星）
        if (star.size > 2 && twinkle > 0.7) {
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(star.x - star.size * 2, star.y);
          ctx.lineTo(star.x + star.size * 2, star.y);
          ctx.moveTo(star.x, star.y - star.size * 2);
          ctx.lineTo(star.x, star.y + star.size * 2);
          ctx.stroke();
        }
        
        ctx.restore();
      });
    };

    const drawShootingStar = () => {
      // 偶尔画流星
      if (Math.random() < 0.005) {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height * 0.5;
        const length = 100 + Math.random() * 100;
        const angle = Math.PI * 0.25 + Math.random() * Math.PI * 0.5;
        
        const endX = startX + Math.cos(angle) * length;
        const endY = startY + Math.sin(angle) * length;
        
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    };

    const animate = () => {
      timeRef.current += 1;
      
      drawBackground();
      drawMoon();
      drawStars();
      drawShootingStar();
      
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