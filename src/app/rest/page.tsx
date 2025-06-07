
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";
import { ArrowLeft, Hash, Puzzle, Blocks, Grid3x3, Bomb } from 'lucide-react';
import { cn } from '@/lib/utils';

const translations = {
  'zh-CN': {
    backButton: '返回主页',
    miniGamesTitle: '小游戏驿站',
    game2048: '2048',
    gameKlotski: '华容道',
    gameTetris: '俄罗斯方块',
    gameSudoku: '数独',
    gameMinesweeper: '扫雷',
  },
  'en': {
    backButton: 'Back to Home',
    miniGamesTitle: 'Mini Game Station',
    game2048: '2048',
    gameKlotski: 'Klotski',
    gameTetris: 'Tetris',
    gameSudoku: 'Sudoku',
    gameMinesweeper: 'Minesweeper',
  }
};

type LanguageKey = keyof typeof translations;

interface GameCardProps {
  title: string;
  icon: React.ElementType;
  isSmall?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

const GameCard: React.FC<GameCardProps> = ({ title, icon: Icon, isSmall, onClick, ariaLabel }) => {
  return (
    <Card
      className={cn(
        "flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-accent/30 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105",
        isSmall ? "h-28 w-28 sm:h-32 sm:w-32" : "h-36 w-full sm:h-40",
      )}
      onClick={onClick}
      role="button"
      aria-label={ariaLabel || title}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.();}}
    >
      <Icon className={cn("mb-2 text-primary", isSmall ? "w-10 h-10 sm:w-12 sm:h-12" : "w-12 h-12 sm:w-16 sm:h-16")} />
      <p className={cn("font-medium text-foreground", isSmall ? "text-xs sm:text-sm" : "text-sm sm:text-base")}>{title}</p>
    </Card>
  );
};


export default function RestPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN');
  const router = useRouter(); // Initialize router

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'zh-CN';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = translations[currentLanguage];

  const handleGameClick = (gamePath: string) => {
    router.push(gamePath);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 sm:py-16 px-4">
      <header className="w-full max-w-xl mb-8 sm:mb-12 self-center">
        <Link href="/" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-xl flex flex-col self-center flex-grow items-center">
        <h2 className="text-2xl sm:text-3xl font-headline font-semibold text-primary mb-6 sm:mb-8">
          {t.miniGamesTitle}
        </h2>
        
        <div className="grid grid-cols-3 gap-4 sm:gap-5 w-full max-w-lg">
          {/* Row 1 */}
          <GameCard title={t.game2048} icon={Hash} onClick={() => handleGameClick('/play/2048')} ariaLabel={t.game2048} />
          <GameCard title={t.gameKlotski} icon={Puzzle} onClick={() => handleGameClick('/play/klotski')} ariaLabel={t.gameKlotski} />
          <GameCard title={t.gameTetris} icon={Blocks} onClick={() => handleGameClick('/play/tetris')} ariaLabel={t.gameTetris} />
          
          {/* Row 2 */}
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
