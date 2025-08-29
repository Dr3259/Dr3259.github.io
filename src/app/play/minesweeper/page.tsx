
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Flag, Bomb, Timer, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const translations = {
  'zh-CN': {
    pageTitle: '扫雷',
    backButton: '返回',
    difficulty: '难度',
    easy: '简单',
    medium: '中等',
    hard: '困难',
    mines: '雷数',
    timer: '时间',
    newGame: '新游戏',
    gameOver: '游戏结束',
    youWin: '恭喜！你赢了！',
    playAgain: '再玩一局',
  },
  'en': {
    pageTitle: 'Minesweeper',
    backButton: 'Back',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    mines: 'Mines',
    timer: 'Time',
    newGame: 'New Game',
    gameOver: 'Game Over',
    youWin: 'Congratulations! You Win!',
    playAgain: 'Play Again',
  }
};

type LanguageKey = keyof typeof translations;
type Difficulty = 'easy' | 'medium' | 'hard';

interface CellState {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

const difficultySettings = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

const createEmptyBoard = (rows: number, cols: number): CellState[][] => {
  return Array(rows).fill(null).map(() => 
    Array(cols).fill(null).map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
    }))
  );
};

export default function MinesweeperPage() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [board, setBoard] = useState<CellState[][]>(() => createEmptyBoard(difficultySettings.easy.rows, difficultySettings.easy.cols));
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [firstClick, setFirstClick] = useState(true);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const { rows, cols, mines } = useMemo(() => difficultySettings[difficulty], [difficulty]);

  const initializeGame = useCallback(() => {
    setBoard(createEmptyBoard(rows, cols));
    setGameState('playing');
    setFirstClick(true);
    setTimer(0);
    setIsTimerRunning(false);
  }, [rows, cols]);

  useEffect(() => {
    initializeGame();
  }, [difficulty, initializeGame]);
  
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
        const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
        setCurrentLanguage(browserLang);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && gameState === 'playing') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, gameState]);
  
  const placeMines = (clickedRow: number, clickedCol: number) => {
    let minesPlaced = 0;
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));

    while (minesPlaced < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      
      const isClickArea = Math.abs(r - clickedRow) <= 1 && Math.abs(c - clickedCol) <= 1;

      if (!newBoard[r][c].isMine && !isClickArea) {
        newBoard[r][c].isMine = true;
        minesPlaced++;
      }
    }
    
    // Calculate neighbor mines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) {
                count++;
              }
            }
          }
          newBoard[r][c].neighborMines = count;
        }
      }
    }
    return newBoard;
  };
  
  const revealCell = useCallback((r: number, c: number, currentBoard: CellState[][]): CellState[][] => {
    if (r < 0 || r >= rows || c < 0 || c >= cols || currentBoard[r][c].isRevealed || currentBoard[r][c].isFlagged) {
      return currentBoard;
    }

    const newBoard = currentBoard; // Mutate directly for performance in recursion
    newBoard[r][c].isRevealed = true;

    if (newBoard[r][c].neighborMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          revealCell(r + dr, c + dc, newBoard);
        }
      }
    }
    return newBoard;
  }, [rows, cols]);
  
  const checkWinCondition = (currentBoard: CellState[][]) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!currentBoard[r][c].isMine && !currentBoard[r][c].isRevealed) {
          return;
        }
      }
    }
    setGameState('won');
    setIsTimerRunning(false);
  };

  const handleCellClick = (r: number, c: number) => {
    if (gameState !== 'playing' || board[r][c].isRevealed || board[r][c].isFlagged) return;
    
    let currentBoard = board.map(row => row.map(cell => ({ ...cell })));
    if (firstClick) {
      currentBoard = placeMines(r, c);
      setFirstClick(false);
      setIsTimerRunning(true);
    }
    
    if (currentBoard[r][c].isMine) {
      setGameState('lost');
      setIsTimerRunning(false);
      // Reveal all mines
      const finalBoard = currentBoard.map(row => row.map(cell => ({ ...cell, isRevealed: cell.isMine ? true : cell.isRevealed })));
      finalBoard[r][c].isRevealed = true; // Make sure the clicked one is shown
      setBoard(finalBoard);
      return;
    }
    
    const newBoard = revealCell(r, c, currentBoard);
    setBoard(newBoard);
    checkWinCondition(newBoard);
  };
  
  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState !== 'playing' || board[r][c].isRevealed) return;

    const newBoard = board.map(row => [...row]);
    newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
    setBoard(newBoard);
  };

  const remainingMines = mines - board.flat().filter(cell => cell.isFlagged).length;
  const numberColors = [
    'text-blue-500', 'text-green-600', 'text-red-500', 'text-blue-800 dark:text-blue-300',
    'text-red-800 dark:text-red-400', 'text-teal-500', 'text-black dark:text-gray-200', 'text-gray-500'
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center">
      <header className="w-full max-w-lg mb-6 sm:mb-8">
        <Button variant="outline" size="sm" onClick={() => router.push('/rest/games')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.backButton}
        </Button>
      </header>
      
      <main className="w-full max-w-lg flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-4">
          {t.pageTitle}
        </h1>
        
        <div className="grid grid-cols-3 gap-2 w-full mb-6">
            <Card className="p-2 text-center shadow-sm">
                <CardContent className="p-0">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center justify-center gap-1"><Flag className="h-3 w-3"/>{t.mines}</p>
                    <p className="text-xl font-bold font-mono">{remainingMines}</p>
                </CardContent>
            </Card>
            <Card className="p-2 text-center shadow-sm">
                <CardContent className="p-0">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center justify-center gap-1"><Timer className="h-3 w-3"/>{t.timer}</p>
                    <p className="text-xl font-bold font-mono">{timer}</p>
                </CardContent>
            </Card>
            <Card className="p-2 text-center shadow-sm">
                <CardContent className="p-0">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t.difficulty}</p>
                     <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                        <SelectTrigger className="text-sm font-bold border-none h-auto p-0 focus:ring-0 mt-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">{t.easy}</SelectItem>
                            <SelectItem value="medium">{t.medium}</SelectItem>
                            <SelectItem value="hard">{t.hard}</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
        </div>
        
        <Button onClick={initializeGame} variant="outline" className="w-full mb-6">
            <RotateCcw className="mr-2 h-4 w-4" />
            {t.newGame}
        </Button>
        
        <div 
          className="relative bg-muted p-2 rounded-lg shadow-inner"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div 
            className="grid gap-px"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
            }}
          >
            {board.map((row, rIndex) => 
              row.map((cell, cIndex) => (
                <button
                  key={`${rIndex}-${cIndex}`}
                  onClick={() => handleCellClick(rIndex, cIndex)}
                  onContextMenu={(e) => handleRightClick(e, rIndex, cIndex)}
                  disabled={gameState !== 'playing'}
                  className={cn(
                    "w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-sm font-bold text-lg select-none",
                    "transition-colors duration-75",
                    !cell.isRevealed && "bg-muted/80 border-t-2 border-l-2 border-white/50 border-b-2 border-r-2 border-gray-500/50 hover:bg-accent active:bg-muted",
                    cell.isRevealed && "bg-muted/30 border border-muted/50",
                    cell.isFlagged && !cell.isRevealed && "bg-yellow-200/50",
                    cell.isRevealed && cell.isMine && "bg-red-500"
                  )}
                  aria-label={`Cell at row ${rIndex + 1}, column ${cIndex + 1}`}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? (
                      <Bomb className="h-4 w-4 text-white" />
                    ) : (
                      cell.neighborMines > 0 && <span className={cn("font-mono font-bold text-lg", numberColors[cell.neighborMines - 1])}>{cell.neighborMines}</span>
                    )
                  ) : (
                    cell.isFlagged && <Flag className="h-4 w-4 text-red-600" />
                  )}
                </button>
              ))
            )}
          </div>
          {gameState !== 'playing' && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 animate-in fade-in-50 rounded-lg">
              <div className="bg-card p-8 rounded-lg shadow-xl text-center">
                <h2 className={cn("text-3xl font-bold mb-4", gameState === 'won' ? 'text-green-500' : 'text-destructive')}>
                  {gameState === 'won' ? t.youWin : t.gameOver}
                </h2>
                {gameState === 'won' && <p className="text-lg mb-6">Time: {timer}s</p>}
                <Button onClick={initializeGame} variant="default" size="lg">
                  {t.playAgain}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
