"use client";

import React, { useEffect, useRef } from 'react';

interface RosePetal {
  x: number;
  y: number;
  radius: number;
  angle: number;
  color: string;
  opacity: number;
}

export const RoseAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawRose = (centerX: number, centerY: number, size: number, rotation: number) => {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      // 绘制玫瑰花瓣
      const petalCount = 8;
      for (let i = 0; i < petalCount; i++) {
        const angle = (Math.PI * 2 * i) / petalCount;
        
        ctx.save();
        ctx.rotate(angle);
        
        // 花瓣渐变
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, '#ff1744');
        gradient.addColorStop(0.5, '#c62828');
        gradient.addColorStop(1, '#8e0000');
        
        ctx.fillStyle = gradient;
        ctx.strokeStyle = '#8e0000';
        ctx.lineWidth = 1;
        
        // 绘制花瓣形状
        ctx.beginPath();
        ctx.ellipse(0, -size * 0.3, size * 0.4, size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
      }

      // 绘制花心
      const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.2);
      centerGradient.addColorStop(0, '#ffeb3b');
      centerGradient.addColorStop(1, '#ffc107');
      
      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawBackground = () => {
      // 创建浪漫的背景渐变
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.5, '#16213e');
      gradient.addColorStop(1, '#0f3460');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 添加星星效果
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = () => {
      timeRef.current += 0.02;
      
      drawBackground();

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // 主玫瑰花
      const mainSize = Math.min(canvas.width, canvas.height) * 0.15;
      drawRose(centerX, centerY, mainSize, timeRef.current * 0.5);

      // 周围的小玫瑰花
      const smallRoses = 6;
      for (let i = 0; i < smallRoses; i++) {
        const angle = (Math.PI * 2 * i) / smallRoses + timeRef.current * 0.3;
        const distance = Math.min(canvas.width, canvas.height) * 0.25;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        const size = mainSize * 0.6;
        
        drawRose(x, y, size, timeRef.current * 0.8 + angle);
      }

      // 飘落的花瓣效果
      ctx.fillStyle = 'rgba(255, 23, 68, 0.6)';
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(timeRef.current + i) * canvas.width * 0.8 + canvas.width) / 2;
        const y = (timeRef.current * 50 + i * 100) % (canvas.height + 100);
        const size = 3 + Math.sin(timeRef.current + i) * 2;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(timeRef.current + i);
        ctx.beginPath();
        ctx.ellipse(0, 0, size, size * 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

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