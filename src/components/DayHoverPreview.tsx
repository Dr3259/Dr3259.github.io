
"use client";

import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getHuangliData, type HuangliData } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DayHoverPreviewProps {
  date: Date;
  onMouseEnterPreview?: () => void;
  onMouseLeavePreview?: () => void;
  onClickPreview?: () => void;
  cardPosition?: { x: number; y: number; width: number; height: number };
}

// 极光效果组件 - 符合用户对极光效果的高要求
const AuroraEffect: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    let time = 0;
    const waves: Array<{
      amplitude: number;
      frequency: number;
      speed: number;
      color: string;
      opacity: number;
    }> = [
      { amplitude: 30, frequency: 0.02, speed: 0.01, color: '255, 215, 0', opacity: 0.1 },
      { amplitude: 25, frequency: 0.015, speed: 0.008, color: '255, 193, 7', opacity: 0.08 },
      { amplitude: 20, frequency: 0.025, speed: 0.012, color: '255, 235, 59', opacity: 0.06 },
    ];
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;
      
      waves.forEach((wave, index) => {
        ctx.beginPath();
        
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, `rgba(${wave.color}, ${wave.opacity})`);
        gradient.addColorStop(0.5, `rgba(${wave.color}, ${wave.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${wave.color}, 0)`);
        
        ctx.fillStyle = gradient;
        
        for (let x = 0; x <= canvas.width; x += 2) {
          const y = canvas.height * 0.3 + 
                   Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
                   Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 1.5) * wave.amplitude * 0.5;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-40"
      style={{ width: '100%', height: '100%' }}
    />
  );
};
const ParticleEffect: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
    }> = [];
    
    // 创建粒子
    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: 1,
        maxLife: Math.random() * 100 + 50,
        color: `hsla(${45 + Math.random() * 30}, 70%, ${60 + Math.random() * 20}%, 0.6)`
      };
    };
    
    // 初始化粒子
    for (let i = 0; i < 15; i++) {
      particles.push(createParticle());
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 1;
        
        const alpha = particle.life / particle.maxLife;
        ctx.fillStyle = particle.color.replace('0.6', String(alpha * 0.6));
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 重生粒子
        if (particle.life <= 0) {
          particles[index] = createParticle();
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-30"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

// 计算黄历相对于日期卡片的位置
const calculateCardCenterPosition = (cardPos?: { x: number; y: number; width: number; height: number }) => {
  if (!cardPos) {
    // 后备方案：屏幕正中央
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }
  
  // 获取视窗尺寸
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  // 检查是否是第一行（考虑页面头部和导航栏的高度）
  const headerHeight = 80; // 增加头部高度估算以避免被顶部遮挡
  const isFirstRow = cardPos.y < 300; // 简化第一行判断
  
  // 响应式尺寸计算 - 为新布局调整
  const isMobile = viewport.width < 640; // sm breakpoint
  const previewWidth = Math.min(isMobile ? 360 : 520, viewport.width * 0.9); // 增加宽度以适应网格布局
  const previewHeight = Math.min(420, viewport.height * 0.75); // 减少高度，因为去除了滚动
  const margin = isMobile ? 15 : 30; // 增加边距以提供更多缓冲区
  
  // 如果是非常小的屏幕或黄历卡片太大，强制使用居中模式
  if (viewport.width < 480 || viewport.height < 600 || previewWidth > viewport.width * 0.8) {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }
  
  // 对于第一行，如果整体可用空间不够显示完整黄历，直接居中
  if (isFirstRow) {
    const totalAvailableHeight = viewport.height - headerHeight - margin * 2;
    const minRequiredSpace = previewHeight; // 需要完整的黄历高度
    
    if (totalAvailableHeight < minRequiredSpace) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }
  }
  
  // 计算最佳显示位置
  let targetX = cardPos.x + cardPos.width + margin; // 默认显示在卡片右侧
  let targetY = cardPos.y;
  
  // 如果右侧空间不够，显示在左侧
  if (targetX + previewWidth > viewport.width - margin) {
    targetX = cardPos.x - previewWidth - margin;
  }
  
  // 如果左侧也不够，居中显示
  if (targetX < margin) {
    targetX = Math.max(margin, Math.min(viewport.width - previewWidth - margin, cardPos.x + cardPos.width / 2 - previewWidth / 2));
  }
  
  // 垂直位置调整 - 特别处理第一行的情况
  const maxY = viewport.height - previewHeight - margin;
  const minY = margin;
  
  if (isFirstRow) {
    // 第一行：优先尝试上方显示，如果上方空间不够再考虑其他位置
    const aboveY = cardPos.y - previewHeight - margin;
    const availableSpaceAbove = aboveY - headerHeight - margin; // 检查上方可用空间
    
    if (availableSpaceAbove >= 0 && aboveY >= headerHeight + margin) {
      // 上方有足够空间，直接显示在上方
      targetY = aboveY;
    } else {
      // 上方空间不够，尝试下方
      const belowY = cardPos.y + cardPos.height + margin;
      const availableSpaceBelow = viewport.height - belowY - margin * 2;
      
      if (availableSpaceBelow >= previewHeight) {
        // 下方有完全足够的空间
        targetY = belowY;
      } else {
        // 上下都不够，尝试侧边显示，但位置要尽量往上
        const rightX = cardPos.x + cardPos.width + margin;
        const leftX = cardPos.x - previewWidth - margin;
        
        // 侧边显示时，优先使用较高的位置，确保不被底部遮挡
        const preferredY = Math.max(
          headerHeight + margin,
          cardPos.y - previewHeight * 0.3 // 让黄历的上部分与卡片对齐
        );
        const safeMaxY = viewport.height - previewHeight - margin * 2;
        
        if (rightX + previewWidth <= viewport.width - margin) {
          // 右侧有空间
          targetX = rightX;
          targetY = Math.min(preferredY, safeMaxY);
        } else if (leftX >= margin) {
          // 左侧有空间
          targetX = leftX;
          targetY = Math.min(preferredY, safeMaxY);
        } else {
          // 左右都不行，强制居中以确保完整显示
          return {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          };
        }
      }
    }
  } else {
    // 非第一行：优先尝试与卡片顶部对齐
    if (targetY + previewHeight > viewport.height - margin) {
      // 如果底部超出，尝试与卡片底部对齐
      targetY = cardPos.y + cardPos.height - previewHeight;
      
      // 如果还是超出，强制在安全范围内
      if (targetY < minY) {
        targetY = minY;
      } else if (targetY > maxY) {
        targetY = maxY;
      }
    }
  }
  
  // 最终安全检查 - 确保黄历完整显示在可视区域内
  targetX = Math.max(margin, Math.min(targetX, viewport.width - previewWidth - margin));
  
  if (isFirstRow) {
    // 第一行：简单的上下边界检查
    const safeMinY = headerHeight + margin;
    const safeMaxY = viewport.height - previewHeight - margin * 2;
    
    // 确保在安全范围内
    targetY = Math.max(safeMinY, Math.min(targetY, safeMaxY));
  } else {
    targetY = Math.max(minY, Math.min(targetY, maxY));
  }
  
  return {
    top: `${targetY}px`,
    left: `${targetX}px`,
    transform: 'none'
  };
};
const YiJiList: FC<{ title: string; items: Array<{ name: string; description: string }>; className?: string }> = ({ title, items, className }) => (
  <div>
    <div className="flex items-center justify-center mb-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border shadow-inner">
        <span className="text-xl font-serif">{title}</span>
      </div>
    </div>
    <div className="space-y-2 sm:space-y-3">
      {items.map((item, index) => (
        <div key={index} className="group cursor-help border border-amber-100/50 dark:border-amber-900/30 rounded-lg p-2 sm:p-3 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-colors">
          <div className="text-center text-sm font-medium text-amber-800/90 dark:text-amber-200/90 mb-1 sm:mb-2">
            {item.name}
          </div>
          <div className="text-xs text-amber-700/70 dark:text-amber-300/70 text-center leading-relaxed">
            {item.description}
          </div>
        </div>
      ))}
    </div>
  </div>
);


export const DayHoverPreview: FC<DayHoverPreviewProps> = ({
  date,
  onMouseEnterPreview,
  onMouseLeavePreview,
  onClickPreview,
  cardPosition,
}) => {
  const huangliData = getHuangliData(date);
  const day = date.getDate();
  const [position, setPosition] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
  const [isMobile, setIsMobile] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // 当cardPosition变化时，先隐藏黄历，计算位置，然后显示
    setShouldShow(false);
    
    // 稍微延迟以确保位置计算完成
    const timer = setTimeout(() => {
      const newPosition = calculateCardCenterPosition(cardPosition);
      setPosition(newPosition);
      setShouldShow(true);
    }, 10); // 非常短的延迟，只为了确保位置计算完成
    
    return () => clearTimeout(timer);
  }, [cardPosition]);

  // 如果还不应该显示，返回null避免闪烁
  if (!shouldShow) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ 
          opacity: 0, 
          scale: 0.95, 
          y: 10
        }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0
        }}
        exit={{ 
          opacity: 0, 
          scale: 0.98,
          y: -5
        }}
        transition={{ 
          type: "spring",
          damping: 25,
          stiffness: 300,
          duration: 0.4
        }}
        className="fixed z-50 w-[480px] sm:w-[520px] max-w-[90vw] max-h-[80vh]"
        style={position}
        onMouseEnter={onMouseEnterPreview}
        onMouseLeave={onMouseLeavePreview}
        onClick={onClickPreview}
      >
        <Card 
          className="relative w-full bg-card/95 backdrop-blur-xl shadow-2xl border-2 border-amber-200/80 dark:border-amber-900/80 overflow-hidden"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            background: `
              radial-gradient(circle at 50% 30%, hsla(45, 95%, 88%, 0.5) 0%, transparent 70%),
              radial-gradient(circle at 30% 70%, hsla(35, 85%, 92%, 0.4) 0%, transparent 60%),
              radial-gradient(circle at 70% 20%, hsla(50, 90%, 85%, 0.3) 0%, transparent 80%),
              linear-gradient(135deg, hsla(40, 30%, 97%, 0.95) 0%, hsla(45, 25%, 95%, 0.98) 100%),
              hsl(var(--card))
            `,
            boxShadow: `
              0 40px 80px -15px rgba(212, 175, 55, 0.6),
              0 0 0 1px rgba(255, 215, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.3),
              0 0 60px rgba(255, 215, 0, 0.25),
              0 0 100px rgba(255, 193, 7, 0.1)
            `,
          } as React.CSSProperties}
        >
          {/* 极光效果背景 */}
          <AuroraEffect />
          
          {/* 粒子效果背景 */}
          <ParticleEffect />
          
          {/* 更加神秘的中心绾放光晕效果 */}
          <div className="absolute inset-0 opacity-30">
            {/* 中心主光晕 - 简化动画 */}
            <motion.div 
              className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full bg-gradient-radial from-amber-300/50 to-transparent"
              style={{ marginTop: '-5rem', marginLeft: '-5rem' }}
              animate={{ 
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* 外层辐射光晕 - 仅保留缓慢旋转 */}
            <motion.div 
              className="absolute top-1/2 left-1/2 w-56 h-56 rounded-full bg-gradient-radial from-yellow-200/30 to-transparent"
              style={{ marginTop: '-7rem', marginLeft: '-7rem' }}
              animate={{ 
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 40, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
            
            {/* 角落点缀光晕 - 简化动画 */}
            <motion.div 
              className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-radial from-amber-400/40 to-transparent"
              animate={{ 
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            
            <motion.div 
              className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-gradient-radial from-yellow-300/30 to-transparent"
              animate={{ 
                opacity: [0.15, 0.3, 0.15]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />
          </div>
            <CardContent className="relative p-4 z-10">
                {/* 顶部信息区域 - 以农历为主 */}
                <div className="text-center pb-3 relative">
                  {/* 公历日期 - 辅助显示，右上角小字 */}
                  <motion.div 
                    className="absolute top-0 right-0 text-sm text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.25, ease: "easeOut" }}
                  >
                    {date.toLocaleDateString('zh-CN', { 
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </motion.div>
                  
                  {/* 农历日期 - 主要显示，传统书法风格 */}
                  <motion.div 
                    className="text-4xl sm:text-5xl font-extrabold text-amber-800/90 dark:text-amber-200/90 tracking-wider mb-2 relative" 
                    style={{ 
                      fontFamily: "'Noto Serif SC', 'Ma Shan Zheng', serif",
                      textShadow: '2px 2px 4px rgba(0,0,0,0.1), 0 0 20px rgba(255,215,0,0.3)'
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
                  >
                    {/* 添加传统装饰边框 */}
                    <div className="absolute -inset-2 border-2 border-amber-300/20 dark:border-amber-600/20 rounded-lg bg-gradient-to-br from-amber-50/30 to-yellow-50/30 dark:from-amber-900/20 dark:to-yellow-900/20 -z-10" />
                    {huangliData.lunarDateStr}
                  </motion.div>
                  
                  {/* 干支和生肖信息 */}
                  <motion.div className="flex items-center justify-center gap-3 text-sm text-amber-700/80 dark:text-amber-300/80"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
                  >
                    <span className="font-medium">{huangliData.GanzhiDay.split(' ')[2]}</span>
                    <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                    <span>{huangliData.zodiac}</span>
                  </motion.div>
                </div>
                
                {/* 财神方位 - 横向紧凑显示 */}
                <motion.div 
                  className="mb-3 p-2 bg-gradient-to-r from-amber-50/50 to-yellow-50/50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg border border-amber-200/30 dark:border-amber-800/30 relative overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.3, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-radial from-yellow-200/20 to-transparent opacity-50" />
                  <div className="relative z-10 text-center">
                    <div className="text-sm font-bold text-amber-800/90 dark:text-amber-200/90 flex items-center justify-center gap-2">
                      <motion.span 
                        className="text-lg"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        🧧
                      </motion.span>
                      财神方位: {huangliData.wealthDirection.direction}
                    </div>
                    <div className="text-xs text-amber-700/70 dark:text-amber-300/70 mt-1">
                      {huangliData.wealthDirection.description.replace('🧧 ', '')}
                    </div>
                  </div>
                </motion.div>

                {/* 宜忌网格布局 - 左右并排 */}
                <motion.div 
                  className="grid grid-cols-2 gap-3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.35, ease: "easeOut" }}
                >
                  {/* 宜事项 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                        <span className="text-sm font-serif text-green-700 dark:text-green-300">宜</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {huangliData.good.map((item, index) => (
                        <div key={index} className="text-center p-1.5 border border-green-100/50 dark:border-green-900/30 rounded bg-green-50/30 dark:bg-green-900/10">
                          <div className="text-xs font-medium text-green-800/90 dark:text-green-200/90">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-green-700/70 dark:text-green-300/70 leading-tight mt-0.5">
                            {item.description.replace(/^[🎆💒🏢🌿🙏🔥✈️👶🔨🏗️⚖️🛏️⚕️💰🏦🚚💸🏠]+\s*/, '')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 忌事项 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                        <span className="text-sm font-serif text-red-700 dark:text-red-300">忌</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {huangliData.bad.map((item, index) => (
                        <div key={index} className="text-center p-1.5 border border-red-100/50 dark:border-red-900/30 rounded bg-red-50/30 dark:bg-red-900/10">
                          <div className="text-xs font-medium text-red-800/90 dark:text-red-200/90">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-red-700/70 dark:text-red-300/70 leading-tight mt-0.5">
                            {item.description.replace(/^[⛔⚠️🌿🙏]+\s*/, '')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                {/* 节气信息 - 如果有的话 */}
                {huangliData.term && (
                  <motion.div 
                    className="text-center pt-3 mt-2 border-t border-amber-200/30 dark:border-amber-800/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <p className="text-xs text-muted-foreground">{huangliData.term}</p>
                  </motion.div>
                )}
            </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
