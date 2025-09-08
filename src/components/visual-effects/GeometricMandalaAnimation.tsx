"use client";

import React, { useEffect, useRef } from 'react';

interface MandalaPattern {
  layers: number;
  rotation: number;
  scale: number;
  opacity: number;
  color: string;
}

export const GeometricMandalaAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
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

    const drawBackground = () => {
      // 深邃的宇宙背景
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, '#0a0a23');
      gradient.addColorStop(0.3, '#1a1a2e');
      gradient.addColorStop(0.7, '#16213e');
      gradient.addColorStop(1, '#000000');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawSacredCircle = (centerX: number, centerY: number, radius: number, segments: number, rotation: number, color: string, opacity: number) => {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;
      
      // 外圈光晕
      const glowGradient = ctx.createRadialGradient(0, 0, radius * 0.8, 0, 0, radius * 1.2);
      glowGradient.addColorStop(0, color);
      glowGradient.addColorStop(1, 'transparent');
      ctx.strokeStyle = glowGradient;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      // 内部几何图案
      const angleStep = (Math.PI * 2) / segments;
      
      for (let i = 0; i < segments; i++) {
        const angle1 = i * angleStep;
        const angle2 = (i + 2) * angleStep;
        
        const x1 = Math.cos(angle1) * radius;
        const y1 = Math.sin(angle1) * radius;
        const x2 = Math.cos(angle2) * radius;
        const y2 = Math.sin(angle2) * radius;
        
        // 连接线
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        // 节点
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x1, y1, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    };

    const drawFlowerOfLife = (centerX: number, centerY: number, radius: number, rotation: number) => {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      
      const circles = [
        { x: 0, y: 0 },
        { x: radius * 0.8, y: 0 },
        { x: -radius * 0.8, y: 0 },
        { x: radius * 0.4, y: radius * 0.7 },
        { x: radius * 0.4, y: -radius * 0.7 },
        { x: -radius * 0.4, y: radius * 0.7 },
        { x: -radius * 0.4, y: -radius * 0.7 }
      ];

      ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
      ctx.lineWidth = 2;
      
      circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, radius * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      });
      
      ctx.restore();
    };

    const drawMeridianLines = (centerX: number, centerY: number, maxRadius: number, time: number) => {
      const lines = 12;
      for (let i = 0; i < lines; i++) {
        const angle = (Math.PI * 2 * i) / lines + time * 0.01;
        const intensity = Math.sin(time * 0.02 + i * 0.5) * 0.5 + 0.5;
        
        ctx.strokeStyle = `rgba(100, 255, 218, ${intensity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * maxRadius,
          centerY + Math.sin(angle) * maxRadius
        );
        ctx.stroke();
      }
    };

    const drawPlatonicSolid = (centerX: number, centerY: number, size: number, rotation: number, sides: number) => {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      
      const angleStep = (Math.PI * 2) / sides;
      const points: Array<{x: number, y: number}> = [];
      
      for (let i = 0; i < sides; i++) {
        const angle = i * angleStep;
        points.push({
          x: Math.cos(angle) * size,
          y: Math.sin(angle) * size
        });
      }
      
      // 外边框
      ctx.strokeStyle = 'rgba(138, 43, 226, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.stroke();
      
      // 内部连接线
      ctx.strokeStyle = 'rgba(138, 43, 226, 0.4)';
      ctx.lineWidth = 1;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 2; j < points.length; j++) {
          if (j - i !== points.length - 1) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
      
      ctx.restore();
    };

    const animate = () => {
      timeRef.current += 1;
      const time = timeRef.current;
      
      drawBackground();
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
      
      // 绘制经络线
      drawMeridianLines(centerX, centerY, maxRadius * 1.2, time);
      
      // 主曼陀罗
      const mainRotation = time * 0.005;
      drawSacredCircle(centerX, centerY, maxRadius * 0.8, 12, mainRotation, 'rgba(0, 255, 255, 0.8)', 0.9);
      
      // 第二层
      const secondRotation = -time * 0.008;
      drawSacredCircle(centerX, centerY, maxRadius * 0.6, 8, secondRotation, 'rgba(255, 20, 147, 0.7)', 0.7);
      
      // 第三层
      const thirdRotation = time * 0.012;
      drawSacredCircle(centerX, centerY, maxRadius * 0.4, 6, thirdRotation, 'rgba(255, 215, 0, 0.6)', 0.6);
      
      // 生命之花
      drawFlowerOfLife(centerX, centerY, maxRadius * 0.25, time * 0.003);
      
      // 柏拉图立体
      drawPlatonicSolid(centerX, centerY, maxRadius * 0.15, time * 0.01, 5);
      
      // 周围的小曼陀罗
      const satellites = 6;
      for (let i = 0; i < satellites; i++) {
        const angle = (Math.PI * 2 * i) / satellites + time * 0.002;
        const distance = maxRadius * 1.3;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        if (x > 0 && x < canvas.width && y > 0 && y < canvas.height) {
          const rotation = -time * 0.015 + angle;
          const size = maxRadius * 0.15;
          drawSacredCircle(x, y, size, 6, rotation, 'rgba(147, 112, 219, 0.5)', 0.5);
        }
      }
      
      // 粒子效果
      for (let i = 0; i < 50; i++) {
        const particleAngle = (Math.PI * 2 * i) / 50 + time * 0.01;
        const particleRadius = maxRadius * 0.9 + Math.sin(time * 0.02 + i) * 20;
        const x = centerX + Math.cos(particleAngle) * particleRadius;
        const y = centerY + Math.sin(particleAngle) * particleRadius;
        const alpha = (Math.sin(time * 0.03 + i) + 1) * 0.25;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

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