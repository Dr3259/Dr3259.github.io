
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
// useRouter was removed as it's not used
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const translations = {
  'zh-CN': {
    backButton: '返回主页',
    // title and message removed
    // entertainmentBreakTitle and game names were already removed
  },
  'en': {
    backButton: 'Back to Home',
    // title and message removed
    // entertainmentBreakTitle and game names were already removed
  }
};

type LanguageKey = keyof typeof translations;

export default function RestPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'zh-CN';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = translations[currentLanguage];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 sm:py-16 px-4">
      <header className="w-full max-w-lg mb-8 sm:mb-12 self-center">
        <Link href="/" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-lg flex flex-col self-center flex-grow">
        {/* Placeholder boxes as per the image */}
        <div className="grid grid-cols-3 gap-6 w-full">
          {/* Row 1 */}
          <div className="col-span-1 h-32 border border-border rounded-xl bg-card"></div>
          <div className="col-span-1 h-32 border border-border rounded-xl bg-card"></div>
          <div className="col-span-1 h-32 border border-border rounded-xl bg-card"></div>
          
          {/* Row 2 */}
          <div className="col-span-1 h-32 border border-border rounded-xl bg-card"></div>
          <div className="col-span-1 flex items-start justify-start"> {/* Cell for the smaller box */}
            <div className="h-24 w-24 border border-border rounded-xl bg-card"></div>
          </div>
          {/* Empty cell for the 6th position in a 3x2 grid */}
          <div className="col-span-1"></div> 
        </div>
      </main>
    </div>
  );
}
