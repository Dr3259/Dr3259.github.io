
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const translations = {
  'zh-CN': {
    pageTitle: '眼部放松',
    backButton: '返回健康中心',
    instruction: '请放松您的眼部肌肉，静静感受背景色彩的柔和变化。',
  },
  'en': {
    pageTitle: 'Eye Relaxation',
    backButton: 'Back to Health Center',
    instruction: 'Please relax your eye muscles and enjoy the gentle change of the background colors.',
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
    <div className="flex flex-col min-h-screen w-full text-foreground transition-colors duration-300 bg-gradient-to-br from-[#90EE90] via-[#E0FFFF] to-[#99CC33] dark:from-[#90ee90]/20 dark:via-[#e0ffff]/20 dark:to-[#99cc33]/20">
      
      <header className="w-full p-4 sm:p-8 absolute top-0 left-0 z-10">
        <Link href="/health" passHref>
          <Button variant="outline" size="sm" className="bg-background/30 backdrop-blur-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>
      
      <main className="w-full flex-grow flex flex-col items-center justify-center text-center p-4">
        <div className="relative z-10 bg-background/30 backdrop-blur-sm p-4 rounded-lg">
            <h1 className="text-2xl sm:text-3xl font-headline font-semibold text-primary mb-3">
              {t.pageTitle}
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl">
              {t.instruction}
            </p>
        </div>
      </main>
    </div>
  );
}
