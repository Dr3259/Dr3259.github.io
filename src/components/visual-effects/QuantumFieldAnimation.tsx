"use client";

import React, { useEffect, useRef } from 'react';

interface QuantumParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  energy: number;
  phase: number;
  entangled?: QuantumParticle;
  waveFunction: number;
  probability: number;
}

interface WaveField {
  amplitude: number;
  frequency: number;
  phase: number;
  wavelength: number;
}

export const QuantumFieldAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<QuantumParticle[]>([]);
  const fieldsRef = useRef<WaveField[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initializeQuantumField();
    };

    const initializeQuantumField = () => {
      particlesRef.current = [];
      fieldsRef.current = [];
      
      // 创建量子场
      for (let i = 0; i < 5; i++) {
        fieldsRef.current.push({
          amplitude: Math.random() * 50 + 20,
          frequency: Math.random() * 0.02 + 0.005,
          phase: Math.random() * Math.PI * 2,
          wavelength: Math.random() * 100 + 50
        });
      }
      
      // 创建量子粒子
      for (let i = 0; i < 150; i++) {
        const particle: QuantumParticle = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          energy: Math.random() * 100,
          phase: Math.random() * Math.PI * 2,
          waveFunction: 0,
          probability: Math.random()
        };
        particlesRef.current.push(particle);
      }
      
      // 创建量子纠缠对
      for (let i = 0; i < particlesRef.current.length; i += 2) {
        if (i + 1 < particlesRef.current.length) {
          particlesRef.current[i].entangled = particlesRef.current[i + 1];
          particlesRef.current[i + 1].entangled = particlesRef.current[i];
        }
      }
    };

    const drawBackground = () => {
      // 量子真空背景
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#000a1a');
      gradient.addColorStop(0.3, '#001122');
      gradient.addColorStop(0.7, '#000e1a');
      gradient.addColorStop(1, '#000000');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawQuantumField = () => {
      // 绘制量子场的波动
      fieldsRef.current.forEach((field, fieldIndex) => {
        const gridSize = 20;
        const cols = Math.ceil(canvas.width / gridSize);
        const rows = Math.ceil(canvas.height / gridSize);
        
        for (let x = 0; x < cols; x++) {
          for (let y = 0; y < rows; y++) {
            const posX = x * gridSize;
            const posY = y * gridSize;
            
            // 计算波函数
            const distance = Math.sqrt(
              Math.pow(posX - canvas.width / 2, 2) + 
              Math.pow(posY - canvas.height / 2, 2)
            );
            
            const wave = Math.sin(
              distance * field.frequency + 
              timeRef.current * 0.05 + 
              field.phase
            ) * field.amplitude;
            
            const intensity = (wave + field.amplitude) / (2 * field.amplitude);
            const alpha = intensity * 0.3;
            
            // 量子干涉图案
            const hue = (fieldIndex * 60 + timeRef.current * 0.5) % 360;
            ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;
            ctx.fillRect(posX, posY, gridSize, gridSize);
          }
        }
      });
    };

    const drawProbabilityWaves = () => {
      // 绘制概率波
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      for (let r = 20; r < Math.min(canvas.width, canvas.height) / 2; r += 30) {
        const points = Math.floor(r * 0.5);
        ctx.beginPath();
        
        for (let i = 0; i <= points; i++) {
          const angle = (Math.PI * 2 * i) / points;
          const waveOffset = Math.sin(r * 0.02 + timeRef.current * 0.03) * 10;
          const x = centerX + Math.cos(angle) * (r + waveOffset);
          const y = centerY + Math.sin(angle) * (r + waveOffset);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        const alpha = 1 / (r * 0.01);
        ctx.strokeStyle = `rgba(0, 255, 255, ${alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const updateQuantumParticles = () => {
      particlesRef.current.forEach(particle => {
        // 量子隧道效应
        if (Math.random() < 0.001) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
        }
        
        // 海森堡不确定性原理
        const uncertainty = particle.energy * 0.01;
        particle.vx += (Math.random() - 0.5) * uncertainty;
        particle.vy += (Math.random() - 0.5) * uncertainty;
        
        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // 边界处理（周期性边界条件）
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // 更新波函数
        particle.waveFunction = Math.sin(timeRef.current * 0.1 + particle.phase);
        particle.probability = Math.abs(particle.waveFunction);
        
        // 量子纠缠效应
        if (particle.entangled) {
          const entangledParticle = particle.entangled;
          // 纠缠粒子的反相关性
          entangledParticle.phase = particle.phase + Math.PI;
          entangledParticle.waveFunction = -particle.waveFunction;
        }
      });
    };

    const drawQuantumParticles = () => {
      particlesRef.current.forEach(particle => {
        ctx.save();
        
        // 根据概率密度调整透明度
        const alpha = particle.probability * 0.8;
        ctx.globalAlpha = alpha;
        
        // 粒子-波二象性
        const size = 3 + particle.energy * 0.05;
        const waveRadius = size * (1 + Math.abs(particle.waveFunction) * 2);
        
        // 波动性质
        const waveGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, waveRadius
        );
        
        const energyHue = (particle.energy * 3.6) % 360;
        waveGradient.addColorStop(0, `hsla(${energyHue}, 100%, 70%, 0.8)`);
        waveGradient.addColorStop(0.5, `hsla(${energyHue}, 100%, 50%, 0.4)`);
        waveGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = waveGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, waveRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // 粒子性质
        ctx.fillStyle = `hsla(${energyHue}, 100%, 80%, 1)`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsla(${energyHue}, 100%, 60%, 0.8)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
    };

    const drawQuantumEntanglement = () => {
      // 绘制量子纠缠连线
      particlesRef.current.forEach(particle => {
        if (particle.entangled) {
          const entangled = particle.entangled;
          const distance = Math.sqrt(
            Math.pow(particle.x - entangled.x, 2) + 
            Math.pow(particle.y - entangled.y, 2)
          );
          
          if (distance < 200) { // 只在近距离显示纠缠连线
            ctx.save();
            
            // 纠缠强度随距离衰减
            const strength = 1 - (distance / 200);
            const alpha = strength * 0.3;
            
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = '#ff00ff';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.lineDashOffset = timeRef.current * 0.1;
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(entangled.x, entangled.y);
            ctx.stroke();
            
            ctx.restore();
          }
        }
      });
    };

    const drawQuantumInterference = () => {
      // 双缝干涉图案
      const slitY = canvas.height / 2;
      const slit1X = canvas.width * 0.3;
      const slit2X = canvas.width * 0.7;
      const screenX = canvas.width * 0.9;
      
      for (let y = 0; y < canvas.height; y += 2) {
        const distance1 = Math.sqrt(Math.pow(screenX - slit1X, 2) + Math.pow(y - slitY, 2));
        const distance2 = Math.sqrt(Math.pow(screenX - slit2X, 2) + Math.pow(y - slitY, 2));
        
        const phase1 = distance1 * 0.05 + timeRef.current * 0.02;
        const phase2 = distance2 * 0.05 + timeRef.current * 0.02;
        
        const wave1 = Math.sin(phase1);
        const wave2 = Math.sin(phase2);
        const interference = wave1 + wave2;
        
        const intensity = Math.abs(interference) / 2;
        const alpha = intensity * 0.3;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(screenX - 5, y, 10, 2);
      }
    };

    const drawVirtualParticles = () => {
      // 虚粒子对产生和湮灭
      for (let i = 0; i < 10; i++) {
        if (Math.random() < 0.1) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const lifetime = 20;
          
          // 粒子对
          const size = 2;
          const separation = 10;
          
          ctx.save();
          ctx.globalAlpha = 0.4;
          
          // 正粒子
          ctx.fillStyle = '#00ff00';
          ctx.beginPath();
          ctx.arc(x - separation, y, size, 0, Math.PI * 2);
          ctx.fill();
          
          // 反粒子
          ctx.fillStyle = '#ff0000';
          ctx.beginPath();
          ctx.arc(x + separation, y, size, 0, Math.PI * 2);
          ctx.fill();
          
          // 湮灭闪光
          if (Math.random() < 0.05) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ffffff';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
          }
          
          ctx.restore();
        }
      }
    };

    const animate = () => {
      timeRef.current += 1;
      
      drawBackground();
      drawQuantumField();
      drawProbabilityWaves();
      updateQuantumParticles();
      drawQuantumParticles();
      drawQuantumEntanglement();
      drawQuantumInterference();
      drawVirtualParticles();
      
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