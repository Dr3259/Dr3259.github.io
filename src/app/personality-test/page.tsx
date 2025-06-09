
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react'; // Using Brain icon
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const translations = {
  'zh-CN': {
    pageTitle: '人格测试',
    backButton: '返回休闲驿站',
    welcomeMessage: '探索真实的自我。',
    contentComingSoon: '人格测试功能正在开发中，敬请期待！',
    exampleSectionTitle: '测试类型示例',
    exampleTest1: '例如：MBTI 性格类型测试',
    exampleTest2: '例如：大五人格模型测试',
  },
  'en': {
    pageTitle: 'Personality Test',
    backButton: 'Back to Rest Stop',
    welcomeMessage: 'Discover your true self.',
    contentComingSoon: 'Personality Test feature is under development. Please check back soon!',
    exampleSectionTitle: 'Example Test Types',
    exampleTest1: 'E.g., MBTI Personality Type Test',
    exampleTest2: 'E.g., Big Five Personality Traits Test',
  }
};

type LanguageKey = keyof typeof translations;

export default function PersonalityTestPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 sm:py-16 px-4 items-center">
      <header className="w-full max-w-2xl mb-8 sm:mb-12 self-center">
        <Link href="/rest" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-2xl flex flex-col items-center flex-grow">
        <div className="text-center mb-10">
            <Brain className="w-16 h-16 sm:w-20 sm:h-20 text-primary mb-4 mx-auto" />
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-3">
            {t.pageTitle}
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
            {t.welcomeMessage}
            </p>
        </div>

        <Card className="w-full shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">{t.exampleSectionTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-semibold text-foreground/90">{t.exampleTest1}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-semibold text-foreground/90">{t.exampleTest2}</p>
            </div>
            <div className="text-center py-6">
                <p className="text-muted-foreground italic">{t.contentComingSoon}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
