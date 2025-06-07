
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const translations = {
  'zh-CN': {
    pageTitle: '2048 游戏',
    backButton: '返回休息区',
    gamePlaceholder: '2048 游戏内容将在此处显示...',
  },
  'en': {
    pageTitle: '2048 Game',
    backButton: 'Back to Rest Area',
    gamePlaceholder: '2048 game content will be displayed here...',
  }
};

type LanguageKey = keyof typeof translations;

export default function Game2048Page() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'zh-CN';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = translations[currentLanguage];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 sm:py-16 px-4">
      <header className="w-full max-w-4xl mb-8 sm:mb-12 self-center">
        <Link href="/rest" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-4xl flex flex-col self-center flex-grow items-center justify-center">
        <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-8">
          {t.pageTitle}
        </h1>
        <div className="bg-card p-8 rounded-lg shadow-lg text-center">
          <p className="text-lg text-muted-foreground">
            {t.gamePlaceholder}
          </p>
        </div>
      </main>
    </div>
  );
}
