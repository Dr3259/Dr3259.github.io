"use client";

import React, { useEffect, useRef } from 'react';

export const SolarSystemAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 太阳系行星数据
    const planets = [
      { 
        name: 'Mercury', 
        distance: 80, 
        size: 3, 
        speed: 0.04, 
        color: '#FFA500',
        glowColor: 'rgba(255, 165, 0, 0.6)',
        trailColor: 'rgba(255, 165, 0, 0.1)'
      },
      { 
        name: 'Venus', 
        distance: 110, 
        size: 4, 
        speed: 0.035, 
        color: '#FFC649',
        glowColor: 'rgba(255, 198, 73, 0.6)',
        trailColor: 'rgba(255, 198, 73, 0.1)'
      },
      { 
        name: 'Earth', 
        distance: 150, 
        size: 5, 
        speed: 0.03, 
        color: '#6B93D6',
        glowColor: 'rgba(107, 147, 214, 0.6)',
        trailColor: 'rgba(107, 147, 214, 0.1)'
      },
      { 
        name: 'Mars', 
        distance: 190, 
        size: 4, 
        speed: 0.025, 
        color: '#CD5C5C',
        glowColor: 'rgba(205, 92, 92, 0.6)',
        trailColor: 'rgba(205, 92, 92, 0.1)'
      },
      { 
        name: 'Jupiter', 
        distance: 280, 
        size: 12, 
        speed: 0.015, 
        color: '#D2691E',
        glowColor: 'rgba(210, 105, 30, 0.6)',
        trailColor: 'rgba(210, 105, 30, 0.1)'
      },
      { 
        name: 'Saturn', 
        distance: 350, 
        size: 10, 
        speed: 0.012, 
        color: '#FAD5A5',
        glowColor: 'rgba(250, 213, 165, 0.6)',
        trailColor: 'rgba(250, 213, 165, 0.1)',
        hasRings: true
      },
      { 
        name: 'Uranus', 
        distance: 420, 
        size: 7, 
        speed: 0.009, 
        color: '#4FD0E7',
        glowColor: 'rgba(79, 208, 231, 0.6)',
        trailColor: 'rgba(79, 208, 231, 0.1)'
      },
      { 
        name: 'Neptune', 
        distance: 480, 
        size: 7, 
        speed: 0.007, 
        color: '#4169E1',
        glowColor: 'rgba(65, 105, 225, 0.6)',
        trailColor: 'rgba(65, 105, 225, 0.1)'
      }
    ];

    // 存储行星轨迹
    const planetTrails: Array<Array<{x: number, y: number, opacity: number}>> = planets.map(() => []);
    const maxTrailLength = 100;

    // 粒子系统
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
    }> = [];

    // 创建星空背景粒子
    const createStarParticles = () => {
      for (let i = 0; i < 200; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          life: Math.random() * 100 + 50,
          maxLife: Math.random() * 100 + 50,
          color: `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`
        });
      }
    };

    createStarParticles();

    const animate = () => {
      timeRef.current += 0.01;
      ctx.fillStyle = 'rgba(10, 10, 25, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 绘制星空背景
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.5;

        // 边界检查
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // 重新创建消失的粒子
        if (particle.life <= 0) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.life = particle.maxLife;
        }

        const opacity = particle.life / particle.maxLife;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // 绘制轨道
      planets.forEach(planet => {
        ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 10]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, planet.distance, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 绘制太阳
      const sunRadius = 20;
      const sunGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, sunRadius * 3);
      sunGlow.addColorStop(0, 'rgba(255, 200, 50, 0.8)');
      sunGlow.addColorStop(0.3, 'rgba(255, 150, 0, 0.4)');
      sunGlow.addColorStop(1, 'rgba(255, 100, 0, 0)');
      
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sunRadius * 3, 0, Math.PI * 2);
      ctx.fill();

      // 太阳核心
      const sunCore = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, sunRadius);
      sunCore.addColorStop(0, '#FFFF99');
      sunCore.addColorStop(0.7, '#FFD700');
      sunCore.addColorStop(1, '#FF8C00');
      
      ctx.fillStyle = sunCore;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      // 太阳耀斑效果
      for (let i = 0; i < 8; i++) {
        const angle = (timeRef.current * 2 + (i * Math.PI / 4)) % (Math.PI * 2);
        const x1 = centerX + Math.cos(angle) * sunRadius;
        const y1 = centerY + Math.sin(angle) * sunRadius;
        const x2 = centerX + Math.cos(angle) * (sunRadius * 1.8);
        const y2 = centerY + Math.sin(angle) * (sunRadius * 1.8);
        
        ctx.strokeStyle = `rgba(255, 255, 100, ${0.3 + Math.sin(timeRef.current * 3) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // 绘制行星
      planets.forEach((planet, planetIndex) => {
        const angle = timeRef.current * planet.speed;
        const x = centerX + Math.cos(angle) * planet.distance;
        const y = centerY + Math.sin(angle) * planet.distance;

        // 更新轨迹
        planetTrails[planetIndex].push({ x, y, opacity: 1 });
        if (planetTrails[planetIndex].length > maxTrailLength) {
          planetTrails[planetIndex].shift();
        }

        // 绘制轨迹
        planetTrails[planetIndex].forEach((point, index) => {
          point.opacity *= 0.98;
          const trailOpacity = point.opacity * (index / planetTrails[planetIndex].length);
          ctx.fillStyle = planet.trailColor.replace('0.1', trailOpacity.toString());
          ctx.beginPath();
          ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
          ctx.fill();
        });

        // 行星发光效果
        const planetGlow = ctx.createRadialGradient(x, y, 0, x, y, planet.size * 4);
        planetGlow.addColorStop(0, planet.glowColor);
        planetGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = planetGlow;
        ctx.beginPath();
        ctx.arc(x, y, planet.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // 行星主体
        const planetGradient = ctx.createRadialGradient(
          x - planet.size * 0.3, 
          y - planet.size * 0.3, 
          0, 
          x, 
          y, 
          planet.size
        );
        planetGradient.addColorStop(0, planet.color);
        planetGradient.addColorStop(1, planet.color.replace(')', ', 0.6)').replace('rgb', 'rgba'));
        
        ctx.fillStyle = planetGradient;
        ctx.beginPath();
        ctx.arc(x, y, planet.size, 0, Math.PI * 2);
        ctx.fill();

        // 土星环
        if (planet.hasRings) {
          ctx.strokeStyle = 'rgba(200, 200, 200, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(x, y, planet.size * 1.8, planet.size * 0.3, angle, 0, Math.PI * 2);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.ellipse(x, y, planet.size * 2.2, planet.size * 0.4, angle, 0, Math.PI * 2);
          ctx.stroke();
        }

        // 行星光环效果
        if (Math.random() < 0.02) {
          for (let i = 0; i < 3; i++) {
            const sparkleAngle = Math.random() * Math.PI * 2;
            const sparkleDistance = planet.size + Math.random() * 10;
            const sparkleX = x + Math.cos(sparkleAngle) * sparkleDistance;
            const sparkleY = y + Math.sin(sparkleAngle) * sparkleDistance;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8})`;
            ctx.beginPath();
            ctx.arc(sparkleX, sparkleY, Math.random() * 2 + 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // 绘制彗星
      if (Math.random() < 0.003) {
        const cometX = Math.random() * canvas.width;
        const cometY = Math.random() * canvas.height;
        const cometVx = (Math.random() - 0.5) * 10;
        const cometVy = (Math.random() - 0.5) * 10;
        
        // 创建彗星尾迹
        for (let i = 0; i < 20; i++) {
          const tailX = cometX - cometVx * i * 0.5;
          const tailY = cometY - cometVy * i * 0.5;
          const tailOpacity = 1 - (i / 20);
          
          ctx.fillStyle = `rgba(100, 150, 255, ${tailOpacity * 0.5})`;
          ctx.beginPath();
          ctx.arc(tailX, tailY, (20 - i) * 0.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-gray-900 via-blue-900 to-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      {/* 信息悬浮层 */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
        <p className="text-sm opacity-80">太阳系模拟 - 探索宇宙的奥秘</p>
      </div>
      
      {/* 神秘光效覆盖层 */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-purple-900/20 pointer-events-none" />
    </div>
  );
};