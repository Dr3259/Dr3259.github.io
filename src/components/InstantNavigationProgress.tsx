'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function InstantNavigationProgress() {
  const [isLoading, setIsLoading] = useState(true); // 初始为 true，显示页面加载进度条
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);
  const currentPathRef = useRef(pathname);

  // 页面初始化加载进度条
  useEffect(() => {
    // 模拟页面初始加载进度
    let currentProgress = 0;
    const initialInterval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5;
      if (currentProgress >= 90) {
        currentProgress = 90;
        clearInterval(initialInterval);
        
        // 等待页面完全加载后完成进度条
        setTimeout(() => {
          setProgress(100);
          setTimeout(() => {
            setIsLoading(false);
            setProgress(0);
          }, 300);
        }, 200);
      }
      setProgress(currentProgress);
    }, 100);

    return () => {
      clearInterval(initialInterval);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // 监听路径变化，使用更可靠的完成机制
  useEffect(() => {
    // 如果路径发生了变化，说明导航完成
    if (currentPathRef.current !== pathname) {
      currentPathRef.current = pathname;
      
      if (isNavigatingRef.current) {
        // 路径已经变化，等待页面渲染完成
        const completeProgress = () => {
          // 清理进度条动画
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          
          // 完成进度条
          setProgress(100);
          setTimeout(() => {
            setIsLoading(false);
            setProgress(0);
            isNavigatingRef.current = false;
          }, 300);
        };

        // 使用 requestAnimationFrame 确保页面已经开始渲染
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // 再等待一个短暂的时间确保组件完全渲染
            setTimeout(completeProgress, 100);
          });
        });
      }
    }
  }, [pathname]);

  // 拦截 Next.js 路由跳转
  useEffect(() => {
    // 保存原始的 router.push 和 router.replace 方法
    const originalPush = router.push;
    const originalReplace = router.replace;

    // 重写 router.push
    router.push = function(href: string, options?: any) {
      // 标记正在导航
      isNavigatingRef.current = true;
      
      // 立即开始进度条
      setIsLoading(true);
      setProgress(20);
      
      // 清理之前的动画
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      // 模拟进度增长，但不要到达100%
      let currentProgress = 20;
      progressIntervalRef.current = setInterval(() => {
        currentProgress += Math.random() * 8 + 2;
        if (currentProgress >= 90) {
          currentProgress = 90;
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
        }
        setProgress(currentProgress);
      }, 200);
      
      // 调用原始方法
      return originalPush.call(this, href, options);
    };

    // 重写 router.replace
    router.replace = function(href: string, options?: any) {
      // 标记正在导航
      isNavigatingRef.current = true;
      
      // 立即开始进度条
      setIsLoading(true);
      setProgress(20);
      
      // 清理之前的动画
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      // 模拟进度增长，但不要到达100%
      let currentProgress = 20;
      progressIntervalRef.current = setInterval(() => {
        currentProgress += Math.random() * 8 + 2;
        if (currentProgress >= 90) {
          currentProgress = 90;
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
        }
        setProgress(currentProgress);
      }, 200);
      
      // 调用原始方法
      return originalReplace.call(this, href, options);
    };

    // 清理函数
    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [router]);

  // 同时保留点击事件监听作为备用方案
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href) {
        try {
          const url = new URL(link.href);
          const currentUrl = new URL(window.location.href);
          
          if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
            if (!isLoading) {
              // 标记正在导航
              isNavigatingRef.current = true;
              
              setIsLoading(true);
              setProgress(20);
              
              if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
              }
              
              let currentProgress = 20;
              progressIntervalRef.current = setInterval(() => {
                currentProgress += Math.random() * 8 + 2;
                if (currentProgress >= 90) {
                  currentProgress = 90;
                  if (progressIntervalRef.current) {
                    clearInterval(progressIntervalRef.current);
                    progressIntervalRef.current = null;
                  }
                }
                setProgress(currentProgress);
              }, 200);
            }
          }
        } catch (error) {
          // 忽略错误
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <>
      {/* 进度条 */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-gray-200/30">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
      
      {/* 全局加载遮罩层 - 阻止用户交互 */}
      <div 
        className="fixed inset-0 z-[9998] bg-transparent cursor-wait"
        style={{
          pointerEvents: 'all', // 拦截所有鼠标事件
        }}
        onClick={(e) => e.preventDefault()}
        onMouseOver={(e) => e.preventDefault()}
        onMouseEnter={(e) => e.preventDefault()}
        onMouseLeave={(e) => e.preventDefault()}
      />
    </>
  );
}