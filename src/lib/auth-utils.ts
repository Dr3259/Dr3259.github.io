// 认证工具函数
"use client";

import { auth } from './firebase';
import { User } from 'firebase/auth';

// 检查用户 token 是否即将过期并自动刷新
export const checkAndRefreshToken = async (user: User): Promise<void> => {
  try {
    // Firebase token 默认1小时过期，我们在还有10分钟时就刷新
    const tokenResult = await user.getIdTokenResult();
    const expirationTime = new Date(tokenResult.expirationTime);
    const now = new Date();
    const timeUntilExpiry = expirationTime.getTime() - now.getTime();
    const tenMinutes = 10 * 60 * 1000; // 10分钟

    if (timeUntilExpiry < tenMinutes) {
      console.log('Token 即将过期，正在刷新...');
      await user.getIdToken(true); // 强制刷新 token
      console.log('Token 刷新成功');
    }
  } catch (error: any) {
    if (error?.code === 'auth/network-request-failed') {
      return;
    }
    console.error('Token 刷新失败:', error);
  }
};

// 设置定期检查 token 的定时器
export const setupTokenRefreshTimer = (user: User): (() => void) => {
  // 每30分钟检查一次 token
  const interval = setInterval(() => {
    checkAndRefreshToken(user);
  }, 30 * 60 * 1000);

  // 返回清理函数
  return () => clearInterval(interval);
};

// 获取用户登录状态的详细信息
export const getUserLoginInfo = async (user: User) => {
  try {
    const tokenResult = await user.getIdTokenResult();
    return {
      email: user.email,
      uid: user.uid,
      tokenExpiry: new Date(tokenResult.expirationTime),
      issuedAt: new Date(tokenResult.issuedAtTime),
      signInProvider: tokenResult.signInProvider,
    };
  } catch (error) {
    console.error('获取用户登录信息失败:', error);
    return null;
  }
};
