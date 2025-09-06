
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

const translations = {
  'zh-CN': {
    backButton: '返回主页',
    loginTitle: '登录',
    loginDescription: '欢迎回来！请输入您的凭证。',
    registerTitle: '注册',
    registerDescription: '创建一个新账户以开始使用。',
    emailLabel: '邮箱地址',
    emailPlaceholder: 'you@example.com',
    passwordLabel: '密码',
    passwordPlaceholder: '••••••••',
    loginButton: '登录',
    registerButton: '注册',
    loading: '处理中...',
    error: '出错了',
    error_user_not_found: '用户不存在或密码错误。',
    error_wrong_password: '用户不存在或密码错误。',
    error_email_already_in_use: '该邮箱地址已被注册。',
    error_weak_password: '密码应至少包含6个字符。',
    error_invalid_email: '请输入有效的邮箱地址。',
    error_unknown: '发生未知错误，请稍后重试。'
  },
  'en': {
    backButton: 'Back to Home',
    loginTitle: 'Login',
    loginDescription: 'Welcome back! Please enter your credentials.',
    registerTitle: 'Register',
    registerDescription: 'Create a new account to get started.',
    emailLabel: 'Email Address',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    loginButton: 'Log In',
    registerButton: 'Register',
    loading: 'Processing...',
    error: 'An error occurred',
    error_user_not_found: 'User not found or password incorrect.',
    error_wrong_password: 'User not found or password incorrect.',
    error_email_already_in_use: 'This email is already registered.',
    error_weak_password: 'Password should be at least 6 characters.',
    error_invalid_email: 'Please enter a valid email address.',
    error_unknown: 'An unknown error occurred. Please try again later.'
  }
};

type LanguageKey = keyof typeof translations;

const getFriendlyErrorMessage = (t: any, errorCode: string) => {
    switch (errorCode) {
        case 'auth/user-not-found': return t.error_user_not_found;
        case 'auth/wrong-password': return t.error_wrong_password;
        case 'auth/email-already-in-use': return t.error_email_already_in_use;
        case 'auth/weak-password': return t.error_weak_password;
        case 'auth/invalid-email': return t.error_invalid_email;
        default: return t.error_unknown;
    }
}

const AuthForm = ({ isRegister, t }: { isRegister?: boolean, t: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/'); // Redirect to home page on successful login/register
    } catch (err: unknown) {
      const authError = err as AuthError;
      setError(getFriendlyErrorMessage(t, authError.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor={isRegister ? 'register-email' : 'login-email'}>{t.emailLabel}</Label>
        <Input
          id={isRegister ? 'register-email' : 'login-email'}
          type="email"
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="email"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={isRegister ? 'register-password' : 'login-password'}>{t.passwordLabel}</Label>
        <Input
          id={isRegister ? 'register-password' : 'login-password'}
          type="password"
          placeholder={t.passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          autoComplete={isRegister ? "new-password" : "current-password"}
        />
      </div>
      {error && (
        <p className="text-sm text-destructive font-medium">{error}</p>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? t.loading : (isRegister ? t.registerButton : t.loginButton)}
      </Button>
    </form>
  );
};


export default function LoginPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
    // If user is already logged in, redirect them away from login page
    if (user) {
        router.replace('/');
    }
  }, [user, router]);
  
  if (user) {
      return (
          <div className="flex h-screen items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center justify-center">
        <header className="absolute top-4 left-4">
             <Link href="/" passHref>
                <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backButton}
                </Button>
            </Link>
        </header>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Tabs defaultValue="login" className="w-[350px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t.loginTitle}</TabsTrigger>
                <TabsTrigger value="register">{t.registerTitle}</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
                <Card>
                    <CardHeader>
                        <CardTitle>{t.loginTitle}</CardTitle>
                        <CardDescription>{t.loginDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AuthForm t={t} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="register">
                <Card>
                    <CardHeader>
                        <CardTitle>{t.registerTitle}</CardTitle>
                        <CardDescription>{t.registerDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AuthForm isRegister t={t} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
