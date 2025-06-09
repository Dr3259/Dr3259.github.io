
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Rocket } from 'lucide-react'; // Using Rocket icon for the station

const translations = {
  'zh-CN': {
    backButton: '返回主页',
    pageTitle: '小游戏驿站',
    pageDescription: '放松一下，玩玩小游戏。',
    enterHubButton: '进入游戏中心',
    enterHubAriaLabel: '点击进入小游戏中心',
  },
  'en': {
    backButton: 'Back to Home',
    pageTitle: 'Mini Game Station',
    pageDescription: 'Take a break and play some mini games.',
    enterHubButton: 'Enter Game Hub',
    enterHubAriaLabel: 'Click to enter the mini game hub',
  }
};

type LanguageKey = keyof typeof translations;

export default function RestEntryPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN');
  const router = useRouter();

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'zh-CN';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = translations[currentLanguage];

  const handleEnterHubClick = () => {
    router.push('/rest/games');
  };

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
        <Rocket className="w-20 h-20 sm:w-24 sm:h-24 text-primary mb-6 animate-pulse" /> 
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-3">
          {t.pageTitle}
        </h1>
        <p className="text-muted-foreground mb-10 text-base sm:text-lg max-w-xs sm:max-w-sm">
            {t.pageDescription}
        </p>
        
        <Button 
            size="lg" 
            className="px-8 py-6 sm:px-12 sm:py-7 text-lg sm:text-xl shadow-lg hover:shadow-xl bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-primary-foreground rounded-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:ring-4 focus:ring-primary/50"
            onClick={handleEnterHubClick}
            aria-label={t.enterHubAriaLabel}
        >
            {t.enterHubButton}
        </Button>
      </main>
    </div>
  );
}
