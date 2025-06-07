
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Coffee, RotateCcw, Puzzle, Gamepad2, Brain, Sigma } from 'lucide-react';

const translations = {
  'zh-CN': {
    title: '休息一下',
    message: '放松心情，伸展一下。片刻之后再回来。',
    backButton: '返回主页',
    entertainmentBreakTitle: '休闲小憩',
    game2048: '2048',
    gameSudoku: '数独',
    gameTetris: '俄罗斯方块',
    gameNumberKlotski: '数字华容道',
  },
  'en': {
    title: 'Take a Break',
    message: 'Relax your mind, stretch your body. Come back in a bit.',
    backButton: 'Back to Home',
    entertainmentBreakTitle: 'Entertainment Break',
    game2048: '2048',
    gameSudoku: 'Sudoku',
    gameTetris: 'Tetris',
    gameNumberKlotski: 'Number Klotski',
  }
};

type LanguageKey = keyof typeof translations;

export default function RestPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN');
  const router = useRouter();

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'zh-CN';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = translations[currentLanguage];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6 text-center">
      <Coffee className="w-24 h-24 text-primary mb-8 animate-pulse" />
      <h1 className="text-4xl font-headline font-semibold text-primary mb-4">
        {t.title}
      </h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-md">
        {t.message}
      </p>

      <section className="w-full max-w-md mb-10">
        <h2 className="text-2xl font-semibold text-primary mb-6">
          {t.entertainmentBreakTitle}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" size="lg" onClick={() => router.push('/play/2048')} className="h-auto py-4">
            <Sigma className="mr-2 h-5 w-5" /> {t.game2048}
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.push('/play/sudoku')} className="h-auto py-4">
            <Brain className="mr-2 h-5 w-5" /> {t.gameSudoku}
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.push('/play/tetris')} className="h-auto py-4">
            <Puzzle className="mr-2 h-5 w-5" /> {t.gameTetris}
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.push('/play/number-klotski')} className="h-auto py-4">
            <Gamepad2 className="mr-2 h-5 w-5" /> {t.gameNumberKlotski}
          </Button>
        </div>
      </section>

      <Link href="/" passHref>
        <Button variant="outline" size="lg">
          <RotateCcw className="mr-2 h-5 w-5" />
          {t.backButton}
        </Button>
      </Link>
    </div>
  );
}
