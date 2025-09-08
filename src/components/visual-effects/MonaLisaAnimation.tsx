"use client";

import React, { useEffect, useRef } from 'react';

export const MonaLisaAnimation: React.FC = () => {
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

    // 蒙娜丽莎形象数据
    const monaLisa = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      scale: Math.min(canvas.width, canvas.height) * 0.0008,
      eyeBlink: 0,
      smileIntensity: 0,
      headTilt: 0
    };

    // 粒子系统 - 神秘光点和艺术气息
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
      type: 'golden' | 'mystical' | 'renaissance' | 'veil';
      opacity: number;
    }> = [];

    // 薄纱飘动粒子
    const veilParticles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      angle: number;
      life: number;
    }> = [];

    // 初始化粒子
    const initParticles = () => {
      // 金色光点 - 文艺复兴光辉
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.3,
          life: Math.random() * 400 + 200,
          maxLife: Math.random() * 400 + 200,
          size: Math.random() * 3 + 1,
          color: `rgba(${255 - Math.random() * 30}, ${215 - Math.random() * 30}, ${0 + Math.random() * 50}, 0.7)`,
          type: 'golden',
          opacity: Math.random() * 0.8 + 0.2
        });
      }

      // 神秘光点 - 蒙娜丽莎的微笑之谜
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          life: Math.random() * 300 + 150,
          maxLife: Math.random() * 300 + 150,
          size: Math.random() * 4 + 2,
          color: `rgba(${100 + Math.random() * 100}, ${50 + Math.random() * 100}, ${150 + Math.random() * 105}, 0.6)`,
          type: 'mystical',
          opacity: Math.random() * 0.6 + 0.4
        });
      }

      // 文艺复兴氛围粒子
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          life: Math.random() * 500 + 300,
          maxLife: Math.random() * 500 + 300,
          size: Math.random() * 6 + 3,
          color: `rgba(${139 + Math.random() * 50}, ${69 + Math.random() * 50}, ${19 + Math.random() * 30}, 0.4)`,
          type: 'renaissance',
          opacity: Math.random() * 0.5 + 0.3
        });
      }

      // 薄纱粒子
      for (let i = 0; i < 25; i++) {
        veilParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 40 + 20,
          opacity: Math.random() * 0.15 + 0.05,
          angle: Math.random() * Math.PI * 2,
          life: Math.random() * 600 + 400
        });
      }
    };

    initParticles();

    // 绘制蒙娜丽莎轮廓 - 简化版艺术风格
    const drawMonaLisa = () => {
      ctx.save();
      
      monaLisa.x = canvas.width / 2;
      monaLisa.y = canvas.height / 2;
      monaLisa.scale = Math.min(canvas.width, canvas.height) * 0.0008;
      
      ctx.translate(monaLisa.x, monaLisa.y);
      ctx.scale(monaLisa.scale, monaLisa.scale);
      ctx.rotate(monaLisa.headTilt * 0.1);

      // 背景光晕 - 神秘氛围
      const haloGradient = ctx.createRadialGradient(0, -50, 0, 0, -50, 300);
      haloGradient.addColorStop(0, `rgba(255, 215, 0, ${0.2 + Math.sin(timeRef.current * 0.5) * 0.1})`);
      haloGradient.addColorStop(0.5, `rgba(139, 69, 19, ${0.1 + Math.sin(timeRef.current * 0.3) * 0.05})`);
      haloGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = haloGradient;
      ctx.beginPath();
      ctx.arc(0, -50, 300, 0, Math.PI * 2);
      ctx.fill();

      // 头发
      const hairGradient = ctx.createLinearGradient(-80, -120, 80, -60);
      hairGradient.addColorStop(0, '#2F1B14');
      hairGradient.addColorStop(0.5, '#4A2C1A');
      hairGradient.addColorStop(1, '#5D3317');
      
      ctx.fillStyle = hairGradient;
      ctx.beginPath();
      ctx.ellipse(0, -80, 85, 70, 0, 0, Math.PI * 2);
      ctx.fill();

      // 面部
      const faceGradient = ctx.createRadialGradient(-20, -30, 0, 0, -20, 80);
      faceGradient.addColorStop(0, '#FDBCB4');
      faceGradient.addColorStop(0.7, '#F4A460');
      faceGradient.addColorStop(1, '#D2B48C');
      
      ctx.fillStyle = faceGradient;
      ctx.beginPath();
      ctx.ellipse(0, -20, 60, 80, 0, 0, Math.PI * 2);
      ctx.fill();

      // 眼睛
      const eyeOpacity = 1 - monaLisa.eyeBlink;
      
      // 左眼
      ctx.fillStyle = `rgba(255, 255, 255, ${eyeOpacity})`;
      ctx.beginPath();
      ctx.ellipse(-25, -35, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = `rgba(101, 67, 33, ${eyeOpacity})`;
      ctx.beginPath();
      ctx.ellipse(-25, -35, 6, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = `rgba(0, 0, 0, ${eyeOpacity})`;
      ctx.beginPath();
      ctx.ellipse(-25, -35, 3, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // 右眼
      ctx.fillStyle = `rgba(255, 255, 255, ${eyeOpacity})`;
      ctx.beginPath();
      ctx.ellipse(25, -35, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = `rgba(101, 67, 33, ${eyeOpacity})`;
      ctx.beginPath();
      ctx.ellipse(25, -35, 6, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = `rgba(0, 0, 0, ${eyeOpacity})`;
      ctx.beginPath();
      ctx.ellipse(25, -35, 3, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // 鼻子
      ctx.strokeStyle = 'rgba(139, 69, 19, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(-3, 0);
      ctx.stroke();

      // 神秘的微笑 - 蒙娜丽莎标志性特征
      const smileIntensity = 0.3 + monaLisa.smileIntensity * 0.7;
      ctx.strokeStyle = `rgba(139, 69, 19, ${smileIntensity})`;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(-20, 10);
      ctx.quadraticCurveTo(0, 10 + smileIntensity * 8, 20, 10);
      ctx.stroke();

      // 衣服 - 文艺复兴风格
      const dressGradient = ctx.createLinearGradient(-50, 60, 50, 150);
      dressGradient.addColorStop(0, '#2F4F2F');
      dressGradient.addColorStop(0.5, '#1C3A1C');
      dressGradient.addColorStop(1, '#0F2F0F');
      
      ctx.fillStyle = dressGradient;
      ctx.beginPath();
      ctx.moveTo(-50, 60);
      ctx.lineTo(50, 60);
      ctx.lineTo(70, 150);
      ctx.lineTo(-70, 150);
      ctx.closePath();
      ctx.fill();

      // 双手 - 经典姿势
      ctx.fillStyle = '#F4A460';
      
      // 左手
      ctx.beginPath();
      ctx.ellipse(-30, 120, 8, 15, -0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // 右手
      ctx.beginPath();
      ctx.ellipse(35, 125, 8, 15, 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // 绘制薄纱效果
    const drawVeil = () => {
      veilParticles.forEach(veil => {
        veil.x += veil.vx;
        veil.y += veil.vy;
        veil.angle += 0.02;
        veil.life--;

        if (veil.life <= 0 || veil.x < -100 || veil.x > canvas.width + 100 || veil.y < -100 || veil.y > canvas.height + 100) {
          veil.x = Math.random() * canvas.width;
          veil.y = Math.random() * canvas.height;
          veil.life = Math.random() * 600 + 400;
        }

        const veilGradient = ctx.createRadialGradient(
          veil.x, veil.y, 0,
          veil.x, veil.y, veil.size
        );
        veilGradient.addColorStop(0, `rgba(255, 255, 255, ${veil.opacity})`);
        veilGradient.addColorStop(0.7, `rgba(245, 245, 220, ${veil.opacity * 0.5})`);
        veilGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = veilGradient;
        
        ctx.save();
        ctx.translate(veil.x, veil.y);
        ctx.rotate(veil.angle);
        ctx.scale(1 + Math.sin(timeRef.current + veil.x * 0.01) * 0.2, 1);
        
        ctx.beginPath();
        ctx.ellipse(0, 0, veil.size, veil.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
    };

    const animate = () => {
      timeRef.current += 0.01;

      // 创建文艺复兴背景
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, `rgba(${72 + Math.sin(timeRef.current * 0.3) * 10}, ${61 + Math.sin(timeRef.current * 0.4) * 10}, ${139 + Math.sin(timeRef.current * 0.2) * 20}, 0.95)`);
      bgGradient.addColorStop(0.5, `rgba(${25 + Math.sin(timeRef.current * 0.2) * 5}, ${25 + Math.sin(timeRef.current * 0.5) * 5}, ${112 + Math.sin(timeRef.current * 0.3) * 15}, 0.95)`);
      bgGradient.addColorStop(1, `rgba(${139 + Math.sin(timeRef.current * 0.1) * 20}, ${69 + Math.sin(timeRef.current * 0.6) * 15}, ${19 + Math.sin(timeRef.current * 0.4) * 10}, 0.95)`);
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 更新蒙娜丽莎表情
      monaLisa.eyeBlink = Math.max(0, Math.sin(timeRef.current * 0.1) - 0.9) * 10;
      monaLisa.smileIntensity = (Math.sin(timeRef.current * 0.15) + 1) / 2;
      monaLisa.headTilt = Math.sin(timeRef.current * 0.08) * 0.1;

      // 绘制薄纱
      drawVeil();

      // 更新并绘制粒子
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        if (particle.type === 'golden') {
          const flicker = Math.sin(timeRef.current * 3 + index) * 0.3 + 0.7;
          ctx.fillStyle = particle.color.replace(/[\d.]+\)$/, `${particle.opacity * flicker})`);
          
          // 绘制金色光点
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(timeRef.current + index);
          
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
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
          
        } else if (particle.type === 'mystical') {
          const pulse = Math.sin(timeRef.current * 4 + index * 0.5) * 0.4 + 0.6;
          
          // 神秘光晕
          const mysticalGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
          );
          mysticalGradient.addColorStop(0, particle.color.replace(/[\d.]+\)$/, `${particle.opacity * pulse})`));
          mysticalGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = mysticalGradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
        } else if (particle.type === 'renaissance') {
          ctx.fillStyle = particle.color;
          
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(timeRef.current * 0.5 + index);
          
          // 绘制文艺复兴装饰图案
          ctx.beginPath();
          ctx.moveTo(0, -particle.size);
          ctx.lineTo(particle.size * 0.7, -particle.size * 0.3);
          ctx.lineTo(particle.size * 0.3, particle.size * 0.7);
          ctx.lineTo(-particle.size * 0.3, particle.size * 0.7);
          ctx.lineTo(-particle.size * 0.7, -particle.size * 0.3);
          ctx.closePath();
          ctx.fill();
          
          ctx.restore();
        }

        // 重置消失的粒子
        if (particle.life <= 0 || particle.x < -50 || particle.x > canvas.width + 50 || particle.y < -50 || particle.y > canvas.height + 50) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.vx = (Math.random() - 0.5) * 0.5;
          particle.vy = (Math.random() - 0.5) * 0.3;
          particle.life = particle.maxLife;
        }
      });

      // 绘制蒙娜丽莎
      drawMonaLisa();

      // 添加艺术光效
      if (Math.random() < 0.08) {
        const artX = Math.random() * canvas.width;
        const artY = Math.random() * canvas.height;
        const artRadius = Math.random() * 50 + 30;
        
        const artGradient = ctx.createRadialGradient(
          artX, artY, 0,
          artX, artY, artRadius
        );
        artGradient.addColorStop(0, `rgba(${255}, ${215}, ${0}, ${Math.random() * 0.3})`);
        artGradient.addColorStop(0.7, `rgba(${139}, ${69}, ${19}, ${Math.random() * 0.2})`);
        artGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = artGradient;
        ctx.beginPath();
        ctx.arc(artX, artY, artRadius, 0, Math.PI * 2);
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
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-amber-900 via-orange-900 to-yellow-900">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      {/* 信息悬浮层 */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
        <p className="text-sm opacity-80">蒙娜丽莎 - 永恒的神秘微笑</p>
      </div>
      
      {/* 艺术光效覆盖层 */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-amber-900/10 to-orange-900/20 pointer-events-none" />
    </div>
  );
};