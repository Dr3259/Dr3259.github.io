
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Eye, Sunrise, Sunset } from 'lucide-react';

const translations = {
  'zh-CN': {
    pageTitle: '护眼专栏',
    backButton: '返回健康中心',
    pageDescription: '科学护眼，远离疲劳，拥抱清晰视界。',
    feature1Title: '眼保健操',
    feature1Desc: '跟随引导，放松眼部肌肉，缓解视疲劳。',
    feature2Title: '休息提醒',
    feature2Desc: '设置定时提醒，遵循20-20-20法则保护眼睛。',
    feature3Title: '护眼知识',
    feature3Desc: '学习关于蓝光、屏幕距离和环境光线的知识。',
    comingSoon: '即将推出',
  },
  'en': {
    pageTitle: 'Eye Care',
    backButton: 'Back to Health Center',
    pageDescription: 'Protect your vision with scientific tips and exercises.',
    feature1Title: 'Eye Exercises',
    feature1Desc: 'Follow guided exercises to relax eye muscles and relieve fatigue.',
    feature2Title: 'Break Reminders',
    feature2Desc: 'Set timers to follow the 20-20-20 rule for eye protection.',
    feature3Title: 'Eye Health Tips',
    feature3Desc: 'Learn about blue light, screen distance, and ambient lighting.',
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

export default function EyeCarePage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);
  
  const features = [
      { icon: Sunrise, title: t.feature1Title, description: t.feature1Desc },
      { icon: Sunset, title: t.feature2Title, description: t.feature2Desc },
      { icon: Eye, title: t.feature3Title, description: t.feature3Desc },
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
            <Eye className="w-12 h-12 text-primary mb-4 mx-auto" />
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
