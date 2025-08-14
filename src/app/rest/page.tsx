
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gamepad2, Utensils, Scale, Brain, Globe, Library, Film, Music, MoreVertical, Pin, PinOff } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const translations = {
  'zh-CN': {
    backButton: '返回主页',
    pageTitle: '休闲驿站',
    pageDescription: '选择一项活动来放松身心，或探索实用工具。',
    pinnedTitle: '置顶功能',
    allFeaturesTitle: '所有功能',
    pinItem: '置顶',
    unpinItem: '取消置顶',
    pinLimitReached: '最多只能置顶2个项目',
    items: {
      games: { title: '小游戏驿站', description: '畅玩 2048、数字华容道等经典益智游戏。', icon: Gamepad2, path: '/rest/games' },
      food: { title: '去哪吃', description: '帮你发现附近的美味餐厅。', icon: Utensils, path: '/food-finder' },
      library: { title: '个人图书馆', description: '管理您的阅读列表和笔记。', icon: Library, path: '/personal-library' },
      cinema: { title: '个人电影院', description: '收藏和追踪您想看的电影。', icon: Film, path: '/personal-cinema' },
      music: { title: '私人音乐播放器', description: '创建和聆听您的专属歌单。', icon: Music, path: '/private-music-player' },
      websites: { title: '精品网站推荐', description: '发现有趣和实用的网站。', icon: Globe, path: '/recommended-websites' },
      legal: { title: '法律普及', description: '了解与生活相关的法律常识。', icon: Scale, path: '/legal-info' },
      personality: { title: '人格测试', description: '探索和了解真实的自我。', icon: Brain, path: '/personality-test' },
    }
  },
  'en': {
    backButton: 'Back to Home',
    pageTitle: 'Rest Stop',
    pageDescription: 'Choose an activity to relax, or explore useful tools.',
    pinnedTitle: 'Pinned',
    allFeaturesTitle: 'All Features',
    pinItem: 'Pin',
    unpinItem: 'Unpin',
    pinLimitReached: 'You can only pin up to 2 items',
    items: {
      games: { title: 'Mini Game Station', description: 'Play classic puzzle games like 2048, Klotski, and more.', icon: Gamepad2, path: '/rest/games' },
      food: { title: 'Where to Eat', description: 'Helps you discover delicious restaurants nearby.', icon: Utensils, path: '/food-finder' },
      library: { title: 'Personal Library', description: 'Manage your reading lists and notes.', icon: Library, path: '/personal-library' },
      cinema: { title: 'Personal Cinema', description: 'Collect and track movies you want to watch.', icon: Film, path: '/personal-cinema' },
      music: { title: 'Private Music Player', description: 'Create and listen to your exclusive playlists.', icon: Music, path: '/private-music-player' },
      websites: { title: 'Recommended Websites', description: 'Discover interesting and useful websites.', icon: Globe, path: '/recommended-websites' },
      legal: { title: 'Legal Info', description: 'Learn about legal knowledge relevant to daily life.', icon: Scale, path: '/legal-info' },
      personality: { title: 'Personality Test', description: 'Explore and understand your true self.', icon: Brain, path: '/personality-test' },
    }
  }
};

type LanguageKey = keyof typeof translations;
type RestItemKey = keyof (typeof translations)['en']['items'];

interface RestItemProps {
  itemKey: RestItemKey;
  icon: React.ElementType;
  title: string;
  description?: string;
  path: string;
  isPinned: boolean;
  canPin: boolean;
  onPinToggle: (itemKey: RestItemKey) => void;
  onClick: (path: string) => void;
  pinLimitReachedText: string;
  pinItemText: string;
  unpinItemText: string;
}

const LOCAL_STORAGE_KEY_PINNED_REST_ITEMS = 'weekglance_pinned_rest_items_v1';
const MAX_PINS = 2;

