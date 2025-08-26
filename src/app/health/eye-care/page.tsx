
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Glasses, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const translations = {
  'zh-CN': {
    pageTitle: '眼部放松',
    backButton: '返回健康中心',
    instruction: '通过针对性的练习，舒缓您的眼部肌肉，拥抱清晰视界。',
    myopiaTitle: '近视放松练习',
    myopiaDesc: '通过远近交替、眼球运动等方式，缓解长时间近距离用眼带来的疲劳。',
    astigmatismTitle: '散光放松练习',
    astigmatismDesc: '进行聚焦训练和眼部瑜伽，帮助改善视觉稳定性和清晰度。',
    comingSoon: '敬请期待',
  },
  'en': {
    pageTitle: 'Eye Relaxation',
    backButton: 'Back to Health Center',
    instruction: 'Soothe your eye muscles and embrace clear vision with targeted exercises.',
    myopiaTitle: 'Myopia Relaxation',
    myopiaDesc: 'Relieve fatigue from prolonged close-up work with alternating focus and eye movements.',
    astigmatismTitle: 'Astigmatism Relaxation',
    astigmatismDesc: 'Engage in focus training and eye yoga to help improve visual stability and clarity.',
    comingSoon: 'Coming Soon',
  }
};

type LanguageKey = keyof typeof translations;

const FeatureCard: React.FC<{ icon: React.ElementType, title: string, description: string, comingSoonText: string }> = ({ icon: Icon, title, description, comingSoonText }) => (
    <Card className="relative group overflow-hidden text-center transition-all duration-300 bg-background/30 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="pt-8">
            <div className="w-16 h-16 bg-primary/10 text-primary-foreground rounded-full mx-auto flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ring-2 ring-primary-foreground/30">
                <Icon className="w-8 h-8"/>
            </div>
            <CardTitle className="text-primary-foreground text-shadow-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <CardDescription className="text-foreground/80">{description}</CardDescription>
        </CardContent>
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
            <Eye className="w-20 h-20 text-primary-foreground mx-auto mb-6 opacity-80" style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'}}/>
            <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary-foreground mb-3 text-shadow-lg" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.2)'}}>
              {t.pageTitle}
            </h1>
            <p className="text-foreground/80 text-base max-w-2xl text-shadow" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.1)'}}>
              {t.instruction}
            </p>
        </div>

        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
            <FeatureCard 
                icon={Glasses}
                title={t.myopiaTitle}
                description={t.myopiaDesc}
                comingSoonText={t.comingSoon}
            />
            <FeatureCard 
                icon={Target}
                title={t.astigmatismTitle}
                description={t.astigmatismDesc}
                comingSoonText={t.comingSoon}
            />
        </div>
      </main>
    </div>
  );
}
