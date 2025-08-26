
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ScanEye, EyeOff, Sparkles, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const translations = {
  'zh-CN': {
    pageTitle: '眼部放松',
    backButton: '返回健康中心',
    instruction: '闭上眼睛，深呼吸，让视觉和心灵得到片刻的宁静。',
  },
  'en': {
    pageTitle: 'Eye Relaxation',
    backButton: 'Back to Health Center',
    instruction: 'Close your eyes, take a deep breath, and let your vision and mind find a moment of peace.',
  }
};

type LanguageKey = keyof typeof translations;

export default function EyeCarePage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  return (
    <div className="flex flex-col min-h-screen w-full text-foreground transition-colors duration-500 bg-gradient-to-br from-[#90EE90] via-[#E0FFFF] to-[#99CC33] dark:from-green-900/50 dark:via-cyan-900/50 dark:to-lime-800/50 p-4 sm:p-8">
      
      <header className="w-full max-w-5xl mx-auto z-10">
        <Link href="/health" passHref>
          <Button variant="outline" size="sm" className="bg-background/30 backdrop-blur-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>
      
      <main className="w-full max-w-5xl mx-auto flex-grow flex flex-col items-center justify-center text-center py-8">
        <div className="relative z-10 p-4 rounded-lg mb-12">
            <Eye className="w-20 h-20 text-primary-foreground mx-auto mb-6 opacity-80" style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'}}/>
            <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary-foreground mb-3 text-shadow-lg" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.2)'}}>
              {t.pageTitle}
            </h1>
            <p className="text-foreground/80 text-base max-w-2xl text-shadow" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.1)'}}>
              {t.instruction}
            </p>
        </div>
      </main>
    </div>
  );
}
