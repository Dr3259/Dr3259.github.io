
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gamepad2, Utensils, Scale, Brain, Globe, Library, Film, Music, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from "@/lib/utils";

const translations = {
  'zh-CN': {
    backButton: '返回主页',
    pageTitle: '休闲驿站',
    pageDescription: '选择一项活动来放松身心，或探索实用工具。',
    gameStationButton: '小游戏驿站',
    gameStationDescription: '畅玩 2048、数字华容道等经典益智游戏。',
    foodFinderButton: '去哪吃',
    foodFinderDescription: '帮你发现附近的美味餐厅。',
    utilitiesTitle: '实用工具',
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
    foodFinderButton: 'Where to Eat',
    foodFinderDescription: 'Helps you discover delicious restaurants nearby.',
    utilitiesTitle: 'Utilities',
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

interface RestItemProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  path: string;
  isFeatured?: boolean;
}

const RestItem: React.FC<RestItemProps & { onClick: (path: string) => void }> = ({ icon: Icon, title, description, path, isFeatured, onClick }) => {
  return (
    <div
      onClick={() => onClick(path)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(path); }}
      role="button"
      tabIndex={0}
      className={cn(
        "group w-full text-left p-4 sm:p-5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-5",
        "bg-card/60 hover:bg-card/90 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 focus:ring-offset-background"
      )}
    >
      <div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
        <Icon className={cn("text-primary transition-transform duration-300 group-hover:scale-110", isFeatured ? "h-8 w-8" : "h-6 w-6")} />
      </div>
      <div className="flex-grow">
        <p className={cn("font-semibold text-foreground", isFeatured ? "text-lg" : "text-base")}>{title}</p>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
    </div>
  )
};

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Left Column - Featured Items */}
            <div className="space-y-6">
                <RestItem 
                    icon={Gamepad2}
                    title={t.gameStationButton}
                    description={t.gameStationDescription}
                    path="/rest/games"
                    isFeatured
                    onClick={handleNavigation}
                />
                <RestItem 
                    icon={Utensils}
                    title={t.foodFinderButton}
                    description={t.foodFinderDescription}
                    path="/food-finder"
                    isFeatured
                    onClick={handleNavigation}
                />
            </div>

            {/* Right Column - Other Items */}
            <Card className="bg-card/50 border-none shadow-none">
              <CardHeader>
                  <CardTitle className="text-xl font-semibold text-left text-foreground/80">{t.personalHubTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                  <RestItem icon={Library} title={t.personalLibraryButton} path="/personal-library" onClick={handleNavigation} />
                  <RestItem icon={Film} title={t.personalCinemaButton} path="/personal-cinema" onClick={handleNavigation} />
                  <RestItem icon={Music} title={t.privateMusicPlayerButton} path="/private-music-player" onClick={handleNavigation} />
                  <RestItem icon={Globe} title={t.recommendedWebsitesButton} path="/recommended-websites" onClick={handleNavigation} />
                  <RestItem icon={Scale} title={t.legalInfoButton} path="/legal-info" onClick={handleNavigation} />
                  <RestItem icon={Brain} title={t.personalityTestButton} path="/personality-test" onClick={handleNavigation} />
              </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