const RestItem: React.FC<RestItemProps> = ({ itemKey, icon: Icon, title, description, path, isPinned, canPin, onPinToggle, onClick, pinLimitReachedText, pinItemText, unpinItemText }) => {
  return (
    <div
      onClick={() => onClick(path)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(path); }}
      role="button"
      tabIndex={0}
      className={cn(
        "group w-full text-left p-4 sm:p-5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-5 relative",
        "focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 focus:ring-offset-background",
        isPinned 
          ? "bg-primary/10 border-2 border-primary/20 hover:bg-primary/20 hover:shadow-lg hover:-translate-y-1"
          : "bg-card/60 hover:bg-card/90 hover:shadow-lg hover:-translate-y-1"
      )}
    >
      <div className={cn(
          "p-2.5 rounded-lg transition-colors",
          isPinned ? "bg-primary/20" : "bg-primary/10 group-hover:bg-primary/20"
      )}>
        <Icon className={cn("text-primary transition-transform duration-300 group-hover:scale-110 h-6 w-6")} />
      </div>
      <div className="flex-grow">
        <p className={cn("font-semibold text-foreground text-base")}>{title}</p>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent onClick={(e) => e.stopPropagation()} align="end">
            {isPinned ? (
              <DropdownMenuItem onClick={() => onPinToggle(itemKey)}>
                <PinOff className="mr-2 h-4 w-4" />
                <span>{unpinItemText}</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onPinToggle(itemKey)} disabled={!canPin} title={!canPin ? pinLimitReachedText : ''}>
                <Pin className="mr-2 h-4 w-4" />
                <span>{pinItemText}</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};


export default function RestHubPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN');
  const [pinnedItems, setPinnedItems] = useState<RestItemKey[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'zh-CN';
      setCurrentLanguage(browserLang);
      
      const savedPins = localStorage.getItem(LOCAL_STORAGE_KEY_PINNED_REST_ITEMS);
      if (savedPins) {
        setPinnedItems(JSON.parse(savedPins));
      }
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const handleNavigation = useCallback((path: string) => router.push(path), [router]);

  const handlePinToggle = (itemKey: RestItemKey) => {
    const newPinnedItems = pinnedItems.includes(itemKey)
      ? pinnedItems.filter(key => key !== itemKey)
      : [...pinnedItems, itemKey];

    if (newPinnedItems.length > MAX_PINS) return;

    setPinnedItems(newPinnedItems);
    localStorage.setItem(LOCAL_STORAGE_KEY_PINNED_REST_ITEMS, JSON.stringify(newPinnedItems));
  };
  
  const allItems: RestItemKey[] = Object.keys(t.items) as RestItemKey[];
  const canPinMore = pinnedItems.length < MAX_PINS;
  
  const unpinnedItems = allItems.filter(key => !pinnedItems.includes(key));

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
        <h1 className="text-2xl sm:text-3xl font-headline font-bold text-primary mb-4">
          {t.pageTitle}
        </h1>
        <p className="text-muted-foreground mb-10 sm:mb-12 text-base sm:text-lg max-w-md">
            {t.pageDescription}
        </p>
        
        <div className="w-full space-y-12">
          {pinnedItems.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-left mb-4 text-foreground/80">{t.pinnedTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pinnedItems.map(itemKey => {
                  const item = t.items[itemKey];
                  return (
                    <RestItem
                      key={itemKey}
                      itemKey={itemKey}
                      {...item}
                      isPinned={true}
                      canPin={true}
                      onPinToggle={handlePinToggle}
                      onClick={handleNavigation}
                      pinLimitReachedText={t.pinLimitReached}
                      pinItemText={t.pinItem}
                      unpinItemText={t.unpinItem}
                    />
                  );
                })}
              </div>
            </section>
          )}

          <section>
              {pinnedItems.length > 0 && <h2 className="text-xl font-semibold text-left mb-4 text-foreground/80">{t.allFeaturesTitle}</h2>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {unpinnedItems.map(itemKey => {
                    const item = t.items[itemKey];
                    return (
                        <RestItem
                          key={itemKey}
                          itemKey={itemKey}
                          {...item}
                          isPinned={false}
                          canPin={canPinMore}
                          onPinToggle={handlePinToggle}
                          onClick={handleNavigation}
                          pinLimitReachedText={t.pinLimitReached}
                          pinItemText={t.pinItem}
                          unpinItemText={t.unpinItem}
                        />
                    );
                })}
              </div>
            </section>
        </div>
      </main>
    </div>
  );
}
