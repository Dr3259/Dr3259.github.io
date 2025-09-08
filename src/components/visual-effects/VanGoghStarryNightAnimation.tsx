"use client";

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  brightness: number;
  pulseSpeed: number;
  color: string;
  rays: Array<{length: number, angle: number, intensity: number}>;
}

interface SwirlParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  swirlIndex: number;
  angle: number;
  distance: number;
}

interface CloudParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  turbulence: number;
}

export const VanGoghStarryNightAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);
  const swirlParticlesRef = useRef<SwirlParticle[]>([]);
  const cloudParticlesRef = useRef<CloudParticle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initializeStarryNight();
    };

    // 梵高星夜色彩调色板
    const nightColors = {
      skyBlue: '#1e3a8a',      // 深邃夜空蓝
      darkBlue: '#1e40af',     // 星夜深蓝
      moonYellow: '#fbbf24',   // 月亮黄
      starWhite: '#f8fafc',    // 星星白
      swirlBlue: '#3b82f6',    // 漩涡蓝
      cloudGray: '#6b7280',    // 云朵灰
      highlight: '#fef3c7'     // 高光黄
    };

    const swirlColors = [
      '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'
    ];

    const initializeStarryNight = () => {
      starsRef.current = [];
      swirlParticlesRef.current = [];
      cloudParticlesRef.current = [];
      
      // 创建主要的大星星
      createMainStars();
      
      // 创建小星星
      createSmallStars();
      
      // 创建漩涡粒子
      createSwirlParticles();
      
      // 创建云朵粒子
      createCloudParticles();
    };

    const createMainStars = () => {
      // 创建几颗主要的大星星，类似梵高画中的突出星体
      const mainStarPositions = [
        { x: canvas.width * 0.8, y: canvas.height * 0.2 },
        { x: canvas.width * 0.2, y: canvas.height * 0.15 },
        { x: canvas.width * 0.6, y: canvas.height * 0.1 }
      ];

      mainStarPositions.forEach(pos => {
        const star: Star = {
          x: pos.x,
          y: pos.y,
          radius: 8 + Math.random() * 4,
          brightness: 0.8 + Math.random() * 0.2,
          pulseSpeed: 0.02 + Math.random() * 0.01,
          color: Math.random() > 0.5 ? nightColors.starWhite : nightColors.moonYellow,
          rays: []
        };

        // 为每颗大星星创建光芒
        for (let i = 0; i < 8; i++) {
          star.rays.push({
            length: 20 + Math.random() * 30,
            angle: (Math.PI * 2 * i) / 8 + Math.random() * 0.3,
            intensity: 0.6 + Math.random() * 0.4
          });
        }

        starsRef.current.push(star);
      });
    };

    const createSmallStars = () => {
      // 创建众多小星星
      for (let i = 0; i < 50; i++) {
        const star: Star = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.6, // 主要在上半部分
          radius: 1 + Math.random() * 2,
          brightness: 0.3 + Math.random() * 0.5,
          pulseSpeed: 0.01 + Math.random() * 0.02,
          color: nightColors.starWhite,
          rays: []
        };

        // 小星星也有简单的光芒
        for (let j = 0; j < 4; j++) {
          star.rays.push({
            length: 3 + Math.random() * 5,
            angle: (Math.PI * j) / 2 + Math.random() * 0.2,
            intensity: 0.4 + Math.random() * 0.3
          });
        }

        starsRef.current.push(star);
      }
    };

    const createSwirlParticles = () => {
      // 创建多个漩涡中心
      const swirlCenters = [
        { x: canvas.width * 0.3, y: canvas.height * 0.3 },
        { x: canvas.width * 0.7, y: canvas.height * 0.5 },
        { x: canvas.width * 0.1, y: canvas.height * 0.4 }
      ];

      swirlCenters.forEach((center, swirlIndex) => {
        for (let i = 0; i < 60; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 100 + 20;
          
          swirlParticlesRef.current.push({
            x: center.x + Math.cos(angle) * distance,
            y: center.y + Math.sin(angle) * distance,
            vx: 0,
            vy: 0,
            life: Math.random() * 500 + 300,
            maxLife: Math.random() * 500 + 300,
            size: Math.random() * 3 + 1,
            color: swirlColors[Math.floor(Math.random() * swirlColors.length)],
            swirlIndex,
            angle: angle,
            distance: distance
          });
        }
      });
    };

    const createCloudParticles = () => {
      // 创建流动的云朵粒子
      for (let i = 0; i < 80; i++) {
        cloudParticlesRef.current.push({
          x: Math.random() * canvas.width,
          y: canvas.height * 0.6 + Math.random() * canvas.height * 0.4,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 8 + 2,
          opacity: 0.1 + Math.random() * 0.3,
          color: nightColors.cloudGray,
          turbulence: Math.random() * 0.02
        });
      }
    };

    const drawBackground = () => {
      // 梵高式渐变夜空背景
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0c1445');    // 深邃夜空顶部
      gradient.addColorStop(0.3, '#1e3a8a');  // 夜空蓝
      gradient.addColorStop(0.6, '#1e40af');  // 中层蓝
      gradient.addColorStop(0.8, '#374151');  // 地平线灰
      gradient.addColorStop(1, '#1f2937');    // 底部深灰
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 添加梵高风格的背景纹理
      drawBackgroundTexture();
    };

    const drawBackgroundTexture = () => {
      // 创建梵高风格的笔触纹理
      ctx.save();
      ctx.globalAlpha = 0.1;
      
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.7;
        const length = 20 + Math.random() * 40;
        const angle = Math.sin(x * 0.01) + Math.random() * 0.5;
        
        ctx.strokeStyle = nightColors.swirlBlue;
        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
        ctx.stroke();
      }
      
      ctx.restore();
    };

    const drawStars = () => {
      starsRef.current.forEach(star => {
        const pulse = Math.sin(timeRef.current * star.pulseSpeed) * 0.3 + 0.7;
        const brightness = star.brightness * pulse;
        
        ctx.save();
        ctx.globalAlpha = brightness;
        
        // 绘制星星光芒
        star.rays.forEach(ray => {
          const rayLength = ray.length * pulse;
          const rayAlpha = ray.intensity * brightness;
          
          ctx.save();
          ctx.globalAlpha = rayAlpha;
          ctx.strokeStyle = star.color;
          ctx.lineWidth = star.radius > 5 ? 2 : 1;
          ctx.lineCap = 'round';
          
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(
            star.x + Math.cos(ray.angle) * rayLength,
            star.y + Math.sin(ray.angle) * rayLength
          );
          ctx.stroke();
          ctx.restore();
        });
        
        // 绘制星星核心
        const coreGradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.radius * 2
        );
        coreGradient.addColorStop(0, star.color);
        coreGradient.addColorStop(0.5, star.color + '80');
        coreGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 星星中心
        ctx.fillStyle = star.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
    };

    const updateSwirlParticles = () => {
      const swirlCenters = [
        { x: canvas.width * 0.3, y: canvas.height * 0.3 },
        { x: canvas.width * 0.7, y: canvas.height * 0.5 },
        { x: canvas.width * 0.1, y: canvas.height * 0.4 }
      ];

      swirlParticlesRef.current = swirlParticlesRef.current.filter(particle => {
        const center = swirlCenters[particle.swirlIndex];
        
        // 漩涡运动
        particle.angle += 0.02;
        particle.distance += Math.sin(timeRef.current * 0.01) * 0.5;
        
        // 限制距离范围
        particle.distance = Math.max(10, Math.min(120, particle.distance));
        
        // 更新位置
        particle.x = center.x + Math.cos(particle.angle) * particle.distance;
        particle.y = center.y + Math.sin(particle.angle) * particle.distance;
        
        // 添加湍流效果
        particle.x += Math.sin(timeRef.current * 0.03 + particle.angle) * 2;
        particle.y += Math.cos(timeRef.current * 0.02 + particle.angle) * 2;
        
        particle.life--;
        return particle.life > 0;
      });
      
      // 补充新粒子
      if (swirlParticlesRef.current.length < 180) {
        const swirlIndex = Math.floor(Math.random() * 3);
        const center = swirlCenters[swirlIndex];
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 20;
        
        swirlParticlesRef.current.push({
          x: center.x + Math.cos(angle) * distance,
          y: center.y + Math.sin(angle) * distance,
          vx: 0,
          vy: 0,
          life: Math.random() * 500 + 300,
          maxLife: Math.random() * 500 + 300,
          size: Math.random() * 3 + 1,
          color: swirlColors[Math.floor(Math.random() * swirlColors.length)],
          swirlIndex,
          angle: angle,
          distance: distance
        });
      }
    };

    const drawSwirlParticles = () => {
      swirlParticlesRef.current.forEach(particle => {
        const alpha = particle.life / particle.maxLife;
        if (alpha <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = alpha * 0.8;
        
        // 粒子光晕
        const glowSize = particle.size * 3;
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        
        glowGradient.addColorStop(0, particle.color);
        glowGradient.addColorStop(0.5, particle.color + '60');
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 粒子核心
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
    };

    const updateCloudParticles = () => {
      cloudParticlesRef.current.forEach(particle => {
        // 湍流运动
        particle.vx += (Math.random() - 0.5) * particle.turbulence;
        particle.vy += (Math.random() - 0.5) * particle.turbulence;
        
        // 阻尼
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        
        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // 边界循环
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < canvas.height * 0.5) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = canvas.height * 0.5;
      });
    };

    const drawCloudParticles = () => {
      cloudParticlesRef.current.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        
        // 云朵模糊效果
        ctx.filter = 'blur(2px)';
        
        const cloudGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        cloudGradient.addColorStop(0, particle.color);
        cloudGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = cloudGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
    };

    const drawMoon = () => {
      // 绘制月亮
      const moonX = canvas.width * 0.85;
      const moonY = canvas.height * 0.15;
      const moonRadius = 25;
      
      ctx.save();
      
      // 月亮光晕
      const moonHalo = ctx.createRadialGradient(
        moonX, moonY, 0,
        moonX, moonY, moonRadius * 3
      );
      moonHalo.addColorStop(0, nightColors.moonYellow + '60');
      moonHalo.addColorStop(0.5, nightColors.moonYellow + '20');
      moonHalo.addColorStop(1, 'transparent');
      
      ctx.fillStyle = moonHalo;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // 月亮本体
      ctx.fillStyle = nightColors.moonYellow;
      ctx.shadowBlur = 20;
      ctx.shadowColor = nightColors.moonYellow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const animate = () => {
      timeRef.current += 1;
      
      drawBackground();
      drawMoon();
      drawStars();
      
      updateSwirlParticles();
      drawSwirlParticles();
      
      updateCloudParticles();
      drawCloudParticles();
      
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