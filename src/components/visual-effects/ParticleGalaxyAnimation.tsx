"use client";

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  trail: Array<{x: number, y: number, alpha: number}>;
}

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  brightness: number;
  color: string;
  pulseSpeed: number;
}

export const ParticleGalaxyAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
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
      initializeGalaxy();
    };

    const colors = [
      '#ff006e', '#fb5607', '#ffbe0b', '#8338ec', '#3a86ff',
      '#06ffa5', '#ff9f1c', '#e71d36', '#c77dff', '#560bad'
    ];

    const initializeGalaxy = () => {
      particlesRef.current = [];
      starsRef.current = [];
      
      // 创建背景星星
      for (let i = 0; i < 200; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1000,
          size: Math.random() * 2 + 0.5,
          brightness: Math.random(),
          color: colors[Math.floor(Math.random() * colors.length)],
          pulseSpeed: Math.random() * 0.02 + 0.01
        });
      }
      
      // 创建星系粒子
      for (let i = 0; i < 800; i++) {
        createGalaxyParticle();
      }
    };

    const createGalaxyParticle = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // 螺旋星系的参数
      const arm = Math.floor(Math.random() * 4); // 4个旋臂
      const armAngle = (arm * Math.PI * 2) / 4;
      const spiralTightness = 0.3;
      const distance = Math.random() * Math.min(canvas.width, canvas.height) * 0.3;
      
      const angle = armAngle + distance * spiralTightness + (Math.random() - 0.5) * 0.5;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      // 3D效果
      const z = (Math.random() - 0.5) * 200;
      
      // 速度基于距离中心的位置
      const orbital_speed = 0.02 / (distance * 0.01 + 1);
      const vx = -Math.sin(angle) * orbital_speed + (Math.random() - 0.5) * 0.1;
      const vy = Math.cos(angle) * orbital_speed + (Math.random() - 0.5) * 0.1;
      const vz = (Math.random() - 0.5) * 0.05;
      
      particlesRef.current.push({
        x,
        y,
        z,
        vx,
        vy,
        vz,
        life: Math.random() * 500 + 200,
        maxLife: Math.random() * 500 + 200,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: []
      });
    };

    const drawBackground = () => {
      // 深空背景
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, '#000011');
      gradient.addColorStop(0.5, '#000033');
      gradient.addColorStop(1, '#000000');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawStars = () => {
      starsRef.current.forEach(star => {
        const pulse = Math.sin(timeRef.current * star.pulseSpeed) * 0.5 + 0.5;
        const alpha = star.brightness * pulse;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // 星星光晕
        const glowSize = star.size * 4;
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
        ctx.shadowBlur = 15;
        ctx.shadowColor = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
    };

    const drawBlackHole = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const blackHoleRadius = 30;
      
      // 事件视界
      const eventHorizon = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, blackHoleRadius * 3
      );
      eventHorizon.addColorStop(0, '#000000');
      eventHorizon.addColorStop(0.3, 'rgba(138, 43, 226, 0.8)');
      eventHorizon.addColorStop(0.6, 'rgba(255, 20, 147, 0.4)');
      eventHorizon.addColorStop(1, 'transparent');
      
      ctx.fillStyle = eventHorizon;
      ctx.beginPath();
      ctx.arc(centerX, centerY, blackHoleRadius * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // 吸积盘
      for (let i = 0; i < 20; i++) {
        const angle = (timeRef.current * 0.01 + i * 0.3) % (Math.PI * 2);
        const radius = blackHoleRadius * 2 + i * 3;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.fillStyle = `rgba(255, ${100 + i * 5}, 0, ${0.8 - i * 0.04})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 黑洞核心
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(centerX, centerY, blackHoleRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    const updateParticles = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      particlesRef.current = particlesRef.current.filter(particle => {
        // 更新轨迹
        particle.trail.push({
          x: particle.x,
          y: particle.y,
          alpha: 1
        });
        
        if (particle.trail.length > 10) {
          particle.trail.shift();
        }
        
        particle.trail.forEach((point, index) => {
          point.alpha = index / particle.trail.length;
        });
        
        // 引力效应
        const dx = centerX - particle.x;
        const dy = centerY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 30) { // 避免奇点
          const force = 0.5 / (distance * distance);
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }
        
        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;
        
        // 3D透视效果
        const perspective = 200 / (200 + particle.z);
        particle.life--;
        
        return particle.life > 0 && distance > 25; // 被黑洞吞噬
      });
      
      // 补充新粒子
      while (particlesRef.current.length < 800) {
        createGalaxyParticle();
      }
    };

    const drawParticles = () => {
      particlesRef.current.forEach(particle => {
        const perspective = 200 / (200 + particle.z);
        const screenX = particle.x;
        const screenY = particle.y;
        const size = particle.size * perspective;
        const alpha = (particle.life / particle.maxLife) * perspective;
        
        // 绘制轨迹
        if (particle.trail.length > 1) {
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = alpha * 0.3;
          ctx.beginPath();
          ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
          
          for (let i = 1; i < particle.trail.length; i++) {
            ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
          }
          ctx.stroke();
        }
        
        // 绘制粒子
        ctx.save();
        ctx.globalAlpha = alpha;
        
        const glowSize = size * 3;
        const particleGlow = ctx.createRadialGradient(
          screenX, screenY, 0,
          screenX, screenY, glowSize
        );
        particleGlow.addColorStop(0, particle.color);
        particleGlow.addColorStop(1, 'transparent');
        
        ctx.fillStyle = particleGlow;
        ctx.beginPath();
        ctx.arc(screenX, screenY, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
    };

    const drawNebula = () => {
      // 星云效果
      const nebulaPoints = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, color: 'rgba(255, 20, 147, 0.1)' },
        { x: canvas.width * 0.8, y: canvas.height * 0.7, color: 'rgba(138, 43, 226, 0.1)' },
        { x: canvas.width * 0.6, y: canvas.height * 0.2, color: 'rgba(0, 255, 255, 0.1)' }
      ];
      
      nebulaPoints.forEach(nebula => {
        const size = 200 + Math.sin(timeRef.current * 0.005) * 50;
        const nebulaGradient = ctx.createRadialGradient(
          nebula.x, nebula.y, 0,
          nebula.x, nebula.y, size
        );
        nebulaGradient.addColorStop(0, nebula.color);
        nebulaGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = nebulaGradient;
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = () => {
      timeRef.current += 1;
      
      drawBackground();
      drawNebula();
      drawStars();
      updateParticles();
      drawParticles();
      drawBlackHole();
      
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
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