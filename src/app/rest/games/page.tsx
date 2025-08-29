"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GameCard } from '@/components/GameCard';
import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';

const Hash = dynamic(() => import('lucide-react').then(mod => mod.Hash));
const Puzzle = dynamic(() => import('lucide-react').then(mod => mod.Puzzle));
const Blocks = dynamic(() => import('lucide-react').then(mod => mod.Blocks));
const Grid3x3 = dynamic(() => import('lucide-react').then(mod => mod.Grid3x3));
const Bomb = dynamic(() => import('lucide-react').then(mod => mod.Bomb));

const translations = {
  'zh-CN': {
    pageTitle: '小游戏',
    backButton: '返回休息一下',
    game2048: '2048',
    gameKlotski: '华容道',
    gameTetris: '俄罗斯方块',
    gameSudoku: '数独',
    gameMinesweeper: '扫雷',
  },
  'en': {
    pageTitle: 'Mini Games',
    backButton: 'Back to Rest Area',
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
  
  const games = [
      { id: '2048', title: t.game2048, icon: Hash, path: '/play/2048' },
      { id: 'klotski', title: t.gameKlotski, icon: Puzzle, path: '/play/klotski' },
      { id: 'tetris', title: t.gameTetris, icon: Blocks, path: '/play/tetris' },
      { id: 'sudoku', title: t.gameSudoku, icon: Grid3x3, path: '/play/sudoku' },
      { id: 'minesweeper', title: t.gameMinesweeper, icon: Bomb, path: '/play/minesweeper' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 sm:py-16 px-4">
      <header className="w-full max-w-5xl mb-8 sm:mb-12 self-center">
        <Link href="/rest" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-5xl flex flex-col self-center flex-grow items-center">
        <h1 className="text-2xl sm:text-3xl font-headline font-semibold text-primary mb-6 sm:mb-8">
          {t.pageTitle}
        </h1>
        
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {games.map(game => (
                <div key={game.id} className="w-full">
                    <GameCard 
                        title={game.title}
                        icon={game.icon} 
                        isSmall 
                        onClick={() => handleGameClick(game.path)} 
                        ariaLabel={game.title}
                    />
                </div>
            ))}
        </div>
      </main>
    </div>
  );
}
