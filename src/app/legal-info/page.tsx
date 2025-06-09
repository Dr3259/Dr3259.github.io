
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpenText } from 'lucide-react'; // Using BookOpenText as placeholder icon
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const translations = {
  'zh-CN': {
    pageTitle: '法律普及',
    backButton: '返回休闲驿站',
    welcomeMessage: '法律知识，守护你我。',
    contentComingSoon: '相关的法律科普内容正在整理中，敬请期待！',
    exampleSectionTitle: '例如：常见法律问题解答',
    exampleQuestion1: '问题1：租赁合同需要注意什么？',
    exampleAnswer1: '答：明确租期、租金、押金、违约责任等条款。',
  },
  'en': {
    pageTitle: 'Legal Information',
    backButton: 'Back to Rest Stop',
    welcomeMessage: 'Legal knowledge protects everyone.',
    contentComingSoon: 'Relevant legal information is being compiled. Please check back soon!',
    exampleSectionTitle: 'For example: Common Legal Questions',
    exampleQuestion1: 'Q1: What to look out for in a rental agreement?',
    exampleAnswer1: 'A: Clarify lease term, rent, deposit, liability for breach, etc.',
  }
};

type LanguageKey = keyof typeof translations;

export default function LegalInfoPage() {
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
            <Scale className="w-16 h-16 sm:w-20 sm:h-20 text-primary mb-4 mx-auto" />
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
                <p className="font-semibold text-foreground/90">{t.exampleQuestion1}</p>
                <p className="text-muted-foreground mt-1">{t.exampleAnswer1}</p>
            </div>
            <div className="text-center py-6">
                <BookOpenText className="w-12 h-12 text-primary/70 mb-3 mx-auto" />
                <p className="text-muted-foreground italic">{t.contentComingSoon}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
