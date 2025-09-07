
"use client";

import React, { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { setupTokenRefreshTimer, getUserLoginInfo } from '@/lib/auth-utils';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const tokenRefreshCleanup = useRef<(() => void) | null>(null);

  useEffect(() => {
    // onAuthStateChanged 会自动检查持久化的登录状态
    // 如果用户之前登录过且 token 仍然有效，会自动恢复登录状态
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('认证状态变化:', user ? `用户已登录: ${user.email}` : '用户未登录');
      
      // 清理之前的 token 刷新定时器
      if (tokenRefreshCleanup.current) {
        tokenRefreshCleanup.current();
        tokenRefreshCleanup.current = null;
      }

      if (user) {
        // 获取并打印用户登录信息
        const loginInfo = await getUserLoginInfo(user);
        if (loginInfo) {
          console.log('用户登录信息:', {
            email: loginInfo.email,
            tokenExpiry: loginInfo.tokenExpiry.toLocaleString(),
            provider: loginInfo.signInProvider,
          });
        }

        // 设置 token 自动刷新
        tokenRefreshCleanup.current = setupTokenRefreshTimer(user);
      }

      setUser(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (tokenRefreshCleanup.current) {
        tokenRefreshCleanup.current();
      }
    };
  }, []);

  if (loading) {
      return (
          <div className="flex h-screen items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      )
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
