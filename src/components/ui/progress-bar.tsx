"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

interface ProgressBarProps {
  height?: number;
  color?: string;
  showSpinner?: boolean;
  crawlSpeed?: number;
  speed?: number;
  easing?: string;
}

export function ProgressBar({
  height = 3,
  color = '#3b82f6', // blue-500
  showSpinner = false,
  crawlSpeed = 200,
  speed = 200,
  easing = 'ease'
}: ProgressBarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let completeTimer: NodeJS.Timeout;

    const startProgress = () => {
      setIsLoading(true);
      setProgress(0);
      
      // 模拟进度增长
      const incrementProgress = () => {
        setProgress(prev => {
          if (prev >= 90) return prev; // 在90%处停止，等待实际加载完成
          const increment = Math.random() * 15 + 5; // 5-20% 的随机增长
          return Math.min(prev + increment, 90);
        });
      };

      // 立即开始进度
      incrementProgress();
      
      // 持续增长进度
      progressTimer = setInterval(incrementProgress, crawlSpeed);
    };

    const completeProgress = () => {
      clearInterval(progressTimer);
      setProgress(100);
      
      // 完成后延迟隐藏
      completeTimer = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, speed);
    };

    // 监听路由变化
    const handleRouteChangeStart = () => startProgress();
    const handleRouteChangeComplete = () => completeProgress();

    // 由于 Next.js 13+ App Router 没有直接的路由事件，我们需要监听 pathname 变化
    let isFirstRender = true;
    
    if (!isFirstRender) {
      startProgress();
      // 模拟页面加载时间
      const loadingTime = Math.random() * 1000 + 500; // 500-1500ms
      setTimeout(completeProgress, loadingTime);
    }
    
    isFirstRender = false;

    return () => {
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [pathname, crawlSpeed, speed]);

  if (!isLoading) return null;

  return (
    <>
      <div
        className="fixed top-0 left-0 z-[9999] transition-all duration-200 ease-out"
        style={{
          height: `${height}px`,
          width: `${progress}%`,
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}, 0 0 5px ${color}`,
          transition: `width ${speed}ms ${easing}`
        }}
      />
      {showSpinner && (
        <div
          className="fixed top-0 right-4 z-[9999] flex items-center justify-center"
          style={{ height: `${height * 8}px` }}
        >
          <div
            className="animate-spin rounded-full border-2 border-t-transparent"
            style={{
              width: `${height * 4}px`,
              height: `${height * 4}px`,
              borderColor: `${color} transparent transparent transparent`
            }}
          />
        </div>
      )}
    </>
  );
}

// Hook for manual progress control
export function useProgressBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const start = () => {
    setIsLoading(true);
    setProgress(0);
  };

  const update = (value: number) => {
    setProgress(Math.min(Math.max(value, 0), 100));
  };

  const complete = () => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 200);
  };

  return {
    isLoading,
    progress,
    start,
    update,
    complete
  };
}