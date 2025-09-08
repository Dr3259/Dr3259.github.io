"use client";

import React, { useEffect, useRef } from 'react';

interface CrystalPetal {
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  size: number;
  layer: number;
  opacity: number;
  crystallineEdges: Array<{x1: number, y1: number, x2: number, y2: number}>;
}

interface CrystalFragment {
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
  facets: Array<{angle: number, intensity: number}>;
  rotation: number;
  rotationSpeed: number;
}

interface MagicParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  trail: Array<{x: number, y: number, alpha: number}>;
  sparkle: boolean;
}

export const BlueCrystalRoseAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const petalsRef = useRef<CrystalPetal[]>([]);
  const fragmentsRef = useRef<CrystalFragment[]>([]);
  const magicParticlesRef = useRef<MagicParticle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initializeCrystalRose();
    };

    // 蓝色水晶妖姬色彩调色板
    const crystalColors = {
      deepBlue: '#0f1f4f',      // 深邃蓝
      sapphire: '#1e3a8a',      // 蓝宝石
      ice: '#60a5fa',           // 冰晶蓝
      crystal: '#bfdbfe',       // 水晶蓝
      diamond: '#f0f9ff',       // 钻石白
      mystical: '#3b82f6',      // 神秘蓝
      aura: '#8db3e6'           // 光环蓝
    };

    const magicColors = [
      '#60a5fa', '#3b82f6', '#1d4ed8', '#1e40af', '#bfdbfe'
    ];

    const initializeCrystalRose = () => {
      petalsRef.current = [];
      fragmentsRef.current = [];
      magicParticlesRef.current = [];
      
      createCrystalPetals();
      createFloatingFragments();
      createMagicAura();
    };

    const createCrystalPetals = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const layers = 6; // 6层花瓣
      
      for (let layer = 0; layer < layers; layer++) {
        const petalsInLayer = 8 + layer * 2; // 每层花瓣数量递增
        const baseRadius = 30 + layer * 25;
        
        for (let i = 0; i < petalsInLayer; i++) {
          const angle = (Math.PI * 2 * i) / petalsInLayer + layer * 0.3;
          const radius = baseRadius + Math.sin(angle * 3) * 10;
          
          const petal: CrystalPetal = {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            z: layer * 10,
            rotationX: Math.random() * Math.PI * 2,
            rotationY: Math.random() * Math.PI * 2,
            rotationZ: angle + Math.PI / 4,
            size: 15 + layer * 3 + Math.random() * 5,
            layer: layer,
            opacity: 0.7 + layer * 0.05,
            crystallineEdges: []
          };
          
          // 为每个花瓣创建水晶切面边缘
          const edges = 6;
          for (let e = 0; e < edges; e++) {
            const edgeAngle = (Math.PI * 2 * e) / edges;
            const edgeRadius = petal.size * 0.8;
            petal.crystallineEdges.push({
              x1: Math.cos(edgeAngle) * edgeRadius,
              y1: Math.sin(edgeAngle) * edgeRadius,
              x2: Math.cos(edgeAngle + Math.PI * 2 / edges) * edgeRadius,
              y2: Math.sin(edgeAngle + Math.PI * 2 / edges) * edgeRadius
            });
          }
          
          petalsRef.current.push(petal);
        }
      }
    };

    const createFloatingFragments = () => {
      for (let i = 0; i < 150; i++) {
        const fragment: CrystalFragment = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 200 - 100,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          vz: (Math.random() - 0.5) * 0.3,
          life: Math.random() * 400 + 200,
          maxLife: Math.random() * 400 + 200,
          size: Math.random() * 4 + 1,
          color: magicColors[Math.floor(Math.random() * magicColors.length)],
          facets: [],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02
        };
        
        // 为每个碎片创建多个切面
        for (let f = 0; f < 6; f++) {
          fragment.facets.push({
            angle: (Math.PI * 2 * f) / 6,
            intensity: 0.3 + Math.random() * 0.5
          });
        }
        
        fragmentsRef.current.push(fragment);
      }
    };

    const createMagicAura = () => {
      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 200 + Math.random() * 100;
        
        magicParticlesRef.current.push({
          x: canvas.width / 2 + Math.cos(angle) * distance,
          y: canvas.height / 2 + Math.sin(angle) * distance,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          life: Math.random() * 300 + 150,
          maxLife: Math.random() * 300 + 150,
          size: Math.random() * 3 + 1,
          color: magicColors[Math.floor(Math.random() * magicColors.length)],
          trail: [],
          sparkle: Math.random() > 0.7
        });
      }
    };

    const drawMysticalBackground = () => {
      // 神秘渐变背景
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, '#0a0a1a');
      gradient.addColorStop(0.3, crystalColors.deepBlue);
      gradient.addColorStop(0.7, '#1a1a2e');
      gradient.addColorStop(1, '#000000');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 添加星光效果
      drawStarField();
    };

    const drawStarField = () => {
      ctx.save();
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const brightness = Math.random() * 0.8 + 0.2;
        const twinkle = Math.sin(timeRef.current * 0.02 + i) * 0.3 + 0.7;
        
        ctx.globalAlpha = brightness * twinkle;
        ctx.fillStyle = crystalColors.crystal;
        ctx.shadowBlur = 3;
        ctx.shadowColor = crystalColors.crystal;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawCrystalPetal = (petal: CrystalPetal) => {
      const time = timeRef.current;
      const breathe = Math.sin(time * 0.01 + petal.layer * 0.5) * 0.1 + 0.9;
      const rotate = time * 0.005 + petal.layer * 0.1;
      
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.rotationZ + rotate);
      ctx.scale(breathe, breathe);
      ctx.globalAlpha = petal.opacity;
      
      // 绘制水晶花瓣主体
      const petalGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, petal.size);
      petalGradient.addColorStop(0, crystalColors.diamond);
      petalGradient.addColorStop(0.3, crystalColors.crystal);
      petalGradient.addColorStop(0.7, crystalColors.ice);
      petalGradient.addColorStop(1, crystalColors.sapphire);
      
      ctx.fillStyle = petalGradient;
      ctx.shadowBlur = 20;
      ctx.shadowColor = crystalColors.mystical;
      
      // 绘制花瓣形状
      ctx.beginPath();
      ctx.moveTo(0, -petal.size);
      ctx.bezierCurveTo(
        petal.size * 0.7, -petal.size * 0.7,
        petal.size * 0.7, petal.size * 0.7,
        0, petal.size
      );
      ctx.bezierCurveTo(
        -petal.size * 0.7, petal.size * 0.7,
        -petal.size * 0.7, -petal.size * 0.7,
        0, -petal.size
      );
      ctx.fill();
      
      // 绘制水晶切面
      ctx.globalAlpha = petal.opacity * 0.6;
      ctx.strokeStyle = crystalColors.diamond;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 5;
      
      petal.crystallineEdges.forEach(edge => {
        ctx.beginPath();
        ctx.moveTo(edge.x1, edge.y1);
        ctx.lineTo(edge.x2, edge.y2);
        ctx.stroke();
      });
      
      // 内部高光
      ctx.globalAlpha = petal.opacity * 0.8;
      ctx.fillStyle = crystalColors.diamond;
      ctx.beginPath();
      ctx.arc(0, -petal.size * 0.3, petal.size * 0.2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const updateCrystalFragments = () => {
      fragmentsRef.current = fragmentsRef.current.filter(fragment => {
        // 三维运动
        fragment.x += fragment.vx;
        fragment.y += fragment.vy;
        fragment.z += fragment.vz;
        fragment.rotation += fragment.rotationSpeed;
        
        // 引力效果（向玫瑰中心）
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const dx = centerX - fragment.x;
        const dy = centerY - fragment.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 100) {
          fragment.vx += dx * 0.0001;
          fragment.vy += dy * 0.0001;
        }
        
        // 边界处理
        if (fragment.x < 0 || fragment.x > canvas.width) fragment.vx *= -0.8;
        if (fragment.y < 0 || fragment.y > canvas.height) fragment.vy *= -0.8;
        
        fragment.life--;
        return fragment.life > 0;
      });
      
      // 补充新碎片
      while (fragmentsRef.current.length < 150) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 300 + Math.random() * 200;
        
        fragmentsRef.current.push({
          x: canvas.width / 2 + Math.cos(angle) * distance,
          y: canvas.height / 2 + Math.sin(angle) * distance,
          z: Math.random() * 200 - 100,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          vz: (Math.random() - 0.5) * 0.3,
          life: Math.random() * 400 + 200,
          maxLife: Math.random() * 400 + 200,
          size: Math.random() * 4 + 1,
          color: magicColors[Math.floor(Math.random() * magicColors.length)],
          facets: Array(6).fill(0).map((_, i) => ({
            angle: (Math.PI * 2 * i) / 6,
            intensity: 0.3 + Math.random() * 0.5
          })),
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02
        });
      }
    };

    const drawCrystalFragments = () => {
      fragmentsRef.current.forEach(fragment => {
        const perspective = 300 / (300 + fragment.z);
        const screenX = fragment.x;
        const screenY = fragment.y;
        const size = fragment.size * perspective;
        const alpha = (fragment.life / fragment.maxLife) * perspective;
        
        if (alpha <= 0 || size <= 0) return;
        
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(fragment.rotation);
        ctx.globalAlpha = alpha;
        
        // 绘制水晶碎片的多个切面
        fragment.facets.forEach(facet => {
          ctx.save();
          ctx.rotate(facet.angle);
          ctx.globalAlpha = alpha * facet.intensity;
          
          const facetGradient = ctx.createLinearGradient(-size, -size, size, size);
          facetGradient.addColorStop(0, fragment.color);
          facetGradient.addColorStop(0.5, crystalColors.crystal);
          facetGradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = facetGradient;
          ctx.fillRect(-size, -size, size * 2, size * 2);
          ctx.restore();
        });
        
        // 核心光点
        ctx.fillStyle = fragment.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = fragment.color;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
    };

    const updateMagicParticles = () => {
      magicParticlesRef.current = magicParticlesRef.current.filter(particle => {
        // 轨迹记录
        particle.trail.unshift({ x: particle.x, y: particle.y, alpha: 1 });
        if (particle.trail.length > 10) {
          particle.trail.pop();
        }
        
        // 螺旋运动
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const angle = Math.atan2(particle.y - centerY, particle.x - centerX);
        const distance = Math.sqrt((particle.x - centerX) ** 2 + (particle.y - centerY) ** 2);
        
        particle.vx += Math.cos(angle + Math.PI / 2) * 0.01;
        particle.vy += Math.sin(angle + Math.PI / 2) * 0.01;
        
        // 缓慢向中心移动
        if (distance > 50) {
          particle.vx += (centerX - particle.x) * 0.0005;
          particle.vy += (centerY - particle.y) * 0.0005;
        }
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        particle.life--;
        return particle.life > 0;
      });
      
      // 补充新粒子
      while (magicParticlesRef.current.length < 80) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 200 + Math.random() * 100;
        
        magicParticlesRef.current.push({
          x: canvas.width / 2 + Math.cos(angle) * distance,
          y: canvas.height / 2 + Math.sin(angle) * distance,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          life: Math.random() * 300 + 150,
          maxLife: Math.random() * 300 + 150,
          size: Math.random() * 3 + 1,
          color: magicColors[Math.floor(Math.random() * magicColors.length)],
          trail: [],
          sparkle: Math.random() > 0.7
        });
      }
    };

    const drawMagicParticles = () => {
      magicParticlesRef.current.forEach(particle => {
        const alpha = particle.life / particle.maxLife;
        
        // 绘制轨迹
        particle.trail.forEach((point, index) => {
          const trailAlpha = alpha * point.alpha * (1 - index / particle.trail.length);
          if (trailAlpha <= 0) return;
          
          ctx.save();
          ctx.globalAlpha = trailAlpha;
          ctx.fillStyle = particle.color;
          ctx.shadowBlur = 5;
          ctx.shadowColor = particle.color;
          ctx.beginPath();
          ctx.arc(point.x, point.y, particle.size * (1 - index / particle.trail.length), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
        
        // 主粒子
        ctx.save();
        ctx.globalAlpha = alpha;
        
        if (particle.sparkle) {
          // 闪烁效果
          const sparkle = Math.sin(timeRef.current * 0.1) * 0.5 + 0.5;
          ctx.globalAlpha = alpha * sparkle;
          
          // 十字光芒
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 1;
          ctx.shadowBlur = 10;
          ctx.shadowColor = particle.color;
          
          ctx.beginPath();
          ctx.moveTo(particle.x - particle.size * 3, particle.y);
          ctx.lineTo(particle.x + particle.size * 3, particle.y);
          ctx.moveTo(particle.x, particle.y - particle.size * 3);
          ctx.lineTo(particle.x, particle.y + particle.size * 3);
          ctx.stroke();
        }
        
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
    };

    const animate = () => {
      timeRef.current += 1;
      
      drawMysticalBackground();
      
      updateCrystalFragments();
      drawCrystalFragments();
      
      updateMagicParticles();
      drawMagicParticles();
      
      // 绘制水晶玫瑰（按层次从外到内）
      petalsRef.current
        .sort((a, b) => b.layer - a.layer)
        .forEach(petal => drawCrystalPetal(petal));
      
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