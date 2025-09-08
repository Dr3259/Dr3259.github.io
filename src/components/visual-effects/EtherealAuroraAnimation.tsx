"use client";

import React, { useEffect, useRef } from 'react';

interface AuroraLayer {
  points: Array<{x: number, y: number, intensity: number}>;
  color: string;
  wavelength: number;
  amplitude: number;
  phase: number;
  speed: number;
  opacity: number;
}

interface EtherealParticle {
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
  energy: number;
  dimension: number; // 多维度属性
}

interface HeartParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  heartIndex: number;
  angle: number;
  distance: number;
}

export const EtherealAuroraAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const layersRef = useRef<AuroraLayer[]>([]);
  const particlesRef = useRef<EtherealParticle[]>([]);
  const heartParticlesRef = useRef<HeartParticle[]>([]);
  const timeRef = useRef(0);
  const lastHeartTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initializeEtherealField();
    };

    // 神秘极光色彩 - 只使用4种深邃的颜色
    const auroraColors = [
      '#0066cc',  // 深邃蓝
      '#004d99',  // 神秘靛蓝
      '#001a66',  // 幽深蓝紫
      '#003d7a'   // 暗夜蓝
    ];

    // 维度粒子使用更少的神秘色彩
    const dimensionColors = [
      '#4d79a4',  // 朦胧蓝灰
      '#2e5984',  // 深沉蓝
      '#1a365d'   // 神秘暗蓝
    ];

    // 爱心粒子专用色彩
    const heartColors = [
      '#ff6b9d',  // 柔和粉
      '#ff8fab',  // 浅粉红
      '#ffb3c1',  // 温柔粉
      '#ffc1cc'   // 淡雅粉
    ];

    const initializeEtherealField = () => {
      layersRef.current = [];
      particlesRef.current = [];
      
      // 创建少量神秘极光层
      for (let i = 0; i < 4; i++) {
        const layer: AuroraLayer = {
          points: [],
          color: auroraColors[i],
          wavelength: 0.003 + i * 0.001,
          amplitude: 60 + i * 15,
          phase: (Math.PI * 2 * i) / 4,
          speed: 0.005 + i * 0.003,
          opacity: 0.25 - i * 0.04
        };
        
        // 为每层创建控制点 - 减少点数增加神秘感
        for (let x = 0; x <= canvas.width; x += 50) {
          layer.points.push({
            x,
            y: canvas.height * (0.4 + i * 0.15),
            intensity: 0.3 + Math.random() * 0.4
          });
        }
        
        layersRef.current.push(layer);
      }
      
      // 创建少量神秘粒子
      for (let i = 0; i < 80; i++) {
        createEtherealParticle();
      }
      
      // 初始化爱心粒子系统
      heartParticlesRef.current = [];
    };

    const createEtherealParticle = () => {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 300 - 150,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        vz: (Math.random() - 0.5) * 0.5,
        life: Math.random() * 500 + 200,
        maxLife: Math.random() * 500 + 200,
        size: Math.random() * 2 + 0.5,
        color: dimensionColors[Math.floor(Math.random() * dimensionColors.length)],
        energy: Math.random() * 50,
        dimension: Math.random() * 3
      });
    };

    // 爱心数学公式：心形曲线参数方程
    const getHeartPosition = (t: number, centerX: number, centerY: number, scale: number = 1) => {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      return {
        x: centerX + x * scale,
        y: centerY + y * scale
      };
    };

    const createHeartParticle = (heartIndex: number, centerX: number, centerY: number) => {
      const t = Math.random() * Math.PI * 2;
      const scale = 3 + Math.random() * 2;
      const heartPos = getHeartPosition(t, centerX, centerY, scale);
      
      heartParticlesRef.current.push({
        x: heartPos.x + (Math.random() - 0.5) * 20,
        y: heartPos.y + (Math.random() - 0.5) * 20,
        targetX: heartPos.x,
        targetY: heartPos.y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random() * 300 + 200,
        maxLife: Math.random() * 300 + 200,
        size: Math.random() * 3 + 1,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        heartIndex,
        angle: t,
        distance: Math.random() * 30 + 10
      });
    };

    const drawBackground = () => {
      // 深邃神秘的背景
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#000508');
      gradient.addColorStop(0.3, '#001122');
      gradient.addColorStop(0.7, '#000a1a');
      gradient.addColorStop(1, '#000000');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 减少扭曲效果，保持神秘感
      for (let i = 0; i < 2; i++) {
        const warpX = canvas.width * (0.3 + i * 0.4);
        const warpY = canvas.height * (0.5 + Math.sin(timeRef.current * 0.008 + i) * 0.1);
        const warpRadius = 150 + Math.sin(timeRef.current * 0.015 + i) * 30;
        
        const warpGradient = ctx.createRadialGradient(
          warpX, warpY, 0,
          warpX, warpY, warpRadius
        );
        warpGradient.addColorStop(0, 'rgba(0, 51, 102, 0.08)');
        warpGradient.addColorStop(0.6, 'rgba(0, 26, 77, 0.04)');
        warpGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = warpGradient;
        ctx.beginPath();
        ctx.arc(warpX, warpY, warpRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawMysticalOrbs = () => {
      // 绘制神秘光球 - 减少数量增加神秘感
      const orbs = [
        { x: canvas.width * 0.15, y: canvas.height * 0.2 },
        { x: canvas.width * 0.85, y: canvas.height * 0.8 }
      ];
      
      orbs.forEach((orb, index) => {
        const time = timeRef.current * 0.006;
        const baseSize = 40 + Math.sin(time + index * 2) * 15;
        
        // 神秘光球效果
        for (let ring = 0; ring < 3; ring++) {
          const ringSize = baseSize + ring * 25;
          const alpha = 0.2 - ring * 0.05;
          
          ctx.save();
          ctx.globalAlpha = alpha;
          
          // 光球渐变
          const orbGradient = ctx.createRadialGradient(
            orb.x, orb.y, 0,
            orb.x, orb.y, ringSize
          );
          orbGradient.addColorStop(0, auroraColors[index % auroraColors.length]);
          orbGradient.addColorStop(0.4, auroraColors[(index + 1) % auroraColors.length]);
          orbGradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = orbGradient;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, ringSize, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
        
        // 中心光点
        ctx.save();
        ctx.globalAlpha = 0.6 + Math.sin(time + index) * 0.2;
        ctx.fillStyle = auroraColors[index % auroraColors.length];
        ctx.shadowBlur = 20;
        ctx.shadowColor = auroraColors[index % auroraColors.length];
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const drawAuroraLayer = (layer: AuroraLayer) => {
      ctx.save();
      ctx.globalAlpha = layer.opacity;
      
      // 创建Aurora路径
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.3, layer.color);
      gradient.addColorStop(0.7, layer.color);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      
      // 绘制波动的Aurora
      for (let i = 0; i < layer.points.length; i++) {
        const point = layer.points[i];
        const wave = Math.sin(point.x * layer.wavelength + timeRef.current * layer.speed + layer.phase);
        const y = point.y + wave * layer.amplitude * point.intensity;
        
        if (i === 0) {
          ctx.lineTo(point.x, y);
        } else {
          // 使用贝塞尔曲线创建平滑效果
          const prevPoint = layer.points[i - 1];
          const prevWave = Math.sin(prevPoint.x * layer.wavelength + timeRef.current * layer.speed + layer.phase);
          const prevY = prevPoint.y + prevWave * layer.amplitude * prevPoint.intensity;
          
          const cpX = (prevPoint.x + point.x) / 2;
          const cpY = (prevY + y) / 2;
          
          ctx.quadraticCurveTo(cpX, cpY, point.x, y);
        }
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();
      
      // 添加发光边缘
      ctx.strokeStyle = layer.color;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 20;
      ctx.shadowColor = layer.color;
      
      ctx.beginPath();
      for (let i = 0; i < layer.points.length; i++) {
        const point = layer.points[i];
        const wave = Math.sin(point.x * layer.wavelength + timeRef.current * layer.speed + layer.phase);
        const y = point.y + wave * layer.amplitude * point.intensity;
        
        if (i === 0) {
          ctx.moveTo(point.x, y);
        } else {
          ctx.lineTo(point.x, y);
        }
      }
      ctx.stroke();
      
      ctx.restore();
    };

    const updateEtherealParticles = () => {
      particlesRef.current = particlesRef.current.filter(particle => {
        // 多维运动
        const dimensionFactor = Math.sin(timeRef.current * 0.02 + particle.dimension);
        particle.vx += Math.sin(particle.dimension + timeRef.current * 0.01) * 0.1;
        particle.vy += Math.cos(particle.dimension + timeRef.current * 0.01) * 0.1;
        particle.vz += dimensionFactor * 0.05;
        
        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;
        
        // 边界处理（多维卷绕）
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.z < -250) particle.z = 250;
        if (particle.z > 250) particle.z = -250;
        
        particle.life--;
        return particle.life > 0;
      });
      
      // 补充新粒子
      while (particlesRef.current.length < 80) {
        createEtherealParticle();
      }
    };

    const drawEtherealParticles = () => {
      particlesRef.current.forEach(particle => {
        const perspective = 300 / (300 + particle.z);
        const screenX = particle.x;
        const screenY = particle.y;
        const size = particle.size * perspective;
        const alpha = (particle.life / particle.maxLife) * perspective;
        
        if (alpha <= 0 || size <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // 多维光晕效果
        const dimensionShift = Math.sin(particle.dimension + timeRef.current * 0.03) * 20;
        const glowSize = size * (3 + Math.abs(dimensionShift) * 0.1);
        
        // 主光晕
        const mainGlow = ctx.createRadialGradient(
          screenX, screenY, 0,
          screenX, screenY, glowSize
        );
        mainGlow.addColorStop(0, particle.color);
        
        // 正确地将十六进制颜色转换为rgba格式
        let semiTransparentColor;
        if (particle.color.startsWith('#')) {
          // 处理十六进制颜色
          const hex = particle.color.substring(1);
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          semiTransparentColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
        } else if (particle.color.startsWith('rgba')) {
          // 如果已经是rgba格式，替换透明度
          semiTransparentColor = particle.color.replace(/,[\s]*[\d.]+\)$/, ', 0.5)');
        } else if (particle.color.startsWith('rgb')) {
          // 如果是rgb格式，转换为rgba
          semiTransparentColor = particle.color.replace('rgb', 'rgba').replace(')', ', 0.5)');
        } else {
          // 默认情况，直接使用原色
          semiTransparentColor = particle.color;
        }
        
        mainGlow.addColorStop(0.5, semiTransparentColor);
        mainGlow.addColorStop(1, 'transparent');
        
        ctx.fillStyle = mainGlow;
        ctx.beginPath();
        ctx.arc(screenX, screenY, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 维度残影
        for (let d = 1; d <= 3; d++) {
          const shadowX = screenX + Math.sin(particle.dimension + d) * dimensionShift;
          const shadowY = screenY + Math.cos(particle.dimension + d) * dimensionShift;
          const shadowAlpha = alpha * (0.3 / d);
          
          ctx.save();
          ctx.globalAlpha = shadowAlpha;
          
          const shadowGlow = ctx.createRadialGradient(
            shadowX, shadowY, 0,
            shadowX, shadowY, size * 2
          );
          shadowGlow.addColorStop(0, particle.color);
          shadowGlow.addColorStop(1, 'transparent');
          
          ctx.fillStyle = shadowGlow;
          ctx.beginPath();
          ctx.arc(shadowX, shadowY, size * 2, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
        
        // 粒子核心
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
    };

    const drawMysticSymbols = () => {
      // 绘制少量神秘符号
      const symbols = ['☯', '◉', '◆'];
      
      for (let i = 0; i < 3; i++) {
        const x = canvas.width * (0.2 + i * 0.3) + Math.sin(timeRef.current * 0.01 + i) * 20;
        const y = canvas.height * 0.15 + Math.cos(timeRef.current * 0.008 + i) * 10;
        const symbol = symbols[i];
        const alpha = 0.4 + Math.sin(timeRef.current * 0.02 + i) * 0.2;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = auroraColors[i];
        ctx.shadowBlur = 25;
        ctx.shadowColor = auroraColors[i];
        ctx.font = '28px serif';
        ctx.textAlign = 'center';
        ctx.fillText(symbol, x, y);
        ctx.restore();
      }
    };

    const drawEnergyStreams = () => {
      // 绘制少量神秘能量流
      const streams = 2;
      for (let s = 0; s < streams; s++) {
        const streamY = canvas.height * (0.6 + s * 0.2);
        const speed = 0.008 + s * 0.003;
        
        ctx.save();
        ctx.globalAlpha = 0.3;
        
        const streamGradient = ctx.createLinearGradient(0, streamY, canvas.width, streamY);
        streamGradient.addColorStop(0, 'transparent');
        streamGradient.addColorStop(0.4, auroraColors[s]);
        streamGradient.addColorStop(0.6, auroraColors[s]);
        streamGradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = streamGradient;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = auroraColors[s];
        ctx.beginPath();
        
        for (let x = 0; x <= canvas.width; x += 8) {
          const wave = Math.sin(x * 0.008 + timeRef.current * speed + s) * 12;
          const y = streamY + wave;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
        ctx.restore();
      }
    };

    const updateHeartParticles = () => {
      const currentTime = timeRef.current;
      
      // 每120帧创建新的爱心
      if (currentTime % 120 === 0) {
        // 创建两个爱心位置
        const heart1X = canvas.width * 0.25;
        const heart1Y = canvas.height * 0.3;
        const heart2X = canvas.width * 0.75;
        const heart2Y = canvas.height * 0.7;
        
        // 为每个爱心添加粒子
        for (let i = 0; i < 12; i++) {
          createHeartParticle(0, heart1X, heart1Y);
          createHeartParticle(1, heart2X, heart2Y);
        }
      }
      
      // 更新现有粒子
      heartParticlesRef.current = heartParticlesRef.current.filter(particle => {
        // 向目标位置移动
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        particle.vx += dx * 0.02;
        particle.vy += dy * 0.02;
        
        // 添加轻微的随机运动
        particle.vx += (Math.random() - 0.5) * 0.1;
        particle.vy += (Math.random() - 0.5) * 0.1;
        
        // 阻尼
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        
        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // 更新生命值
        particle.life--;
        
        return particle.life > 0;
      });
      
      // 限制粒子数量
      if (heartParticlesRef.current.length > 150) {
        heartParticlesRef.current = heartParticlesRef.current.slice(-150);
      }
    };

    const drawHeartParticles = () => {
      heartParticlesRef.current.forEach(particle => {
        const alpha = particle.life / particle.maxLife;
        if (alpha <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = alpha * 0.8;
        
        // 粒子光晕
        const glowSize = particle.size * 4;
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        
        // 正确处理颜色格式
        let glowColor;
        if (particle.color.startsWith('#')) {
          const hex = particle.color.substring(1);
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          glowColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
        } else {
          glowColor = particle.color;
        }
        
        glowGradient.addColorStop(0, particle.color);
        glowGradient.addColorStop(0.5, glowColor);
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 粒子核心
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
    };

    const animate = () => {
      timeRef.current += 1;
      
      drawBackground();
      drawMysticalOrbs();
      drawEnergyStreams();
      
      // 绘制Aurora层（从后到前）
      layersRef.current.forEach(layer => {
        layer.phase += layer.speed;
        drawAuroraLayer(layer);
      });
      
      updateEtherealParticles();
      drawEtherealParticles();
      
      updateHeartParticles();
      drawHeartParticles();
      
      drawMysticSymbols();
      
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