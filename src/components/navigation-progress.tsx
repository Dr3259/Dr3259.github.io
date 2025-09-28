"use client";

import { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface NavigationProgressProps {
  height?: number;
  color?: string;
  showSpinner?: boolean;
  delay?: number;
}

function NavigationProgressContent({
  height = 3,
  color = '#3b82f6',
  showSpinner = false,
  delay = 100
}: NavigationProgressProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let startTimer: NodeJS.Timeout;
    let completeTimer: NodeJS.Timeout;

    const startProgress = () => {
      // 添加小延迟，避免快速导航时闪烁
      startTimer = setTimeout(() => {
        setIsLoading(true);
        setProgress(10);

        // 模拟进度增长
        let currentProgress = 10;
        progressTimer = setInterval(() => {
          currentProgress += Math.random() * 15 + 5; // 5-20% 增长
          if (currentProgress >= 90) {
            currentProgress = 90; // 在90%停止
            clearInterval(progressTimer);
          }
          setProgress(currentProgress);
        }, 100);
      }, delay);
    };

    const completeProgress = () => {
      clearTimeout(startTimer);
      clearInterval(progressTimer);
      
      if (isLoading) {
        setProgress(100);
        completeTimer = setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 200);
      }
    };

    // 开始加载
    startProgress();

    // 模拟页面加载完成
    const loadingDuration = Math.random() * 800 + 300; // 300-1100ms
    const completeTimeout = setTimeout(completeProgress, loadingDuration);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(completeTimeout);
      clearTimeout(completeTimer);
      clearInterval(progressTimer);
    };
  }, [pathname, searchParams, delay, isLoading]);

  if (!isLoading) return null;

  return (
    <>
      {/* 进度条 */}
      <div
        className="fixed top-0 left-0 z-[9999] transition-all duration-200 ease-out"
        style={{
          height: `${height}px`,
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          boxShadow: `0 0 10px ${color}40, 0 0 5px ${color}60`,
          borderRadius: '0 2px 2px 0'
        }}
      />
      
      {/* 可选的加载指示器 */}
      {showSpinner && (
        <div className="fixed top-4 right-4 z-[9999]">
          <div
            className="animate-spin rounded-full border-2 border-t-transparent"
            style={{
              width: '20px',
              height: '20px',
              borderColor: `${color} transparent transparent transparent`
            }}
          />
        </div>
      )}
    </>
  );
}

// 用于手动控制进度的 Hook
export function useNavigationProgress() {
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

export function NavigationProgress(props: NavigationProgressProps) {
  return (
    <Suspense fallback={null}>
      <NavigationProgressContent {...props} />
    </Suspense>
  );
}