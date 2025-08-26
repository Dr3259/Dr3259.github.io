
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const EYE_CARE_GREEN_LIGHT = 'hsl(130, 50%, 95%)';
const EYE_CARE_GREEN_DARK = 'hsl(130, 20%, 10%)';

const translations = {
  'zh-CN': {
    pageTitle: '眼部放松练习',
    backButton: '返回健康中心',
    instruction: '请用眼睛跟随红点的移动，放松您的眼部肌肉。',
  },
  'en': {
    pageTitle: 'Eye Relaxation Exercise',
    backButton: 'Back to Health Center',
    instruction: 'Please follow the red dot with your eyes to relax your eye muscles.',
  }
};

type LanguageKey = keyof typeof translations;

export default function EyeCarePage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }

    // Set body background color on mount
    const originalBodyColor = document.body.style.backgroundColor;
    const isDarkMode = document.documentElement.classList.contains('dark');
    document.body.style.backgroundColor = isDarkMode ? EYE_CARE_GREEN_DARK : EYE_CARE_GREEN_LIGHT;

    // Revert body background color on unmount
    return () => {
      document.body.style.backgroundColor = originalBodyColor;
    };
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  return (
    <div className="flex flex-col min-h-screen w-full text-foreground transition-colors duration-300">
      <style jsx global>{`
        @keyframes move-dot {
          0%, 100% { top: 50%; left: 50%; }
          10%, 15% { top: 10%; left: 50%; } /* Move Up & Pause */
          25% { top: 50%; left: 50%; } /* Return to Center */
          35%, 40% { top: 50%; left: 90%; } /* Move Right & Pause */
          50% { top: 50%; left: 50%; } /* Return to Center */
          60%, 65% { top: 90%; left: 50%; } /* Move Down & Pause */
          75% { top: 50%; left: 50%; } /* Return to Center */
          85%, 90% { top: 50%; left: 10%; } /* Move Left & Pause */
        }
        .animate-eye-dot {
          animation: move-dot 24s ease-in-out infinite;
        }
      `}</style>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="animate-eye-dot absolute h-6 w-6 bg-red-500 rounded-full shadow-lg"
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      </div>

      <header className="w-full p-4 sm:p-8 absolute top-0 left-0 z-10">
        <Link href="/health" passHref>
          <Button variant="outline" size="sm" className="bg-background/30 backdrop-blur-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>
      
      <main className="w-full flex-grow flex flex-col items-center justify-center text-center p-4">
        <div className="relative z-10 bg-background/30 backdrop-blur-sm p-4 rounded-lg">
            <h1 className="text-2xl sm:text-3xl font-headline font-semibold text-primary mb-3">
              {t.pageTitle}
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl">
              {t.instruction}
            </p>
        </div>
      </main>
    </div>
  );
}
