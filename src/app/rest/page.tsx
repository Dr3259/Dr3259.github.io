
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GameCard } from '@/components/GameCard';
import { ArrowLeft, Gamepad2, Utensils } from 'lucide-react';

const translations = {
  'zh-CN': {
    backButton: '返回主页',
    pageTitle: '休闲驿站',
    pageDescription: '选择一项活动来放松一下。',
    gameStationButton: '小游戏驿站',
    foodFinderButton: '去哪吃',
    gameStationAriaLabel: '进入小游戏驿站',
    foodFinderAriaLabel: '进入去哪吃模块',
  },
  'en': {
    backButton: 'Back to Home',
    pageTitle: 'Rest Stop',
    pageDescription: 'Choose an activity to relax.',
    gameStationButton: 'Mini Game Station',
    foodFinderButton: 'Where to Eat',
    gameStationAriaLabel: 'Enter Mini Game Station',
    foodFinderAriaLabel: 'Enter Where to Eat module',
  }
};

type LanguageKey = keyof typeof translations;

export default function RestHubPage() {
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
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 sm:py-16 px-4 items-center">
      <header className="w-full max-w-xl mb-8 sm:mb-12 self-center">
        <Link href="/" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-lg flex flex-col items-center text-center flex-grow">
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-4">
          {t.pageTitle}
        </h1>
        <p className="text-muted-foreground mb-10 text-base sm:text-lg max-w-xs sm:max-w-sm">
            {t.pageDescription}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full">
          <GameCard 
            title={t.gameStationButton} 
            icon={Gamepad2} 
            onClick={() => router.push('/rest/games')} 
            ariaLabel={t.gameStationAriaLabel}
          />
          <GameCard 
            title={t.foodFinderButton} 
            icon={Utensils} 
            onClick={() => router.push('/food-finder')} 
            ariaLabel={t.foodFinderAriaLabel}
          />
        </div>
      </main>
    </div>
  );
}

