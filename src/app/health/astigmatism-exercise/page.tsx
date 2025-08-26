
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const translations = {
  'zh-CN': {
    pageTitle: '散光放松练习',
    backButton: '返回护眼专栏',
    instruction: '注视中心点，观察所有线条。如果某些线条看起来比其他线条更粗、更黑或更模糊，这可能表明存在散光。',
    instruction_2: '尝试慢慢转动头部，看看线条的清晰度是否发生变化。这个练习可以帮助放松您的眼部肌肉。',
    rotateButton: '旋转图表'
  },
  'en': {
    pageTitle: 'Astigmatism Relaxation Exercise',
    backButton: 'Back to Eye Care',
    instruction: 'Focus on the center dot. Observe all the lines. If some lines appear darker, thicker, or blurrier than others, it may indicate astigmatism.',
    instruction_2: 'Try slowly rotating your head to see if the clarity of the lines changes. This exercise can help relax your eye muscles.',
    rotateButton: 'Rotate Chart'
  }
};

type LanguageKey = keyof typeof translations;

const AstigmatismChart: React.FC<{ rotation: number }> = ({ rotation }) => {
  const lines = Array.from({ length: 12 }, (_, i) => i * 15); // 12 lines every 15 degrees

  return (
    <div className="w-64 h-64 sm:w-80 sm:h-80 bg-white rounded-full flex items-center justify-center relative shadow-lg border-4 border-gray-200">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {lines.map((angle) => (
          <line
            key={angle}
            x1="50"
            y1="50"
            x2="50"
            y2="5"
            stroke="black"
            strokeWidth="1"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="2" fill="red" />
      </svg>
    </div>
  );
};

export default function AstigmatismExercisePage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const handleRotate = () => {
    setRotation(prev => (prev + 15) % 360);
  };

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900 text-foreground p-4 sm:p-8">
      <header className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <Link href="/health/eye-care" passHref>
          <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl sm:text-3xl font-headline font-semibold text-primary mb-6">
          {t.pageTitle}
        </h1>
        
        <AstigmatismChart rotation={rotation} />

        <div className="max-w-md mt-8 space-y-3">
          <p className="text-muted-foreground">{t.instruction}</p>
          <p className="text-muted-foreground">{t.instruction_2}</p>
        </div>

        <Button onClick={handleRotate} className="mt-8">
          <RotateCw className="mr-2 h-4 w-4" />
          {t.rotateButton}
        </Button>
      </main>
    </div>
  );
}
