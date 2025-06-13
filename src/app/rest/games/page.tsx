
"use client";

import { useState, useEffect, useCallback } from 'react'; // Added useCallback
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GameCard } from '@/components/GameCard';
import { ArrowLeft, Hash, Puzzle, Blocks, Grid3x3, Bomb } from 'lucide-react';

const translations = {
  'zh-CN': {
    pageTitle: '小游戏列表',
    backButton: '返回游戏驿站',
    game2048: '2048',
    gameKlotski: '华容道',
    gameTetris: '俄罗斯方块',
    gameSudoku: '数独',
    gameMinesweeper: '扫雷',
  },
  'en': {
    pageTitle: 'Mini Games List',
    backButton: 'Back to Game Station',
    game2048: '2048',
    gameKlotski: 'Klotski',
    gameTetris: 'Tetris',
    gameSudoku: 'Sudoku',
    gameMinesweeper: 'Minesweeper',
  }
};

type LanguageKey = keyof typeof translations;

export default function GamesListPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN');
  const router = useRouter();

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'zh-CN';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = translations[currentLanguage];

  const handleGameClick = useCallback((gamePath: string) => {
    router.push(gamePath);
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 sm:py-16 px-4">
      <header className="w-full max-w-xl mb-8 sm:mb-12 self-center">
        <Link href="/rest" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-xl flex flex-col self-center flex-grow items-center">
        <h1 className="text-2xl sm:text-3xl font-headline font-semibold text-primary mb-6 sm:mb-8">
          {t.pageTitle}
        </h1>
        
        <div className="grid grid-cols-3 gap-4 sm:gap-5 w-full max-w-lg">
          <GameCard title={t.game2048} icon={Hash} onClick={() => handleGameClick('/play/2048')} ariaLabel={t.game2048} />
          <GameCard title={t.gameKlotski} icon={Puzzle} onClick={() => handleGameClick('/play/klotski')} ariaLabel={t.gameKlotski} />
          <GameCard title={t.gameTetris} icon={Blocks} onClick={() => handleGameClick('/play/tetris')} ariaLabel={t.gameTetris} />
          <GameCard title={t.gameSudoku} icon={Grid3x3} onClick={() => handleGameClick('/play/sudoku')} ariaLabel={t.gameSudoku} />
          <div className="col-span-1 flex items-center justify-center sm:items-start sm:justify-start">
            <GameCard title={t.gameMinesweeper} icon={Bomb} isSmall={true} onClick={() => handleGameClick('/play/minesweeper')} ariaLabel={t.gameMinesweeper} />
          </div>
          <div className="col-span-1 hidden sm:block"></div> 
        </div>
      </main>
    </div>
  );
}
