"use client";

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface EnhancedNavigationProgressProps {
  height?: number;
  color?: string;
  showSpinner?: boolean;
  delay?: number;
  className?: string;
}

export function EnhancedNavigationProgress({
  height = 3,
  color = '#3b82f6',
  showSpinner = false,
  delay = 100,
  className = ''
}: EnhancedNavigationProgressProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 进度条动画控制
  const startProgress = useCallback(() => {
    setIsLoading(true);
    setProgress(0);

    // 快速到达30%
    setTimeout(() => setProgress(30), 50);
    
    // 模拟进度增长
    let currentProgress = 30;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 10 + 2; // 2-12% 增长
      if (currentProgress >= 85) {
        currentProgress = 85; // 在85%停止，等待实际完成
        clearInterval(progressInterval);
      }
      setProgress(currentProgress);
    }, 150);

    return progressInterval;
  }, []);

  const completeProgress = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 300);
  }, []);

  // 监听路由变化
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let startTimer: NodeJS.Timeout;
    let completeTimer: NodeJS.Timeout;

    const handleStart = () => {
      startTimer = setTimeout(() => {
        progressInterval = startProgress();
      }, delay);
    };

    const handleComplete = () => {
      clearTimeout(startTimer);
      clearInterval(progressInterval);
      completeTimer = setTimeout(completeProgress, Math.random() * 500 + 200);
    };

    // 开始进度
    handleStart();
    
    // 模拟完成
    const completeTimeout = setTimeout(handleComplete, Math.random() * 1200 + 400);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(completeTimer);
      clearTimeout(completeTimeout);
      clearInterval(progressInterval);
    };
  }, [pathname, searchParams, delay, startProgress, completeProgress]);

  // 监听链接点击事件
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href) {
        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);
        
        // 如果是内部链接且不是当前页面
        if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
          // 立即开始进度条
          setIsLoading(true);
          setProgress(10);
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  if (!isLoading) return null;

  return (
    <>
      {/* 主进度条 */}
      <div
        className={`fixed top-0 left-0 z-[9999] transition-all duration-300 ease-out ${className}`}
        style={{
          height: `${height}px`,
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc, ${color}88)`,
          boxShadow: `0 0 10px ${color}50, 0 0 20px ${color}30`,
          borderRadius: '0 3px 3px 0',
          opacity: progress > 0 ? 1 : 0
        }}
      />
      
      {/* 发光效果 */}
      <div
        className="fixed top-0 left-0 z-[9998] transition-all duration-300 ease-out"
        style={{
          height: `${height + 1}px`,
          width: `${progress * 0.8}%`,
          background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
          borderRadius: '0 3px 3px 0',
          opacity: progress > 20 ? 0.6 : 0
        }}
      />


    </>
  );
}

