
"use client";

import React, { useState, useEffect, useMemo, useCallback, type DragEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gem, MoreVertical, Pin, PinOff, GripVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const translations = {
  'zh-CN': {
    backButton: '返回主页',
    pageTitle: '富豪一下',
    pageDescription: '探索财富的奥秘，规划您的财务未来。',
    pinnedTitle: '置顶功能',
    allFeaturesTitle: '所有功能',
    pinItem: '置顶',
    unpinItem: '取消置顶',
    pinLimitReached: '最多只能置顶2个项目',
    dragHandleLabel: '拖动排序',
    comingSoon: '敬请期待！此功能正在开发中。',
    items: {}
  },
  'en': {
    backButton: 'Back to Home',
    pageTitle: 'Rich Time',
    pageDescription: 'Explore the secrets of wealth and plan your financial future.',
    pinnedTitle: 'Pinned',
    allFeaturesTitle: 'All Features',
    pinItem: 'Pin',
    unpinItem: 'Unpin',
    pinLimitReached: 'You can only pin up to 2 items',
    dragHandleLabel: 'Drag to reorder',
    comingSoon: 'Coming Soon! This feature is under development.',
    items: {}
  }
};

type LanguageKey = keyof typeof translations;
type RichItemKey = keyof (typeof translations)['en']['items'];

export default function RichPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 px-4 sm:px-8 items-center">
      <header className="w-full max-w-4xl mb-8 self-center">
        <Link href="/" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center text-center flex-grow">
        <h1 className="text-2xl sm:text-3xl font-headline font-bold text-primary mb-2">
          {t.pageTitle}
        </h1>
        <p className="text-muted-foreground mb-8 text-sm sm:text-base max-w-md">
            {t.pageDescription}
        </p>

        <div className="w-full space-y-12">
            <section>
              <h2 className="text-xl font-semibold text-left mb-4 text-foreground/80">{t.allFeaturesTitle}</h2>
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-20 bg-card rounded-xl">
                  <Gem className="h-20 w-20 mb-6" />
                  <p className="max-w-xs">{t.comingSoon}</p>
              </div>
            </section>
        </div>
      </main>
    </div>
  );
}
