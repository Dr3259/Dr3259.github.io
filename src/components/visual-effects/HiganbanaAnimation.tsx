"use client";

import React, { useEffect, useRef } from 'react';

export const HiganbanaAnimation: React.FC = () => {
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

    // 彼岸花数据结构
    const flowers: Array<{
      x: number;
      y: number;
      scale: number;
      rotation: number;
      rotationSpeed: number;
      bloomProgress: number;
      bloomSpeed: number;
      stemHeight: number;
      petalCount: number;
      opacity: number;
    }> = [];

    // 粒子系统 - 飘散的花瓣和光粒子
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
      type: 'petal' | 'light' | 'magic';
      rotation: number;
      rotationSpeed: number;
    }> = [];

    // 神秘雾气粒子
    const mist: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      life: number;
    }> = [];

    // 初始化彼岸花
    const initFlowers = () => {
      for (let i = 0; i < 8; i++) {
        flowers.push({
          x: Math.random() * canvas.width,
          y: canvas.height * 0.3 + Math.random() * canvas.height * 0.6,
          scale: Math.random() * 0.5 + 0.8,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
          bloomProgress: Math.random() * Math.PI * 2,
          bloomSpeed: Math.random() * 0.02 + 0.01,
          stemHeight: Math.random() * 100 + 80,
          petalCount: 6,
          opacity: Math.random() * 0.3 + 0.7
        });
      }
    };

    // 初始化粒子
    const initParticles = () => {
      // 飘散的花瓣
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * -1 - 0.5,
          life: Math.random() * 300 + 200,
          maxLife: Math.random() * 300 + 200,
          size: Math.random() * 8 + 4,
          color: `rgba(${220 + Math.random() * 35}, ${20 + Math.random() * 30}, ${20 + Math.random() * 30}, 0.8)`,
          type: 'petal',
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.1
        });
      }

      // 神秘光粒子
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random() * 200 + 100,
          maxLife: Math.random() * 200 + 100,
          size: Math.random() * 3 + 1,
          color: `rgba(${255}, ${100 + Math.random() * 100}, ${100 + Math.random() * 100}, 0.6)`,
          type: 'light',
          rotation: 0,
          rotationSpeed: 0
        });
      }

      // 魔法光点
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          life: Math.random() * 150 + 100,
          maxLife: Math.random() * 150 + 100,
          size: Math.random() * 4 + 2,
          color: `rgba(${180 + Math.random() * 75}, ${50 + Math.random() * 100}, ${200 + Math.random() * 55}, 0.7)`,
          type: 'magic',
          rotation: 0,
          rotationSpeed: 0
        });
      }
    };

    // 初始化雾气
    const initMist = () => {
      for (let i = 0; i < 20; i++) {
        mist.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 100 + 50,
          opacity: Math.random() * 0.1 + 0.05,
          life: Math.random() * 400 + 300
        });
      }
    };

    initFlowers();
    initParticles();
    initMist();

    // 绘制彼岸花花瓣
    const drawPetal = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, length: number, width: number, color: string) => {
      const petalGradient = ctx.createLinearGradient(centerX, centerY, centerX, centerY - length);
      petalGradient.addColorStop(0, color);
      petalGradient.addColorStop(0.5, color.replace('0.8', '0.9'));
      petalGradient.addColorStop(1, color.replace('0.8', '0.6'));

      ctx.fillStyle = petalGradient;
      ctx.beginPath();
      
      // 绘制细长的彼岸花花瓣
      const controlPoint1X = centerX - width / 3;
      const controlPoint1Y = centerY - length * 0.3;
      const controlPoint2X = centerX + width / 3;
      const controlPoint2Y = centerY - length * 0.3;
      const tipX = centerX;
      const tipY = centerY - length;
      
      ctx.moveTo(centerX, centerY);
      ctx.quadraticCurveTo(controlPoint1X, controlPoint1Y, tipX - width * 0.1, tipY);
      ctx.quadraticCurveTo(tipX, tipY - 5, tipX + width * 0.1, tipY);
      ctx.quadraticCurveTo(controlPoint2X, controlPoint2Y, centerX, centerY);
      ctx.fill();

      // 花瓣中央纹理
      ctx.strokeStyle = color.replace('0.8', '0.4');
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
    };

    // 绘制彼岸花
    const drawHiganbana = (flower: typeof flowers[0]) => {
      ctx.save();
      ctx.translate(flower.x, flower.y);
      ctx.scale(flower.scale, flower.scale);
      ctx.rotate(flower.rotation);

      // 绘制花茎
      const stemGradient = ctx.createLinearGradient(0, 0, 0, flower.stemHeight);
      stemGradient.addColorStop(0, 'rgba(34, 80, 34, 0.8)');
      stemGradient.addColorStop(1, 'rgba(20, 50, 20, 0.6)');
      
      ctx.strokeStyle = stemGradient;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, flower.stemHeight);
      ctx.stroke();

      // 绘制花瓣 - 彼岸花特有的细长弯曲花瓣
      const petalLength = 60 + Math.sin(flower.bloomProgress) * 10;
      const petalWidth = 8 + Math.sin(flower.bloomProgress * 1.5) * 2;
      
      for (let i = 0; i < flower.petalCount; i++) {
        const angle = (i * Math.PI * 2) / flower.petalCount + flower.rotation * 0.5;
        const petalColor = `rgba(${220 + Math.sin(timeRef.current + i) * 20}, ${30 + Math.sin(timeRef.current * 1.2 + i) * 20}, ${30 + Math.sin(timeRef.current * 0.8 + i) * 20}, ${flower.opacity})`;
        
        ctx.save();
        ctx.rotate(angle);
        
        // 彼岸花花瓣特有的弯曲效果
        ctx.transform(1, 0, Math.sin(flower.bloomProgress + i) * 0.2, 1, 0, 0);
        
        drawPetal(ctx, 0, 0, petalLength, petalWidth, petalColor);
        ctx.restore();
      }

      // 绘制花蕊
      const stamenGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 15);
      stamenGradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)');
      stamenGradient.addColorStop(0.7, 'rgba(255, 140, 0, 0.7)');
      stamenGradient.addColorStop(1, 'rgba(200, 50, 0, 0.5)');
      
      ctx.fillStyle = stamenGradient;
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();

      // 花蕊细丝
      for (let i = 0; i < 6; i++) {
        const stamenAngle = (i * Math.PI * 2) / 6;
        const stamenLength = 20 + Math.sin(timeRef.current * 2 + i) * 3;
        
        ctx.strokeStyle = `rgba(255, 200, 0, ${0.6 + Math.sin(timeRef.current * 3 + i) * 0.2})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(stamenAngle) * stamenLength, Math.sin(stamenAngle) * stamenLength);
        ctx.stroke();
        
        // 花药
        ctx.fillStyle = 'rgba(255, 100, 0, 0.8)';
        ctx.beginPath();
        ctx.arc(Math.cos(stamenAngle) * stamenLength, Math.sin(stamenAngle) * stamenLength, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    // 绘制飘散的花瓣
    const drawFallingPetal = (particle: typeof particles[0]) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      
      const petalGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
      petalGradient.addColorStop(0, particle.color);
      petalGradient.addColorStop(1, particle.color.replace(/[\d.]+\)$/, '0)'));
      
      ctx.fillStyle = petalGradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, particle.size, particle.size * 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const animate = () => {
      timeRef.current += 0.02;

      // 创建神秘的背景渐变
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, `rgba(${20 + Math.sin(timeRef.current * 0.5) * 10}, ${10}, ${30 + Math.sin(timeRef.current * 0.3) * 15}, 0.95)`);
      bgGradient.addColorStop(0.5, `rgba(${40 + Math.sin(timeRef.current * 0.4) * 10}, ${20}, ${50 + Math.sin(timeRef.current * 0.6) * 20}, 0.95)`);
      bgGradient.addColorStop(1, `rgba(${15 + Math.sin(timeRef.current * 0.3) * 5}, ${5}, ${25 + Math.sin(timeRef.current * 0.7) * 10}, 0.95)`);
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制雾气
      mist.forEach(mistParticle => {
        mistParticle.x += mistParticle.vx;
        mistParticle.y += mistParticle.vy;
        mistParticle.life--;

        if (mistParticle.life <= 0 || mistParticle.x < -50 || mistParticle.x > canvas.width + 50 || mistParticle.y < -50 || mistParticle.y > canvas.height + 50) {
          mistParticle.x = Math.random() * canvas.width;
          mistParticle.y = Math.random() * canvas.height;
          mistParticle.life = Math.random() * 400 + 300;
        }

        const mistGradient = ctx.createRadialGradient(
          mistParticle.x, mistParticle.y, 0,
          mistParticle.x, mistParticle.y, mistParticle.size
        );
        mistGradient.addColorStop(0, `rgba(100, 50, 100, ${mistParticle.opacity})`);
        mistGradient.addColorStop(1, 'rgba(100, 50, 100, 0)');
        
        ctx.fillStyle = mistGradient;
        ctx.beginPath();
        ctx.arc(mistParticle.x, mistParticle.y, mistParticle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 更新并绘制粒子
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        particle.rotation += particle.rotationSpeed;

        if (particle.type === 'petal') {
          particle.vy += 0.02; // 重力效果
          drawFallingPetal(particle);
        } else if (particle.type === 'light') {
          const opacity = (particle.life / particle.maxLife) * 0.6;
          ctx.fillStyle = particle.color.replace(/[\d.]+\)$/, `${opacity})`);
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          // 光晕效果
          const glowGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
          );
          glowGradient.addColorStop(0, particle.color.replace(/[\d.]+\)$/, `${opacity * 0.3})`));
          glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.type === 'magic') {
          const opacity = (particle.life / particle.maxLife) * 0.7;
          
          // 魔法光点闪烁效果
          const flicker = Math.sin(timeRef.current * 5 + index) * 0.3 + 0.7;
          ctx.fillStyle = particle.color.replace(/[\d.]+\)$/, `${opacity * flicker})`);
          
          // 绘制星形魔法光点
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const radius = particle.size * (i % 2 === 0 ? 1 : 0.5);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // 重置消失的粒子
        if (particle.life <= 0 || particle.x < -50 || particle.x > canvas.width + 50 || particle.y > canvas.height + 50) {
          particle.x = Math.random() * canvas.width;
          particle.y = particle.type === 'petal' ? -20 : Math.random() * canvas.height;
          particle.vx = (Math.random() - 0.5) * (particle.type === 'petal' ? 2 : 0.5);
          particle.vy = particle.type === 'petal' ? Math.random() * -1 - 0.5 : (Math.random() - 0.5) * 0.5;
          particle.life = particle.maxLife;
        }
      });

      // 更新并绘制彼岸花
      flowers.forEach(flower => {
        flower.rotation += flower.rotationSpeed;
        flower.bloomProgress += flower.bloomSpeed;
        flower.opacity = 0.7 + Math.sin(timeRef.current + flower.x * 0.01) * 0.2;
        
        drawHiganbana(flower);
      });

      // 添加神秘光效
      if (Math.random() < 0.1) {
        const lightX = Math.random() * canvas.width;
        const lightY = Math.random() * canvas.height;
        const lightRadius = Math.random() * 30 + 20;
        
        const mysticalGradient = ctx.createRadialGradient(
          lightX, lightY, 0,
          lightX, lightY, lightRadius
        );
        mysticalGradient.addColorStop(0, `rgba(${200 + Math.random() * 55}, ${50 + Math.random() * 100}, ${200 + Math.random() * 55}, ${Math.random() * 0.3})`);
        mysticalGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = mysticalGradient;
        ctx.beginPath();
        ctx.arc(lightX, lightY, lightRadius, 0, Math.PI * 2);
        ctx.fill();
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
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-purple-900 via-red-900 to-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      {/* 信息悬浮层 */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
        <p className="text-sm opacity-80">彼岸花 - 传说中连接生死的神秘花朵</p>
      </div>
      
      {/* 神秘光效覆盖层 */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-red-900/10 to-purple-900/20 pointer-events-none" />
    </div>
  );
};