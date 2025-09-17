"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Utensils } from 'lucide-react';

const translations = {
  'zh-CN': {
    pageTitle: '八大菜系',
    backButton: '返回厨房',
    comingSoon: '敬请期待！中华美食的探索之旅即将开启。',
  },
  'en': {
    pageTitle: 'Eight Great Cuisines',
    backButton: 'Back to Kitchen',
    comingSoon: 'Coming Soon! The journey to explore Chinese cuisine is about to begin.',
  }
};

type LanguageKey = keyof typeof translations;

export default function EightCuisinesPage() {
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
        <Link href="/kitchen" passHref>
            <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
            </Button>
        </Link>
      </header>

      <main className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-8 text-center">
          {t.pageTitle}
        </h1>
        <div className="bg-card p-8 rounded-lg shadow-xl text-center">
            <Utensils className="w-16 h-16 text-primary mb-4 mx-auto" />
          <p className="text-xl text-muted-foreground">{t.comingSoon}</p>
        </div>
      </main>
    </div>
  );
}
