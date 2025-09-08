"use client";

import React, { useEffect, useRef } from 'react';

export const EarthAnimation: React.FC = () => {
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

    // 地球参数
    const earthRadius = Math.min(canvas.width, canvas.height) * 0.15;
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;

    // 粒子系统
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
      type: 'star' | 'aurora' | 'satellite';
    }> = [];

    // 云层数据
    const clouds: Array<{
      angle: number;
      radius: number;
      size: number;
      opacity: number;
      speed: number;
    }> = [];

    // 初始化粒子
    const initParticles = () => {
      // 星星
      for (let i = 0; i < 150; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          life: Math.random() * 200 + 100,
          maxLife: Math.random() * 200 + 100,
          size: Math.random() * 2 + 0.5,
          color: `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`,
          type: 'star'
        });
      }

      // 极光粒子
      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = earthRadius + Math.random() * 50 + 20;
        particles.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: Math.random() * 100 + 50,
          maxLife: Math.random() * 100 + 50,
          size: Math.random() * 3 + 1,
          color: `rgba(${Math.random() * 100 + 100}, ${Math.random() * 200 + 50}, ${Math.random() * 150 + 100}, 0.6)`,
          type: 'aurora'
        });
      }

      // 卫星轨道粒子
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = earthRadius + Math.random() * 80 + 40;
        particles.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          vx: Math.cos(angle + Math.PI / 2) * 2,
          vy: Math.sin(angle + Math.PI / 2) * 2,
          life: 300,
          maxLife: 300,
          size: Math.random() * 2 + 1,
          color: 'rgba(255, 200, 100, 0.8)',
          type: 'satellite'
        });
      }
    };

    // 初始化云层
    const initClouds = () => {
      for (let i = 0; i < 25; i++) {
        clouds.push({
          angle: Math.random() * Math.PI * 2,
          radius: earthRadius - Math.random() * 20 - 5,
          size: Math.random() * 30 + 15,
          opacity: Math.random() * 0.4 + 0.1,
          speed: Math.random() * 0.01 + 0.005
        });
      }
    };

    initParticles();
    initClouds();

    // 绘制地球表面纹理
    const drawEarthSurface = (rotation: number) => {
      // 地球主体渐变
      const earthGradient = ctx.createRadialGradient(
        centerX - earthRadius * 0.3,
        centerY - earthRadius * 0.3,
        0,
        centerX,
        centerY,
        earthRadius
      );
      earthGradient.addColorStop(0, '#4A90E2');
      earthGradient.addColorStop(0.3, '#2E5C8A');
      earthGradient.addColorStop(0.6, '#1E3A5F');
      earthGradient.addColorStop(1, '#0F1E3D');

      ctx.fillStyle = earthGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      // 绘制大陆轮廓（简化版）
      ctx.strokeStyle = 'rgba(34, 139, 34, 0.8)';
      ctx.fillStyle = 'rgba(34, 139, 34, 0.6)';
      ctx.lineWidth = 2;

      for (let i = 0; i < 8; i++) {
        const angle = (rotation + i * 0.8) % (Math.PI * 2);
        const continentX = centerX + Math.cos(angle) * (earthRadius * 0.7);
        const continentY = centerY + Math.sin(angle) * (earthRadius * 0.4);
        const size = earthRadius * 0.3;

        ctx.beginPath();
        ctx.ellipse(continentX, continentY, size, size * 0.6, angle, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // 绘制海洋反光
      const oceanGradient = ctx.createRadialGradient(
        centerX - earthRadius * 0.4,
        centerY - earthRadius * 0.4,
        0,
        centerX,
        centerY,
        earthRadius * 0.8
      );
      oceanGradient.addColorStop(0, 'rgba(135, 206, 250, 0.3)');
      oceanGradient.addColorStop(1, 'rgba(135, 206, 250, 0)');

      ctx.fillStyle = oceanGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    // 绘制云层
    const drawClouds = () => {
      clouds.forEach(cloud => {
        cloud.angle += cloud.speed;
        
        const cloudX = centerX + Math.cos(cloud.angle) * cloud.radius;
        const cloudY = centerY + Math.sin(cloud.angle) * cloud.radius * 0.5;
        
        const cloudGradient = ctx.createRadialGradient(
          cloudX, cloudY, 0,
          cloudX, cloudY, cloud.size
        );
        cloudGradient.addColorStop(0, `rgba(255, 255, 255, ${cloud.opacity})`);
        cloudGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = cloudGradient;
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, cloud.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // 绘制大气层
    const drawAtmosphere = () => {
      const atmosphereGradient = ctx.createRadialGradient(
        centerX, centerY, earthRadius,
        centerX, centerY, earthRadius * 1.3
      );
      atmosphereGradient.addColorStop(0, 'rgba(135, 206, 250, 0.3)');
      atmosphereGradient.addColorStop(0.5, 'rgba(100, 149, 237, 0.2)');
      atmosphereGradient.addColorStop(1, 'rgba(70, 130, 180, 0)');

      ctx.fillStyle = atmosphereGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius * 1.3, 0, Math.PI * 2);
      ctx.fill();
    };

    // 绘制极光
    const drawAurora = () => {
      // 北极光
      const auroraGradient = ctx.createLinearGradient(
        centerX - earthRadius, centerY - earthRadius * 1.5,
        centerX + earthRadius, centerY - earthRadius * 0.8
      );
      auroraGradient.addColorStop(0, 'rgba(0, 255, 100, 0)');
      auroraGradient.addColorStop(0.3, `rgba(0, 255, 100, ${0.3 + Math.sin(timeRef.current * 2) * 0.1})`);
      auroraGradient.addColorStop(0.7, `rgba(100, 150, 255, ${0.2 + Math.sin(timeRef.current * 2.5) * 0.1})`);
      auroraGradient.addColorStop(1, 'rgba(255, 100, 200, 0)');

      ctx.fillStyle = auroraGradient;
      ctx.beginPath();
      for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 * i) / 20 + timeRef.current * 0.5;
        const x = centerX + Math.cos(angle) * (earthRadius * 1.2 + Math.sin(timeRef.current * 3 + i) * 20);
        const y = centerY - earthRadius * 1.1 + Math.sin(angle * 2 + timeRef.current) * 30;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();
    };

    // 绘制昼夜分界线
    const drawDayNightTerminator = (rotation: number) => {
      const terminatorGradient = ctx.createLinearGradient(
        centerX - earthRadius, centerY,
        centerX + earthRadius, centerY
      );
      
      const shadowPos = Math.max(0.1, Math.min(0.9, 0.5 + Math.sin(rotation) * 0.3));
      const shadowStart = Math.max(0, shadowPos - 0.2);
      const shadowEnd = Math.min(1, shadowPos + 0.3);
      
      terminatorGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      terminatorGradient.addColorStop(shadowStart, 'rgba(0, 0, 0, 0)');
      terminatorGradient.addColorStop(shadowPos, 'rgba(0, 0, 0, 0.4)');
      terminatorGradient.addColorStop(shadowEnd, 'rgba(0, 0, 0, 0.7)');
      terminatorGradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');

      ctx.fillStyle = terminatorGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    // 绘制月球
    const drawMoon = (earthRotation: number) => {
      const moonDistance = earthRadius * 3;
      const moonAngle = earthRotation * 0.3;
      const moonX = centerX + Math.cos(moonAngle) * moonDistance;
      const moonY = centerY + Math.sin(moonAngle) * moonDistance * 0.3;
      const moonRadius = earthRadius * 0.25;

      // 月球阴影
      const moonShadowGradient = ctx.createRadialGradient(
        moonX, moonY, 0,
        moonX, moonY, moonRadius * 2
      );
      moonShadowGradient.addColorStop(0, 'rgba(200, 200, 200, 0.1)');
      moonShadowGradient.addColorStop(1, 'rgba(200, 200, 200, 0)');
      
      ctx.fillStyle = moonShadowGradient;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      // 月球主体
      const moonGradient = ctx.createRadialGradient(
        moonX - moonRadius * 0.3,
        moonY - moonRadius * 0.3,
        0,
        moonX,
        moonY,
        moonRadius
      );
      moonGradient.addColorStop(0, '#F5F5DC');
      moonGradient.addColorStop(0.7, '#D3D3D3');
      moonGradient.addColorStop(1, '#A9A9A9');

      ctx.fillStyle = moonGradient;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fill();

      // 月球环形山
      for (let i = 0; i < 5; i++) {
        const craterAngle = (i * Math.PI * 0.4) + moonAngle;
        const craterX = moonX + Math.cos(craterAngle) * (moonRadius * 0.3);
        const craterY = moonY + Math.sin(craterAngle) * (moonRadius * 0.3);
        const craterSize = moonRadius * 0.1;

        ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
        ctx.beginPath();
        ctx.arc(craterX, craterY, craterSize, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = () => {
      timeRef.current += 0.02;
      
      // 更新画布中心点
      centerX = canvas.width / 2;
      centerY = canvas.height / 2;

      // 清除画布 - 深色太空背景
      const spaceGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, Math.max(canvas.width, canvas.height)
      );
      spaceGradient.addColorStop(0, '#001122');
      spaceGradient.addColorStop(0.5, '#000811');
      spaceGradient.addColorStop(1, '#000000');
      
      ctx.fillStyle = spaceGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制粒子
      particles.forEach((particle, index) => {
        if (particle.type === 'star') {
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

          const opacity = Math.sin(timeRef.current * 2 + index * 0.1) * 0.3 + 0.7;
          ctx.fillStyle = particle.color.replace(/[\d.]+\)$/g, `${opacity})`);
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

        } else if (particle.type === 'aurora') {
          const angle = Math.atan2(particle.y - centerY, particle.x - centerX);
          const distance = Math.sqrt((particle.x - centerX) ** 2 + (particle.y - centerY) ** 2);
          
          particle.x = centerX + Math.cos(angle + 0.02) * distance;
          particle.y = centerY + Math.sin(angle + 0.02) * distance;
          particle.life -= 0.3;

          if (particle.life <= 0) {
            const newAngle = Math.random() * Math.PI * 2;
            const newDistance = earthRadius + Math.random() * 50 + 20;
            particle.x = centerX + Math.cos(newAngle) * newDistance;
            particle.y = centerY + Math.sin(newAngle) * newDistance;
            particle.life = particle.maxLife;
          }

          const opacity = (particle.life / particle.maxLife) * 0.6;
          ctx.fillStyle = particle.color.replace(/[\d.]+\)$/g, `${opacity})`);
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

        } else if (particle.type === 'satellite') {
          const angle = Math.atan2(particle.y - centerY, particle.x - centerX) + 0.015;
          const distance = Math.sqrt((particle.x - centerX) ** 2 + (particle.y - centerY) ** 2);
          
          particle.x = centerX + Math.cos(angle) * distance;
          particle.y = centerY + Math.sin(angle) * distance;

          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

          // 卫星尾迹
          ctx.strokeStyle = 'rgba(255, 200, 100, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          const trailLength = 15;
          for (let i = 1; i <= trailLength; i++) {
            const trailAngle = angle - (i * 0.015);
            const trailX = centerX + Math.cos(trailAngle) * distance;
            const trailY = centerY + Math.sin(trailAngle) * distance;
            
            if (i === 1) {
              ctx.moveTo(particle.x, particle.y);
            }
            ctx.lineTo(trailX, trailY);
          }
          ctx.stroke();
        }
      });

      const earthRotation = timeRef.current * 0.5;

      // 绘制月球（在地球后面）
      drawMoon(earthRotation);

      // 绘制地球
      drawEarthSurface(earthRotation);
      drawClouds();
      drawDayNightTerminator(earthRotation);
      drawAtmosphere();
      drawAurora();

      // 添加一些闪烁效果
      if (Math.random() < 0.05) {
        const sparkleX = centerX + (Math.random() - 0.5) * earthRadius * 2.5;
        const sparkleY = centerY + (Math.random() - 0.5) * earthRadius * 2.5;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, Math.random() * 3 + 1, 0, Math.PI * 2);
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
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-gray-900 via-blue-900 to-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      {/* 信息悬浮层 */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
        <p className="text-sm opacity-80">地球家园 - 我们美丽的蓝色星球</p>
      </div>
      
      {/* 神秘光效覆盖层 */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-blue-900/10 pointer-events-none" />
    </div>
  );
};