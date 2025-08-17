
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BrainCircuit, HeartPulse } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from "@/lib/utils";

const translations = {
  'zh-CN': {
    pageTitle: '健康中心',
    backButton: '返回主页',
    pageDescription: '关注您的身心健康，让生活更美好。',
    mentalHealthTitle: '心理健康',
    mentalHealthDescription: '关注情绪与思维健康，提供正念练习与心理支持工具。',
    physicalHealthTitle: '身体健康',
    physicalHealthDescription: '追踪身体指标，获取个性化运动与营养建议。',
  },
  'en': {
    pageTitle: 'Health Center',
    backButton: 'Back to Home',
    pageDescription: 'Focus on your mental and physical well-being for a better life.',
    mentalHealthTitle: 'Mental Health',
    mentalHealthDescription: 'Care for your emotional and cognitive well-being with mindfulness and support tools.',
    physicalHealthTitle: 'Physical Health',
    physicalHealthDescription: 'Track physical metrics and get personalized fitness and nutrition advice.',
  }
};

type LanguageKey = keyof typeof translations;

interface HealthCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
}

const HealthCard: React.FC<HealthCardProps> = ({ title, description, icon: Icon, onClick }) => {
  return (
    <Card
      className="group w-full cursor-pointer overflow-hidden rounded-xl border-2 border-transparent bg-card shadow-lg transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-xl hover:scale-105"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <div className="rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
          <Icon className="h-7 w-7 text-primary" />
        </div>
        <CardTitle className="text-xl text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default function HealthPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const router = useRouter();

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const handleCardClick = (path: string) => {
    // router.push(path); // Placeholder for future navigation
    console.log(`Navigating to ${path}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 px-4 sm:px-8 items-center">
      <header className="w-full max-w-2xl mb-8 self-center">
        <Link href="/" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-2xl flex flex-col items-center text-center flex-grow">
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-3">
          {t.pageTitle}
        </h1>
        <p className="text-muted-foreground mb-10 text-base max-w-md">
          {t.pageDescription}
        </p>
        
        <div className="w-full space-y-6">
          <HealthCard 
            title={t.mentalHealthTitle}
            description={t.mentalHealthDescription}
            icon={BrainCircuit}
            onClick={() => handleCardClick('/health/mental')}
          />
          <HealthCard 
            title={t.physicalHealthTitle}
            description={t.physicalHealthDescription}
            icon={HeartPulse}
            onClick={() => handleCardClick('/health/physical')}
          />
        </div>
      </main>
    </div>
  );
}
