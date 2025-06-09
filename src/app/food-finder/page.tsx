
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Utensils } from 'lucide-react';

const translations = {
  'zh-CN': {
    pageTitle: '去哪吃',
    backButton: '返回主页',
    placeholderText: '今天想吃点什么呢？ (功能开发中)',
  },
  'en': {
    pageTitle: 'Where to Eat',
    backButton: 'Back to Home',
    placeholderText: 'What are you craving today? (Feature in development)',
  }
};

type LanguageKey = keyof typeof translations;

export default function FoodFinderPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN');
  const router = useRouter();

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'zh-CN';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 sm:py-16 px-4 items-center justify-center">
      <header className="w-full max-w-xl mb-8 sm:mb-12 self-center absolute top-10 left-1/2 transform -translate-x-1/2 px-4">
        <div className="relative w-full max-w-xl mx-auto">
          <Link href="/" passHref>
            <Button variant="outline" size="sm" className="absolute left-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.backButton}
            </Button>
          </Link>
        </div>
      </header>

      <main className="w-full max-w-md flex flex-col items-center text-center">
        <Utensils className="w-20 h-20 sm:w-24 sm:h-24 text-primary mb-6" />
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-3">
          {t.pageTitle}
        </h1>
        <p className="text-muted-foreground mb-10 text-base sm:text-lg max-w-xs sm:max-w-sm">
          {t.placeholderText}
        </p>
        {/* Future content for the Food Finder module will go here */}
      </main>
    </div>
  );
}
