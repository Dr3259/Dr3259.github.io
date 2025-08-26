
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ScanEye, EyeOff, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const translations = {
  'zh-CN': {
    pageTitle: '眼部放松与测试',
    backButton: '返回健康中心',
    instruction: '科学护眼，远离疲劳，拥抱清晰视界。',
    astigmatismTitle: '散光测试',
    astigmatismDesc: '简单的视觉测试，帮助您初步了解散光情况。',
    myopiaTitle: '近视测试',
    myopiaDesc: '通过标准视力表，随时检查您的视力变化。',
    comingSoon: '即将推出',
  },
  'en': {
    pageTitle: 'Eye Relaxation & Tests',
    backButton: 'Back to Health Center',
    instruction: 'Scientific eye care to prevent fatigue and embrace clear vision.',
    astigmatismTitle: 'Astigmatism Test',
    astigmatismDesc: 'A simple visual test to help you get a preliminary idea of astigmatism.',
    myopiaTitle: 'Myopia Test',
    myopiaDesc: 'Check for changes in your vision at any time with a standard eye chart.',
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
    <Card className="relative group overflow-hidden text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-background/30 backdrop-blur-sm border-white/20">
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
            <div className="text-center">
                 <Sparkles className="w-8 h-8 text-primary mb-2 mx-auto" />
                <span className="font-semibold text-foreground">{comingSoonText}</span>
            </div>
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
      { icon: ScanEye, title: t.astigmatismTitle, description: t.astigmatismDesc },
      { icon: EyeOff, title: t.myopiaTitle, description: t.myopiaDesc },
  ]

  return (
    <div className="flex flex-col min-h-screen w-full text-foreground transition-colors duration-500 bg-gradient-to-br from-[#90EE90] via-[#E0FFFF] to-[#99CC33] dark:from-green-900/50 dark:via-cyan-900/50 dark:to-lime-800/50 p-4 sm:p-8">
      
      <header className="w-full max-w-5xl mx-auto z-10">
        <Link href="/health" passHref>
          <Button variant="outline" size="sm" className="bg-background/30 backdrop-blur-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>
      
      <main className="w-full max-w-5xl mx-auto flex-grow flex flex-col items-center justify-center text-center py-8">
        <div className="relative z-10 p-4 rounded-lg mb-12">
            <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary-foreground mb-3 text-shadow-lg" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.2)'}}>
              {t.pageTitle}
            </h1>
            <p className="text-foreground/80 text-base max-w-2xl text-shadow" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.1)'}}>
              {t.instruction}
            </p>
        </div>
        
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
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
