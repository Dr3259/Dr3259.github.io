"use client";

import React, { useEffect, useRef } from 'react';

interface Crystal {
  x: number;
  y: number;
  z: number;
  size: number;
  growth: number;
  maxGrowth: number;
  rotation: number;
  rotationSpeed: number;
  type: 'cube' | 'octahedron' | 'tetrahedron' | 'icosahedron';
  color: string;
  faces: Array<{vertices: number[][], normal: number[]}>;
}

interface CrystalNode {
  x: number;
  y: number;
  z: number;
  energy: number;
  connections: CrystalNode[];
}

export const CrystalFormationAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const crystalsRef = useRef<Crystal[]>([]);
  const nodesRef = useRef<CrystalNode[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initializeCrystalField();
    };

    const crystalColors = [
      '#e3f2fd', '#f3e5f5', '#e8f5e8', '#fff3e0',
      '#00bcd4', '#9c27b0', '#4caf50', '#ff9800',
      '#81d4fa', '#ce93d8', '#a5d6a7', '#ffcc02'
    ];

    // 创建多面体顶点
    const createPolyhedronVertices = (type: Crystal['type']) => {
      switch (type) {
        case 'cube':
          return [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
          ];
        case 'octahedron':
          return [
            [1, 0, 0], [-1, 0, 0], [0, 1, 0],
            [0, -1, 0], [0, 0, 1], [0, 0, -1]
          ];
        case 'tetrahedron':
          return [
            [1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]
          ];
        case 'icosahedron':
          const phi = (1 + Math.sqrt(5)) / 2;
          return [
            [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
            [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
            [phi, 0, 1], [phi, 0, -1], [-phi, 0, 1], [-phi, 0, -1]
          ];
        default:
          return [[0, 0, 0]];
      }
    };

    const createCrystal = (x: number, y: number, z: number): Crystal => {
      const types: Crystal['type'][] = ['cube', 'octahedron', 'tetrahedron', 'icosahedron'];
      const type = types[Math.floor(Math.random() * types.length)];
      const vertices = createPolyhedronVertices(type);
      
      // 创建面
      const faces: Array<{vertices: number[][], normal: number[]}> = [];
      
      if (type === 'cube') {
        // 立方体的6个面
        const faceIndices = [
          [0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1],
          [2, 6, 7, 3], [0, 3, 7, 4], [1, 5, 6, 2]
        ];
        
        faceIndices.forEach(indices => {
          const faceVertices = indices.map(i => vertices[i]);
          faces.push({
            vertices: faceVertices,
            normal: [0, 0, 1] // 简化的法向量
          });
        });
      }
      
      return {
        x, y, z,
        size: Math.random() * 20 + 10,
        growth: 0,
        maxGrowth: Math.random() * 100 + 50,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        type,
        color: crystalColors[Math.floor(Math.random() * crystalColors.length)],
        faces
      };
    };

    const initializeCrystalField = () => {
      crystalsRef.current = [];
      nodesRef.current = [];
      
      // 创建晶体节点网络
      const gridSize = 80;
      for (let x = gridSize; x < canvas.width; x += gridSize) {
        for (let y = gridSize; y < canvas.height; y += gridSize) {
          if (Math.random() < 0.3) {
            const node: CrystalNode = {
              x: x + (Math.random() - 0.5) * 40,
              y: y + (Math.random() - 0.5) * 40,
              z: (Math.random() - 0.5) * 100,
              energy: Math.random() * 100,
              connections: []
            };
            nodesRef.current.push(node);
          }
        }
      }
      
      // 建立节点连接
      nodesRef.current.forEach(node => {
        nodesRef.current.forEach(otherNode => {
          if (node !== otherNode) {
            const distance = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) +
              Math.pow(node.y - otherNode.y, 2) +
              Math.pow(node.z - otherNode.z, 2)
            );
            
            if (distance < 120 && Math.random() < 0.4) {
              node.connections.push(otherNode);
            }
          }
        });
      });
      
      // 在节点位置创建晶体
      nodesRef.current.forEach(node => {
        if (Math.random() < 0.5) {
          crystalsRef.current.push(createCrystal(node.x, node.y, node.z));
        }
      });
    };

    const drawBackground = () => {
      // 晶体洞穴背景
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.5, '#16213e');
      gradient.addColorStop(1, '#0f0f23');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const project3D = (x: number, y: number, z: number) => {
      const perspective = 300;
      const scale = perspective / (perspective + z);
      return {
        x: x * scale + canvas.width / 2,
        y: y * scale + canvas.height / 2,
        scale
      };
    };

    const drawCrystalLattice = () => {
      // 绘制晶格结构
      nodesRef.current.forEach(node => {
        const nodeProj = project3D(node.x - canvas.width / 2, node.y - canvas.height / 2, node.z);
        
        // 绘制连接线
        node.connections.forEach(connectedNode => {
          const connProj = project3D(
            connectedNode.x - canvas.width / 2,
            connectedNode.y - canvas.height / 2,
            connectedNode.z
          );
          
          const energy = (node.energy + connectedNode.energy) / 200;
          const alpha = energy * 0.3;
          
          ctx.strokeStyle = `rgba(100, 255, 218, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodeProj.x, nodeProj.y);
          ctx.lineTo(connProj.x, connProj.y);
          ctx.stroke();
        });
        
        // 绘制节点
        const size = 2 * nodeProj.scale;
        const alpha = (node.energy / 100) * nodeProj.scale;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(nodeProj.x, nodeProj.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawCrystal = (crystal: Crystal) => {
      ctx.save();
      
      const centerProj = project3D(
        crystal.x - canvas.width / 2,
        crystal.y - canvas.height / 2,
        crystal.z
      );
      
      if (centerProj.scale <= 0) {
        ctx.restore();
        return;
      }
      
      ctx.translate(centerProj.x, centerProj.y);
      ctx.scale(centerProj.scale, centerProj.scale);
      
      const size = crystal.size * (crystal.growth / crystal.maxGrowth);
      const alpha = centerProj.scale * (crystal.growth / crystal.maxGrowth);
      
      if (alpha <= 0) {
        ctx.restore();
        return;
      }
      
      ctx.globalAlpha = alpha;
      
      // 绘制晶体的多个层次
      for (let layer = 0; layer < 3; layer++) {
        const layerSize = size * (1 - layer * 0.2);
        const layerAlpha = alpha * (1 - layer * 0.3);
        
        ctx.save();
        ctx.rotate(crystal.rotation + layer * 0.5);
        ctx.globalAlpha = layerAlpha;
        
        // 外发光
        const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, layerSize * 2);
        glowGradient.addColorStop(0, crystal.color);
        glowGradient.addColorStop(0.5, crystal.color.replace(')', ', 0.5)').replace('rgb', 'rgba'));
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(0, 0, layerSize * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 晶体主体
        ctx.fillStyle = crystal.color;
        ctx.strokeStyle = crystal.color.replace(')', ', 0.8)').replace('rgb', 'rgba');
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = crystal.color;
        
        switch (crystal.type) {
          case 'cube':
            ctx.fillRect(-layerSize / 2, -layerSize / 2, layerSize, layerSize);
            ctx.strokeRect(-layerSize / 2, -layerSize / 2, layerSize, layerSize);
            break;
          case 'octahedron':
            ctx.beginPath();
            ctx.moveTo(0, -layerSize);
            ctx.lineTo(layerSize * 0.7, 0);
            ctx.lineTo(0, layerSize);
            ctx.lineTo(-layerSize * 0.7, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
          case 'tetrahedron':
            ctx.beginPath();
            ctx.moveTo(0, -layerSize * 0.8);
            ctx.lineTo(layerSize * 0.7, layerSize * 0.4);
            ctx.lineTo(-layerSize * 0.7, layerSize * 0.4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
          case 'icosahedron':
            // 简化的二十面体
            for (let i = 0; i < 5; i++) {
              const angle = (Math.PI * 2 * i) / 5;
              const x = Math.cos(angle) * layerSize * 0.6;
              const y = Math.sin(angle) * layerSize * 0.6;
              
              ctx.beginPath();
              ctx.arc(x, y, layerSize * 0.2, 0, Math.PI * 2);
              ctx.fill();
            }
            break;
        }
        
        // 内部几何图案
        if (layer === 0) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 1;
          
          // 绘制内部连接线
          const points = 6;
          for (let i = 0; i < points; i++) {
            const angle1 = (Math.PI * 2 * i) / points;
            const angle2 = (Math.PI * 2 * (i + 2)) / points;
            
            ctx.beginPath();
            ctx.moveTo(
              Math.cos(angle1) * layerSize * 0.3,
              Math.sin(angle1) * layerSize * 0.3
            );
            ctx.lineTo(
              Math.cos(angle2) * layerSize * 0.3,
              Math.sin(angle2) * layerSize * 0.3
            );
            ctx.stroke();
          }
        }
        
        ctx.restore();
      }
      
      ctx.restore();
    };

    const updateCrystals = () => {
      crystalsRef.current.forEach(crystal => {
        // 晶体生长
        if (crystal.growth < crystal.maxGrowth) {
          crystal.growth += 0.5;
        }
        
        // 旋转
        crystal.rotation += crystal.rotationSpeed;
        
        // Z轴波动
        crystal.z += Math.sin(timeRef.current * 0.01 + crystal.x * 0.001) * 0.5;
      });
      
      // 节点能量变化
      nodesRef.current.forEach(node => {
        node.energy = 50 + Math.sin(timeRef.current * 0.02 + node.x * 0.01) * 30;
      });
      
      // 随机生成新晶体
      if (Math.random() < 0.005 && crystalsRef.current.length < 50) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const z = (Math.random() - 0.5) * 200;
        crystalsRef.current.push(createCrystal(x, y, z));
      }
    };

    const drawEnergyField = () => {
      // 绘制能量场
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          let totalEnergy = 0;
          let count = 0;
          
          nodesRef.current.forEach(node => {
            const distance = Math.sqrt(
              Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2)
            );
            
            if (distance < 100) {
              totalEnergy += node.energy / (distance + 1);
              count++;
            }
          });
          
          if (count > 0) {
            const avgEnergy = totalEnergy / count;
            const intensity = Math.min(avgEnergy / 50, 1);
            const alpha = intensity * 0.1;
            
            ctx.fillStyle = `rgba(147, 112, 219, ${alpha})`;
            ctx.fillRect(x, y, gridSize, gridSize);
          }
        }
      }
    };

    const animate = () => {
      timeRef.current += 1;
      
      drawBackground();
      drawEnergyField();
      drawCrystalLattice();
      updateCrystals();
      
      // 按Z深度排序并绘制晶体
      const sortedCrystals = [...crystalsRef.current].sort((a, b) => b.z - a.z);
      sortedCrystals.forEach(drawCrystal);
      
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