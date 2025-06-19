
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpenText, Scale, ShieldCheck, Briefcase, Users } from 'lucide-react'; // Added new icons
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
    cybersecurityLawTitle: '网络安全法普及',
    exampleQuestionCyber: '问题：个人信息在网络上如何得到保护？',
    exampleAnswerCyber: '答：网络运营者收集、使用个人信息，应当遵循合法、正当、必要的原则。',
    laborLawTitle: '劳动法普及',
    exampleQuestionLabor: '问题：签订劳动合同时有哪些注意事项？',
    exampleAnswerLabor: '答：明确工作内容、工作地点、劳动报酬、合同期限等。',
    marriageLawTitle: '婚姻法普及',
    exampleQuestionMarriage: '问题：夫妻共同财产包括哪些？',
    exampleAnswerMarriage: '答：一般包括工资、奖金，生产、经营的收益，知识产权的收益等。',
  },
  'en': {
    pageTitle: 'Legal Information',
    backButton: 'Back to Rest Stop',
    welcomeMessage: 'Legal knowledge protects everyone.',
    contentComingSoon: 'Relevant legal information is being compiled. Please check back soon!',
    exampleSectionTitle: 'For example: Common Legal Questions',
    exampleQuestion1: 'Q1: What to look out for in a rental agreement?',
    exampleAnswer1: 'A: Clarify lease term, rent, deposit, liability for breach, etc.',
    cybersecurityLawTitle: 'Cybersecurity Law Info',
    exampleQuestionCyber: 'Q: How is personal information protected online?',
    exampleAnswerCyber: 'A: Network operators must follow principles of legality, legitimacy, and necessity when collecting and using personal information.',
    laborLawTitle: 'Labor Law Info',
    exampleQuestionLabor: 'Q: What should be noted when signing a labor contract?',
    exampleAnswerLabor: 'A: Specify work content, location, remuneration, contract term, etc.',
    marriageLawTitle: 'Marriage Law Info',
    exampleQuestionMarriage: 'Q: What constitutes joint marital property?',
    exampleAnswerMarriage: 'A: Generally includes wages, bonuses, income from production/operation, and income from intellectual property rights.',
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

        <Card className="w-full shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">{t.exampleSectionTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-semibold text-foreground/90">{t.exampleQuestion1}</p>
                <p className="text-muted-foreground mt-1">{t.exampleAnswer1}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full shadow-xl mb-6">
          <CardHeader className="flex flex-row items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl text-foreground">{t.cybersecurityLawTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-semibold text-foreground/90">{t.exampleQuestionCyber}</p>
                <p className="text-muted-foreground mt-1">{t.exampleAnswerCyber}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full shadow-xl mb-6">
          <CardHeader className="flex flex-row items-center space-x-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl text-foreground">{t.laborLawTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-semibold text-foreground/90">{t.exampleQuestionLabor}</p>
                <p className="text-muted-foreground mt-1">{t.exampleAnswerLabor}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full shadow-xl mb-6">
          <CardHeader className="flex flex-row items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl text-foreground">{t.marriageLawTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-semibold text-foreground/90">{t.exampleQuestionMarriage}</p>
                <p className="text-muted-foreground mt-1">{t.exampleAnswerMarriage}</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center py-6 mt-4">
            <BookOpenText className="w-12 h-12 text-primary/70 mb-3 mx-auto" />
            <p className="text-muted-foreground italic">{t.contentComingSoon}</p>
        </div>
      </main>
    </div>
  );
}

