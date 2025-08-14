
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GameCard } from '@/components/GameCard';
import { ArrowLeft, Gamepad2, Utensils, Scale, Brain, Globe, Library, Film, Music } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const translations = {
  'zh-CN': {
    backButton: '返回主页',
    pageTitle: '休闲驿站',
    pageDescription: '选择一项活动来放松身心，或探索实用工具。',
    gameStationButton: '小游戏驿站',
    gameStationDescription: '畅玩 2048、数字华容道等经典益智游戏。',
    utilitiesTitle: '实用工具',
    foodFinderButton: '去哪吃',
    legalInfoButton: '法律普及',
    personalityTestButton: '人格测试',
    personalHubTitle: '个人中心',
    recommendedWebsitesButton: '精品网站推荐',
    personalLibraryButton: '个人图书馆',
    personalCinemaButton: '个人电影院',
    privateMusicPlayerButton: '私人音乐播放器',
  },
  'en': {
    backButton: 'Back to Home',
    pageTitle: 'Rest Stop',
    pageDescription: 'Choose an activity to relax, or explore useful tools.',
    gameStationButton: 'Mini Game Station',
    gameStationDescription: 'Play classic puzzle games like 2048, Klotski, and more.',
    utilitiesTitle: 'Utilities',
    foodFinderButton: 'Where to Eat',
    legalInfoButton: 'Legal Info',
    personalityTestButton: 'Personality Test',
    personalHubTitle: 'Personal Hub',
    recommendedWebsitesButton: 'Recommended Websites',
    personalLibraryButton: 'Personal Library',
    personalCinemaButton: 'Personal Cinema',
    privateMusicPlayerButton: 'Private Music Player',
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

  const handleNavigation = useCallback((path: string) => router.push(path), [router]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 sm:py-16 px-4 sm:px-8 items-center">
      <header className="w-full max-w-4xl mb-8 sm:mb-12 self-center">
        <Link href="/" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center text-center flex-grow">
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-4">
          {t.pageTitle}
        </h1>
        <p className="text-muted-foreground mb-10 sm:mb-12 text-base sm:text-lg max-w-md">
            {t.pageDescription}
        </p>
        
        {/* Highlighted Game Station Card */}
        <Card 
          className="w-full mb-10 sm:mb-12 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
          onClick={() => handleNavigation('/rest/games')}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavigation('/rest/games'); }}
        >
          <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between bg-gradient-to-br from-primary/10 via-background to-background rounded-lg">
            <div className="flex items-center mb-4 sm:mb-0">
                <div className="p-3 bg-primary/20 rounded-full mr-5">
                    <Gamepad2 className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                </div>
                <div>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-left text-foreground">{t.gameStationButton}</CardTitle>
                    <p className="text-sm text-muted-foreground text-left mt-1">{t.gameStationDescription}</p>
                </div>
            </div>
            <Button variant="ghost" size="lg" className="group-hover:bg-accent transition-colors">
              {currentLanguage === 'zh-CN' ? '进入' : 'Enter'}
              <ArrowLeft className="h-4 w-4 ml-2 transform rotate-180 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Utilities Section */}
        <div className="w-full mb-10 sm:mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-left">{t.utilitiesTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                 <GameCard 
                    title={t.foodFinderButton} 
                    icon={Utensils} 
                    onClick={() => handleNavigation('/food-finder')} 
                    ariaLabel={t.foodFinderButton}
                 />
                 <GameCard 
                    title={t.legalInfoButton} 
                    icon={Scale} 
                    onClick={() => handleNavigation('/legal-info')} 
                    ariaLabel={t.legalInfoButton}
                 />
                 <GameCard 
                    title={t.personalityTestButton} 
                    icon={Brain}
                    onClick={() => handleNavigation('/personality-test')} 
                    ariaLabel={t.personalityTestButton}
                 />
            </div>
        </div>

        {/* Personal Hub Section */}
        <div className="w-full">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-left">{t.personalHubTitle}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <GameCard 
                    title={t.recommendedWebsitesButton} 
                    icon={Globe}
                    onClick={() => handleNavigation('/recommended-websites')} 
                    ariaLabel={t.recommendedWebsitesButton}
                    isSmall
                />
                <GameCard 
                    title={t.personalLibraryButton} 
                    icon={Library}
                    onClick={() => handleNavigation('/personal-library')} 
                    ariaLabel={t.personalLibraryButton}
                    isSmall
                />
                <GameCard 
                    title={t.personalCinemaButton} 
                    icon={Film}
                    onClick={() => handleNavigation('/personal-cinema')} 
                    ariaLabel={t.personalCinemaButton}
                    isSmall
                />
                <GameCard 
                    title={t.privateMusicPlayerButton} 
                    icon={Music}
                    onClick={() => handleNavigation('/private-music-player')} 
                    ariaLabel={t.privateMusicPlayerButton}
                    isSmall
                />
            </div>
        </div>
      </main>
    </div>
  );
}
