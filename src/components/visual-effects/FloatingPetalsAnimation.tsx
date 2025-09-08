"use client";

import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

export const FloatingPetalsAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const petalsRef = useRef<Petal[]>([]);
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

    const petalColors = [
      '#ffb3d9', // 粉红
      '#ffc3e6', // 浅粉
      '#ffe6f3', // 很浅粉
      '#fff0f8', // 白粉
      '#ffffff', // 白色
    ];

    const createPetal = (): Petal => {
      return {
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 2 + 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        size: Math.random() * 8 + 4,
        opacity: Math.random() * 0.8 + 0.2,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        life: 0,
        maxLife: canvas.height + 100
      };
    };

    const drawBackground = () => {
      // 春天的渐变背景
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#e8f5e8'); // 浅绿
      gradient.addColorStop(0.3, '#f1f8e9'); // 很浅绿
      gradient.addColorStop(0.7, '#fce4ec'); // 浅粉
      gradient.addColorStop(1, '#f3e5f5'); // 浅紫
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawCherryTree = () => {
      // 绘制樱花树的枝条
      const branches = [
        { startX: 0, startY: canvas.height * 0.8, endX: canvas.width * 0.3, endY: canvas.height * 0.2 },
        { startX: canvas.width, startY: canvas.height * 0.9, endX: canvas.width * 0.7, endY: canvas.height * 0.3 },
        { startX: canvas.width * 0.2, startY: 0, endX: canvas.width * 0.4, endY: canvas.height * 0.4 },
        { startX: canvas.width * 0.8, startY: 0, endX: canvas.width * 0.6, endY: canvas.height * 0.5 }
      ];

      ctx.strokeStyle = '#5d4037';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';

      branches.forEach(branch => {
        // 主枝条
        ctx.beginPath();
        ctx.moveTo(branch.startX, branch.startY);
        ctx.lineTo(branch.endX, branch.endY);
        ctx.stroke();

        // 小枝条
        const midX = (branch.startX + branch.endX) / 2;
        const midY = (branch.startY + branch.endY) / 2;
        
        ctx.lineWidth = 4;
        for (let i = 0; i < 3; i++) {
          const angle = Math.random() * Math.PI * 2;
          const length = 30 + Math.random() * 20;
          ctx.beginPath();
          ctx.moveTo(midX, midY);
          ctx.lineTo(
            midX + Math.cos(angle) * length,
            midY + Math.sin(angle) * length
          );
          ctx.stroke();
        }
        ctx.lineWidth = 8;
      });

      // 在枝条上绘制樱花
      branches.forEach(branch => {
        for (let i = 0; i < 15; i++) {
          const t = Math.random();
          const x = branch.startX + (branch.endX - branch.startX) * t;
          const y = branch.startY + (branch.endY - branch.startY) * t;
          
          drawCherry(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 40, Math.random() * 6 + 4);
        }
      });
    };

    const drawCherry = (x: number, y: number, size: number) => {
      ctx.save();
      ctx.translate(x, y);
      
      // 花瓣
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5;
        ctx.save();
        ctx.rotate(angle);
        
        ctx.fillStyle = '#ffb3d9';
        ctx.strokeStyle = '#ff80cc';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.ellipse(0, -size * 0.7, size * 0.5, size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
      }
      
      // 花心
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const drawPetal = (petal: Petal) => {
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.rotation);
      ctx.globalAlpha = petal.opacity;
      
      // 花瓣渐变
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, petal.size);
      gradient.addColorStop(0, petal.color);
      gradient.addColorStop(1, 'rgba(255, 179, 217, 0.3)');
      
      ctx.fillStyle = gradient;
      ctx.strokeStyle = '#ff80cc';
      ctx.lineWidth = 0.5;
      
      // 花瓣形状
      ctx.beginPath();
      ctx.ellipse(0, 0, petal.size * 0.6, petal.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // 花瓣纹理
      ctx.strokeStyle = 'rgba(255, 128, 204, 0.3)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -petal.size);
      ctx.lineTo(0, petal.size);
      ctx.stroke();
      
      ctx.restore();
    };

    const updatePetals = () => {
      // 移除超出屏幕的花瓣
      petalsRef.current = petalsRef.current.filter(petal => {
        petal.x += petal.vx + Math.sin(petal.life * 0.01) * 0.5;
        petal.y += petal.vy;
        petal.rotation += petal.rotationSpeed;
        petal.life++;
        
        // 重力和风力效果
        petal.vy += 0.02;
        petal.vx += (Math.random() - 0.5) * 0.02;
        
        return petal.y < canvas.height + 50 && petal.x > -50 && petal.x < canvas.width + 50;
      });
      
      // 添加新花瓣
      if (Math.random() < 0.1) {
        petalsRef.current.push(createPetal());
      }
    };

    const animate = () => {
      timeRef.current += 1;
      
      drawBackground();
      drawCherryTree();
      
      updatePetals();
      
      // 绘制所有花瓣
      petalsRef.current.forEach(drawPetal);
      
      // 添加风的粒子效果
      for (let i = 0; i < 5; i++) {
        const x = (timeRef.current * 2 + i * 100) % (canvas.width + 100);
        const y = canvas.height * 0.3 + Math.sin(timeRef.current * 0.02 + i) * 100;
        const alpha = 0.1 + Math.sin(timeRef.current * 0.03 + i) * 0.1;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // 初始化一些花瓣
    for (let i = 0; i < 20; i++) {
      const petal = createPetal();
      petal.y = Math.random() * canvas.height;
      petalsRef.current.push(petal);
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