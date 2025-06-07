
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const translations = {
  'zh-CN': {
    pageTitle: '扫雷',
    backButton: '返回休息区',
    comingSoon: '敬请期待！扫雷游戏正在开发中。',
  },
  'en': {
    pageTitle: 'Minesweeper',
    backButton: 'Back to Rest Area',
    comingSoon: 'Coming Soon! Minesweeper game is under development.',
  }
};

type LanguageKey = keyof typeof translations;

export default function MinesweeperPage() {
  const router = useRouter(); // Initialize router
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center">
      <header className="w-full max-w-md mb-6 sm:mb-8">
        <Button variant="outline" size="sm" onClick={() => router.push('/rest')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.backButton}
        </Button>
      </header>

      <main className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-8">
          {t.pageTitle}
        </h1>
        <div className="bg-card p-8 rounded-lg shadow-xl text-center">
          <p className="text-xl text-muted-foreground">{t.comingSoon}</p>
        </div>
      </main>
    </div>
  );
}

    