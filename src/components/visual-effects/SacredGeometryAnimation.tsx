"use client";

import React, { useEffect, useRef } from 'react';

interface SacredPattern {
  centerX: number;
  centerY: number;
  radius: number;
  rotation: number;
  rotationSpeed: number;
  complexity: number;
  color: string;
  pattern: 'flowerOfLife' | 'metatronsCube' | 'vesicaPiscis' | 'seedOfLife' | 'fibonacci' | 'goldenRatio';
}

interface GeometricNode {
  x: number;
  y: number;
  connections: GeometricNode[];
  energy: number;
  resonance: number;
  dimension: number;
}

export const SacredGeometryAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const patternsRef = useRef<SacredPattern[]>([]);
  const nodesRef = useRef<GeometricNode[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initializeSacredField();
    };

    const sacredColors = [
      '#ffd700', '#ff69b4', '#00ffff', '#ff4500',
      '#9370db', '#00ff7f', '#ff1493', '#00bfff',
      '#ffff00', '#ff6347', '#7fffd4', '#dda0dd'
    ];

    const initializeSacredField = () => {
      patternsRef.current = [];
      nodesRef.current = [];
      
      const patterns: SacredPattern['pattern'][] = [
        'flowerOfLife', 'metatronsCube', 'vesicaPiscis', 
        'seedOfLife', 'fibonacci', 'goldenRatio'
      ];
      
      // 创建主要神圣几何图案
      patternsRef.current.push({
        centerX: canvas.width / 2,
        centerY: canvas.height / 2,
        radius: Math.min(canvas.width, canvas.height) * 0.15,
        rotation: 0,
        rotationSpeed: 0.005,
        complexity: 1,
        color: '#ffd700',
        pattern: 'flowerOfLife'
      });
      
      // 创建周围的辅助图案
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        const distance = Math.min(canvas.width, canvas.height) * 0.25;
        const x = canvas.width / 2 + Math.cos(angle) * distance;
        const y = canvas.height / 2 + Math.sin(angle) * distance;
        
        patternsRef.current.push({
          centerX: x,
          centerY: y,
          radius: Math.min(canvas.width, canvas.height) * 0.08,
          rotation: angle,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
          complexity: 0.7,
          color: sacredColors[i % sacredColors.length],
          pattern: patterns[i % patterns.length]
        });
      }
      
      // 创建几何节点网络
      const nodeCount = 144; // 神圣数字
      for (let i = 0; i < nodeCount; i++) {
        const angle = (Math.PI * 2 * i) / nodeCount;
        const radius = Math.min(canvas.width, canvas.height) * 0.4;
        
        nodesRef.current.push({
          x: canvas.width / 2 + Math.cos(angle) * radius,
          y: canvas.height / 2 + Math.sin(angle) * radius,
          connections: [],
          energy: Math.random() * 100,
          resonance: Math.random() * 2 * Math.PI,
          dimension: i / nodeCount
        });
      }
      
      // 建立几何连接
      nodesRef.current.forEach((node, index) => {
        // 连接到黄金比例相关的节点
        const goldenRatio = 1.618033988749;
        const connections = [
          Math.floor(index * goldenRatio) % nodeCount,
          Math.floor(index / goldenRatio) % nodeCount,
          (index + Math.floor(nodeCount / goldenRatio)) % nodeCount,
          (index + Math.floor(nodeCount / 3)) % nodeCount,
          (index + Math.floor(nodeCount / 5)) % nodeCount
        ];
        
        connections.forEach(connIndex => {
          if (connIndex !== index) {
            node.connections.push(nodesRef.current[connIndex]);
          }
        });
      });
    };

    const drawBackground = () => {
      // 宇宙虚空背景
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, '#000033');
      gradient.addColorStop(0.3, '#000022');
      gradient.addColorStop(0.7, '#000011');
      gradient.addColorStop(1, '#000000');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 背景网格（阿卡西记录）
      const gridSize = 40;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawFlowerOfLife = (pattern: SacredPattern) => {
      ctx.save();
      ctx.translate(pattern.centerX, pattern.centerY);
      ctx.rotate(pattern.rotation);
      
      const circleRadius = pattern.radius * 0.6;
      const circles = [
        { x: 0, y: 0 },
        { x: circleRadius, y: 0 },
        { x: -circleRadius, y: 0 },
        { x: circleRadius / 2, y: circleRadius * Math.sqrt(3) / 2 },
        { x: circleRadius / 2, y: -circleRadius * Math.sqrt(3) / 2 },
        { x: -circleRadius / 2, y: circleRadius * Math.sqrt(3) / 2 },
        { x: -circleRadius / 2, y: -circleRadius * Math.sqrt(3) / 2 }
      ];
      
      // 外层扩展圆
      const outerCircles = [
        { x: circleRadius * 1.5, y: circleRadius * Math.sqrt(3) / 2 },
        { x: circleRadius * 1.5, y: -circleRadius * Math.sqrt(3) / 2 },
        { x: -circleRadius * 1.5, y: circleRadius * Math.sqrt(3) / 2 },
        { x: -circleRadius * 1.5, y: -circleRadius * Math.sqrt(3) / 2 },
        { x: 0, y: circleRadius * Math.sqrt(3) },
        { x: 0, y: -circleRadius * Math.sqrt(3) }
      ];
      
      const allCircles = [...circles, ...outerCircles];
      
      ctx.strokeStyle = pattern.color;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = pattern.color;
      
      allCircles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circleRadius * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      });
      
      ctx.restore();
    };

    const drawMetatronsCube = (pattern: SacredPattern) => {
      ctx.save();
      ctx.translate(pattern.centerX, pattern.centerY);
      ctx.rotate(pattern.rotation);
      
      const radius = pattern.radius * 0.8;
      const points: Array<{x: number, y: number}> = [];
      
      // 创建13个点（梅塔特隆立方体的基础）
      points.push({ x: 0, y: 0 }); // 中心点
      
      // 内六边形
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        points.push({
          x: Math.cos(angle) * radius * 0.4,
          y: Math.sin(angle) * radius * 0.4
        });
      }
      
      // 外六边形
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        points.push({
          x: Math.cos(angle) * radius * 0.8,
          y: Math.sin(angle) * radius * 0.8
        });
      }
      
      // 绘制连接线
      ctx.strokeStyle = pattern.color;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = pattern.color;
      
      // 从中心到所有点的连线
      points.slice(1).forEach(point => {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      });
      
      // 内六边形之间的连线
      for (let i = 1; i <= 6; i++) {
        for (let j = i + 1; j <= 6; j++) {
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
      
      // 外六边形之间的连线
      for (let i = 7; i <= 12; i++) {
        for (let j = i + 1; j <= 12; j++) {
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
      
      // 绘制节点
      ctx.fillStyle = pattern.color;
      points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.restore();
    };

    const drawFibonacciSpiral = (pattern: SacredPattern) => {
      ctx.save();
      ctx.translate(pattern.centerX, pattern.centerY);
      ctx.rotate(pattern.rotation);
      
      ctx.strokeStyle = pattern.color;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 12;
      ctx.shadowColor = pattern.color;
      
      // 斐波那契数列
      const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
      const scale = pattern.radius * 0.01;
      
      let x = 0, y = 0;
      let direction = 0; // 0: 右, 1: 上, 2: 左, 3: 下
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      
      fibonacci.forEach((fib, index) => {
        const size = fib * scale;
        
        // 根据方向绘制螺旋
        switch (direction % 4) {
          case 0: // 右
            ctx.arc(x + size, y, size, Math.PI, Math.PI * 1.5);
            x += size;
            break;
          case 1: // 上
            ctx.arc(x, y - size, size, Math.PI * 1.5, 0);
            y -= size;
            break;
          case 2: // 左
            ctx.arc(x - size, y, size, 0, Math.PI * 0.5);
            x -= size;
            break;
          case 3: // 下
            ctx.arc(x, y + size, size, Math.PI * 0.5, Math.PI);
            y += size;
            break;
        }
        
        direction++;
      });
      
      ctx.stroke();
      
      // 绘制黄金比例矩形
      ctx.strokeStyle = `${pattern.color}66`;
      ctx.lineWidth = 1;
      
      let rectX = 0, rectY = 0;
      direction = 0;
      
      fibonacci.forEach((fib, index) => {
        const size = fib * scale;
        
        ctx.strokeRect(rectX, rectY, size, size);
        
        switch (direction % 4) {
          case 0:
            rectX += size;
            break;
          case 1:
            rectY -= size;
            rectX -= size;
            break;
          case 2:
            rectX -= size;
            rectY -= size;
            break;
          case 3:
            rectY += size;
            break;
        }
        
        direction++;
      });
      
      ctx.restore();
    };

    const drawVesicaPiscis = (pattern: SacredPattern) => {
      ctx.save();
      ctx.translate(pattern.centerX, pattern.centerY);
      ctx.rotate(pattern.rotation);
      
      const radius = pattern.radius * 0.6;
      const offset = radius * 0.5;
      
      ctx.strokeStyle = pattern.color;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = pattern.color;
      
      // 两个交叉的圆
      ctx.beginPath();
      ctx.arc(-offset, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(offset, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // 中央交叉区域
      ctx.fillStyle = `${pattern.color}33`;
      ctx.beginPath();
      ctx.arc(-offset, 0, radius, -Math.PI / 3, Math.PI / 3);
      ctx.arc(offset, 0, radius, Math.PI * 2 / 3, Math.PI * 4 / 3);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    };

    const drawPattern = (pattern: SacredPattern) => {
      switch (pattern.pattern) {
        case 'flowerOfLife':
          drawFlowerOfLife(pattern);
          break;
        case 'metatronsCube':
          drawMetatronsCube(pattern);
          break;
        case 'fibonacci':
          drawFibonacciSpiral(pattern);
          break;
        case 'vesicaPiscis':
          drawVesicaPiscis(pattern);
          break;
        case 'seedOfLife':
          drawFlowerOfLife(pattern); // 简化版本
          break;
        case 'goldenRatio':
          drawFibonacciSpiral(pattern); // 使用斐波那契螺旋
          break;
      }
    };

    const drawGeometricNetwork = () => {
      nodesRef.current.forEach((node, index) => {
        // 更新节点能量
        node.energy = 50 + Math.sin(timeRef.current * 0.02 + node.dimension * Math.PI * 2) * 30;
        node.resonance += 0.01 + node.dimension * 0.005;
        
        // 绘制连接线
        node.connections.slice(0, 2).forEach(connectedNode => {
          const energy = (node.energy + connectedNode.energy) / 200;
          const alpha = energy * 0.2;
          
          ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          ctx.stroke();
        });
        
        // 绘制节点
        const size = 2 + (node.energy / 100) * 3;
        const alpha = 0.5 + Math.sin(node.resonance) * 0.3;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawCosmicSymbols = () => {
      const symbols = ['⚛', '☯', '🜔', '🜃', '🜂', '🜁', '🜀', '◉'];
      const time = timeRef.current * 0.01;
      
      symbols.forEach((symbol, index) => {
        const angle = (Math.PI * 2 * index) / symbols.length + time;
        const radius = Math.min(canvas.width, canvas.height) * 0.45;
        const x = canvas.width / 2 + Math.cos(angle) * radius;
        const y = canvas.height / 2 + Math.sin(angle) * radius;
        
        const alpha = 0.4 + Math.sin(time * 2 + index) * 0.2;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = sacredColors[index % sacredColors.length];
        ctx.shadowBlur = 20;
        ctx.shadowColor = sacredColors[index % sacredColors.length];
        ctx.font = '32px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbol, x, y);
        ctx.restore();
      });
    };

    const animate = () => {
      timeRef.current += 1;
      
      drawBackground();
      drawGeometricNetwork();
      
      // 更新和绘制图案
      patternsRef.current.forEach(pattern => {
        pattern.rotation += pattern.rotationSpeed;
        drawPattern(pattern);
      });
      
      drawCosmicSymbols();
      
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