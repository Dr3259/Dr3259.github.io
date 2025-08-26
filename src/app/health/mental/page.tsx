
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Zap, BookOpen, UserCheck, Sparkles } from 'lucide-react';

const translations = {
  'zh-CN': {
    pageTitle: '心理健康',
    backButton: '返回健康中心',
    pageDescription: '通过正念练习、情绪管理和自我关怀，滋养您的内心世界。',
    feature1Title: '正念练习',
    feature1Desc: '引导式冥想，帮助您减轻压力，保持专注。',
    feature2Title: '情绪日记',
    feature2Desc: '记录您的日常情绪波动，更好地了解自己。',
    feature3Title: '专业资源',
    feature3Desc: '提供心理健康文章、播客和专家链接。',
    comingSoon: '即将推出',
  },
  'en': {
    pageTitle: 'Mental Health',
    backButton: 'Back to Health Center',
    pageDescription: 'Nourish your inner world with mindfulness, mood tracking, and self-care.',
    feature1Title: 'Mindfulness Exercises',
    feature1Desc: 'Guided meditations to help you reduce stress and stay focused.',
    feature2Title: 'Mood Journal',
    feature2Desc: 'Track your daily emotional fluctuations to understand yourself better.',
    feature3Title: 'Professional Resources',
    feature3Desc: 'Access articles, podcasts, and links to mental health experts.',
    comingSoon: 'Coming Soon',
  }
};

type LanguageKey = keyof typeof translations;

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    comingSoonText: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, comingSoonText }) => (
    <Card className="relative group overflow-hidden text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="pt-8">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full mx-auto flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                <Icon className="w-8 h-8"/>
            </div>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <CardDescription>{description}</CardDescription>
        </CardContent>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="font-semibold text-foreground">{comingSoonText}</span>
        </div>
    </Card>
);

export default function MentalHealthPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);
  
  const features = [
      { icon: Zap, title: t.feature1Title, description: t.feature1Desc },
      { icon: BookOpen, title: t.feature2Title, description: t.feature2Desc },
      { icon: UserCheck, title: t.feature3Title, description: t.feature3Desc },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 px-4 sm:px-8 items-center">
      <header className="w-full max-w-4xl mb-8 self-center">
        <Link href="/health" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>
      
      <main className="w-full max-w-4xl flex flex-col items-center text-center flex-grow">
        <div className="mb-12">
            <Sparkles className="w-12 h-12 text-primary mb-4 mx-auto" />
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-3">
              {t.pageTitle}
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl">
              {t.pageDescription}
            </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
                <FeatureCard 
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    comingSoonText={t.comingSoon}
                />
            ))}
        </div>
      </main>
    </div>
  );
}
