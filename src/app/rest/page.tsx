
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Coffee, RotateCcw } from 'lucide-react';

const translations = {
  'zh-CN': {
    title: '休息一下',
    message: '放松心情，伸展一下。片刻之后再回来。',
    backButton: '返回主页',
  },
  'en': {
    title: 'Take a Break',
    message: 'Relax your mind, stretch your body. Come back in a bit.',
    backButton: 'Back to Home',
  }
};

type LanguageKey = keyof typeof translations;

export default function RestPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'zh-CN';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = translations[currentLanguage];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6 text-center">
      <Coffee className="w-24 h-24 text-primary mb-8 animate-pulse" />
      <h1 className="text-4xl font-headline font-semibold text-primary mb-4">
        {t.title}
      </h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-md">
        {t.message}
      </p>
      <Link href="/" passHref>
        <Button variant="outline" size="lg">
          <RotateCcw className="mr-2 h-5 w-5" />
          {t.backButton}
        </Button>
      </Link>
    </div>
  );
}
