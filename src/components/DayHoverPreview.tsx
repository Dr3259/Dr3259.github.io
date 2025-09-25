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

// 计算黄历相对于日期卡片的位置
const calculateCardCenterPosition = (cardPos?: { x: number; y: number; width: number; height: number }) => {
  if (!cardPos) {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }
  
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  const headerHeight = 80;
  const isFirstRow = cardPos.y < 300;
  const isMobile = viewport.width < 640;
  const previewWidth = Math.min(isMobile ? 360 : 520, viewport.width * 0.9);
  const previewHeight = Math.min(420, viewport.height * 0.75);
  const margin = isMobile ? 15 : 30;
  
  if (viewport.width < 480 || viewport.height < 600 || previewWidth > viewport.width * 0.8) {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }
  
  if (isFirstRow) {
    const totalAvailableHeight = viewport.height - headerHeight - margin * 2;
    const minRequiredSpace = previewHeight;
    
    if (totalAvailableHeight < minRequiredSpace) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }
  }
  
  let targetX = cardPos.x + cardPos.width + margin;
  let targetY = cardPos.y;
  
  if (targetX + previewWidth > viewport.width - margin) {
    targetX = cardPos.x - previewWidth - margin;
  }
  
  if (targetX < margin) {
    targetX = Math.max(margin, Math.min(viewport.width - previewWidth - margin, cardPos.x + cardPos.width / 2 - previewWidth / 2));
  }
  
  const maxY = viewport.height - previewHeight - margin;
  const minY = margin;
  
  if (isFirstRow) {
    const aboveY = cardPos.y - previewHeight - margin;
    const availableSpaceAbove = aboveY - headerHeight - margin;
    
    if (availableSpaceAbove >= 0 && aboveY >= headerHeight + margin) {
      targetY = aboveY;
    } else {
      const belowY = cardPos.y + cardPos.height + margin;
      const availableSpaceBelow = viewport.height - belowY - margin * 2;
      
      if (availableSpaceBelow >= previewHeight) {
        targetY = belowY;
      } else {
        const rightX = cardPos.x + cardPos.width + margin;
        const leftX = cardPos.x - previewWidth - margin;
        const preferredY = Math.max(headerHeight + margin, cardPos.y - previewHeight * 0.3);
        const safeMaxY = viewport.height - previewHeight - margin * 2;
        
        if (rightX + previewWidth <= viewport.width - margin) {
          targetX = rightX;
          targetY = Math.min(preferredY, safeMaxY);
        } else if (leftX >= margin) {
          targetX = leftX;
          targetY = Math.min(preferredY, safeMaxY);
        } else {
          return {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          };
        }
      }
    }
  } else {
    if (targetY + previewHeight > viewport.height - margin) {
      targetY = cardPos.y + cardPos.height - previewHeight;
      
      if (targetY < minY) {
        targetY = minY;
      } else if (targetY > maxY) {
        targetY = maxY;
      }
    }
  }
  
  targetX = Math.max(margin, Math.min(targetX, viewport.width - previewWidth - margin));
  
  if (isFirstRow) {
    const safeMinY = headerHeight + margin;
    const safeMaxY = viewport.height - previewHeight - margin * 2;
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
    setShouldShow(false);
    
    const timer = setTimeout(() => {
      const newPosition = calculateCardCenterPosition(cardPosition);
      setPosition(newPosition);
      setShouldShow(true);
    }, 10);
    
    return () => clearTimeout(timer);
  }, [cardPosition]);

  if (!shouldShow) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: 0.15,
          ease: "easeOut"
        }}
        className="fixed z-50 w-[480px] sm:w-[520px] max-w-[90vw] max-h-[80vh]"
        style={position}
        onMouseEnter={onMouseEnterPreview}
        onMouseLeave={onMouseLeavePreview}
        onClick={onClickPreview}
      >
        <Card 
          className="relative w-full bg-card/95 backdrop-blur-sm shadow-lg border-2 border-amber-200/60 dark:border-amber-900/60 overflow-hidden"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            background: `linear-gradient(135deg, hsla(40, 30%, 97%, 0.95) 0%, hsla(45, 25%, 95%, 0.98) 100%), hsl(var(--card))`,
            boxShadow: `0 20px 40px -10px rgba(212, 175, 55, 0.3), 0 0 0 1px rgba(255, 215, 0, 0.1)`
          } as React.CSSProperties}
        >
          {/* 简化的静态背景效果 - 移除所有动画以提升性能 */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            <div className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full bg-gradient-radial from-amber-300/40 to-transparent transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <CardContent className="relative p-4 z-10">
            {/* 顶部信息区域 - 以农历为主 */}
            <div className="text-center pb-3 relative">
              {/* 公历日期 - 辅助显示，右上角小字 */}
              <div className="absolute top-0 right-0 text-sm text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                {date.toLocaleDateString('zh-CN', { 
                  month: 'short', 
                  day: 'numeric'
                })}
              </div>
              
              {/* 农历日期 - 主要显示，传统书法风格 */}
              <div 
                className="text-4xl sm:text-5xl font-extrabold text-amber-800/90 dark:text-amber-200/90 tracking-wider mb-2 relative" 
                style={{ 
                  fontFamily: "'Noto Serif SC', 'Ma Shan Zheng', serif",
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div className="absolute -inset-2 border-2 border-amber-300/20 dark:border-amber-600/20 rounded-lg bg-gradient-to-br from-amber-50/30 to-yellow-50/30 dark:from-amber-900/20 dark:to-yellow-900/20 -z-10" />
                {huangliData.lunarDateStr}
              </div>
              
              {/* 干支和生肖信息 */}
              <div className="flex items-center justify-center gap-3 text-sm text-amber-700/80 dark:text-amber-300/80">
                <span className="font-medium">{huangliData.GanzhiDay.split(' ')[2]}</span>
                <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                <span>{huangliData.zodiac}</span>
              </div>
            </div>
            
            {/* 财神方位 - 横向紧凑显示 */}
            <div className="mb-3 p-2 bg-gradient-to-r from-amber-50/50 to-yellow-50/50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg border border-amber-200/30 dark:border-amber-800/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-yellow-200/20 to-transparent opacity-50" />
              <div className="relative z-10 text-center">
                <div className="text-sm font-bold text-amber-800/90 dark:text-amber-200/90 flex items-center justify-center gap-2">
                  <span className="text-lg">🧧</span>
                  财神方位: {huangliData.wealthDirection.direction}
                </div>
                <div className="text-xs text-amber-700/70 dark:text-amber-300/70 mt-1">
                  {huangliData.wealthDirection.description.replace('🧧 ', '')}
                </div>
              </div>
            </div>

            {/* 宜忌网格布局 - 左右并排 */}
            <div className="grid grid-cols-2 gap-3">
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
            </div>
            
            {/* 节气信息 - 如果有的话 */}
            {huangliData.term && (
              <div className="text-center pt-3 mt-2 border-t border-amber-200/30 dark:border-amber-800/30">
                <p className="text-xs text-muted-foreground">{huangliData.term}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};