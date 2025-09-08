"use client";

import React, { useEffect, useRef } from 'react';

interface Firework {
  x: number;
  y: number;
  particles: Particle[];
  exploded: boolean;
  timer: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export const FireworksAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const fireworksRef = useRef<Firework[]>([]);

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

    const colors = ['#ff1744', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3', '#9c27b0', '#e91e63'];

    const createFirework = () => {
      const firework: Firework = {
        x: Math.random() * canvas.width,
        y: canvas.height,
        particles: [],
        exploded: false,
        timer: 0
      };

      // 创建爆炸粒子
      const particleCount = 30 + Math.random() * 20;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 2 + Math.random() * 4;
        
        firework.particles.push({
          x: firework.x,
          y: Math.random() * canvas.height * 0.4 + canvas.height * 0.1,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          gravity: 0.1,
          life: 60 + Math.random() * 30,
          maxLife: 60 + Math.random() * 30,
          color: color,
          size: 2 + Math.random() * 3
        });
      }

      firework.exploded = true;
      return firework;
    };

    const updateFireworks = () => {
      fireworksRef.current = fireworksRef.current.filter(firework => {
        if (firework.exploded) {
          firework.particles = firework.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.gravity;
            particle.life--;
            return particle.life > 0;
          });
          return firework.particles.length > 0;
        }
        return true;
      });
    };

    const drawFireworks = () => {
      // 创建渐变背景
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#000428');
      gradient.addColorStop(1, '#004e92');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      fireworksRef.current.forEach(firework => {
        if (firework.exploded) {
          firework.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = particle.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          });
        }
      });
    };

    const animate = () => {
      updateFireworks();
      drawFireworks();

      // 随机创建新烟花
      if (Math.random() < 0.03) {
        fireworksRef.current.push(createFirework());
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // 初始化一些烟花
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        fireworksRef.current.push(createFirework());
      }, i * 1000);
    }

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