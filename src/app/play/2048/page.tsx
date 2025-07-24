
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const translations = {
  'zh-CN': {
    pageTitle: '2048 游戏',
    backButton: '返回休息区',
    score: '分数',
    highScore: '最高分',
    newGameButton: '新游戏',
    gameOverTitle: '游戏结束!',
    tryAgainButton: '再试一次?',
  },
  'en': {
    pageTitle: '2048 Game',
    backButton: 'Back to Rest Area',
    score: 'Score',
    highScore: 'High Score',
    newGameButton: 'New Game',
    gameOverTitle: 'Game Over!',
    tryAgainButton: 'Try Again?',
  }
};

type LanguageKey = keyof typeof translations;

const GRID_SIZE = 4;
const LOCAL_STORAGE_KEY_HIGH_SCORE = '2048HighScore';

// Tile styles based on value
const TILE_STYLES: Record<number, string> = {
  2: "bg-slate-200 text-slate-800",
  4: "bg-orange-200 text-orange-800",
  8: "bg-orange-400 text-white",
  16: "bg-orange-500 text-white",
  32: "bg-red-400 text-white",
  64: "bg-red-500 text-white",
  128: "bg-yellow-300 text-yellow-800 text-xl",
  256: "bg-yellow-400 text-yellow-900 text-xl",
  512: "bg-yellow-500 text-white text-xl",
  1024: "bg-purple-400 text-white text-lg",
  2048: "bg-purple-600 text-white text-lg",
  4096: "bg-indigo-600 text-white text-lg",
  8192: "bg-teal-600 text-white text-lg",
};
const EMPTY_CELL_STYLE = "bg-gray-300/60 dark:bg-gray-700/60";
const BASE_TILE_TEXT_STYLE = "text-2xl font-bold";

// Helper function to create an empty board
const createEmptyBoard = (): number[][] => {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
};

// Helper function to get empty cells
const getEmptyCells = (board: number[][]): { r: number; c: number }[] => {
  const emptyCells: { r: number; c: number }[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (board[r][c] === 0) {
        emptyCells.push({ r, c });
      }
    }
  }
  return emptyCells;
};

// Helper function to add a random tile (2 or 4)
const addRandomTile = (board: number[][]): number[][] => {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) {
    return board; // No space left
  }
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newBoard = board.map(row => [...row]);
  newBoard[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
};

// Game Logic functions
const slideAndMergeRow = (row: number[]): { newRow: number[]; scoreAdded: number; moved: boolean } => {
  const initialRowString = JSON.stringify(row);
  let scoreAdded = 0;

  // 1. Filter out zeros (slide)
  let filteredRow = row.filter(val => val !== 0);
  
  // 2. Merge
  for (let i = 0; i < filteredRow.length - 1; i++) {
    if (filteredRow[i] === filteredRow[i + 1]) {
      filteredRow[i] *= 2;
      scoreAdded += filteredRow[i];
      filteredRow[i + 1] = 0;
    }
  }

  // 3. Filter out zeros again after merge
  filteredRow = filteredRow.filter(val => val !== 0);

  // 4. Pad with zeros to the right
  const newRow = Array(GRID_SIZE).fill(0);
  for (let i = 0; i < filteredRow.length; i++) {
    newRow[i] = filteredRow[i];
  }
  
  const moved = JSON.stringify(newRow) !== initialRowString;
  return { newRow, scoreAdded, moved };
};

const moveLeft = (board: number[][]): { newBoard: number[][]; scoreAdded: number; moved: boolean } => {
  let totalScoreAdded = 0;
  let overallMoved = false;
  const newBoard = board.map(row => {
    const { newRow, scoreAdded, moved } = slideAndMergeRow(row);
    totalScoreAdded += scoreAdded;
    if (moved) overallMoved = true;
    return newRow;
  });
  return { newBoard, scoreAdded: totalScoreAdded, moved: overallMoved };
};

const moveRight = (board: number[][]): { newBoard: number[][]; scoreAdded: number; moved: boolean } => {
  let totalScoreAdded = 0;
  let overallMoved = false;
  const newBoard = board.map(row => {
    const reversedRow = [...row].reverse();
    const { newRow: slidReversedRow, scoreAdded, moved } = slideAndMergeRow(reversedRow);
    totalScoreAdded += scoreAdded;
    if (moved) overallMoved = true;
    return slidReversedRow.reverse();
  });
  return { newBoard, scoreAdded: totalScoreAdded, moved: overallMoved };
};

// Transpose the board (rows become columns and vice-versa)
const transposeBoard = (board: number[][]): number[][] => {
  const newBoard = createEmptyBoard();
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      newBoard[c][r] = board[r][c];
    }
  }
  return newBoard;
};

const moveUp = (board: number[][]): { newBoard: number[][]; scoreAdded: number; moved: boolean } => {
  const transposed = transposeBoard(board);
  const { newBoard: movedTransposed, scoreAdded, moved } = moveLeft(transposed);
  return { newBoard: transposeBoard(movedTransposed), scoreAdded, moved };
};

const moveDown = (board: number[][]): { newBoard: number[][]; scoreAdded: number; moved: boolean } => {
  const transposed = transposeBoard(board);
  const { newBoard: movedTransposed, scoreAdded, moved } = moveRight(transposed);
  return { newBoard: transposeBoard(movedTransposed), scoreAdded, moved };
};

const canMove = (board: number[][]): boolean => {
  if (getEmptyCells(board).length > 0) return true;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (c < GRID_SIZE - 1 && board[r][c] === board[r][c + 1]) return true;
      if (r < GRID_SIZE - 1 && board[r][c] === board[r + 1][c]) return true;
    }
  }
  return false;
};


export default function Game2048Page() {
  const router = useRouter(); // Initialize router
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [board, setBoard] = useState<number[][]>(createEmptyBoard());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isMounted, setIsMounted] = useState(false);


  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const initializeGame = useCallback(() => {
    let newBoard = createEmptyBoard();
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
    
    // Load high score from localStorage
    if (typeof window !== 'undefined') {
        const storedHighScore = localStorage.getItem(LOCAL_STORAGE_KEY_HIGH_SCORE);
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore, 10));
        }
    }

    initializeGame();
    setIsMounted(true);
  }, [initializeGame]);

  // Update high score if current score is higher
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY_HIGH_SCORE, score.toString());
      }
    }
  }, [score, highScore]);
  
  const checkAndUpdateHighScore = (currentScore: number) => {
    if (currentScore > highScore) {
      setHighScore(currentScore);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY_HIGH_SCORE, currentScore.toString());
      }
    }
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameOver) return;

    let result: { newBoard: number[][]; scoreAdded: number; moved: boolean } | null = null;

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        result = moveUp(board);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        result = moveDown(board);
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        result = moveLeft(board);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        result = moveRight(board);
        break;
      default:
        return; // Ignore other keys
    }
    event.preventDefault(); // Prevent page scrolling

    if (result && result.moved) {
      const boardWithNewTile = addRandomTile(result.newBoard);
      setBoard(boardWithNewTile);
      const newScore = score + result.scoreAdded;
      setScore(newScore);
      checkAndUpdateHighScore(newScore);

      if (!canMove(boardWithNewTile)) {
        setGameOver(true);
        checkAndUpdateHighScore(newScore); // Final check on game over
      }
    } else if (result && !result.moved) {
      // Check for game over even if no tiles moved, in case the board is full
       if (!canMove(board)) {
        setGameOver(true);
        checkAndUpdateHighScore(score); // Final check on game over
      }
    }
  }, [board, gameOver, score, highScore]); 

  useEffect(() => {
    if (!isMounted) return; 
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress, isMounted]);

  const getTileStyle = (value: number) => {
    return TILE_STYLES[value] || EMPTY_CELL_STYLE;
  };
  
  const getTileTextStyle = (value: number) => {
    let style = "text-xl sm:text-2xl font-bold";
    if (value >= 128 && value < 1024) style = cn(style, "text-lg sm:text-xl");
    else if (value >= 1024) style = cn(style, "text-base sm:text-lg");
    if (value >= 10000) style = cn(style, "text-sm sm:text-base"); // for very large numbers
    return style;
  }


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center">
      <header className="w-full max-w-sm mb-6 sm:mb-8">
        <Button variant="outline" size="sm" onClick={() => router.push('/rest')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.backButton}
        </Button>
      </header>

      <main className="w-full max-w-sm flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-4">
          {t.pageTitle}
        </h1>

        <div className="flex justify-between items-center w-full mb-6 px-2">
          <div className="text-base sm:text-lg space-x-2 sm:space-x-4">
            <span>
                <span className="font-semibold">{t.score}: </span>
                <span>{score}</span>
            </span>
            <span>
                <span className="font-semibold">{t.highScore}: </span>
                <span>{highScore}</span>
            </span>
          </div>
          <Button onClick={initializeGame} variant="default" size="sm">
            {t.newGameButton}
          </Button>
        </div>

        <div 
          className="grid grid-cols-4 gap-2 p-2 bg-gray-400 dark:bg-gray-800 rounded-lg shadow-md mb-6 w-full"
          style={{ maxWidth: '400px', aspectRatio: '1 / 1' }} 
        >
          {board.map((row, rIndex) =>
            row.map((value, cIndex) => (
              <div
                key={`${rIndex}-${cIndex}`}
                className={cn(
                  "flex items-center justify-center rounded aspect-square",
                  "transition-colors duration-100",
                  getTileStyle(value),
                )}
              >
                {value > 0 && (
                  <span className={cn(getTileTextStyle(value))}>
                    {value}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
            <div className="bg-card p-8 rounded-lg shadow-xl text-center">
              <h2 className="text-3xl font-bold text-destructive mb-4">{t.gameOverTitle}</h2>
              <p className="text-xl mb-2">{t.score}: {score}</p>
              <p className="text-lg mb-6">{t.highScore}: {highScore}</p>
              <Button onClick={initializeGame} variant="default" size="lg">
                {t.tryAgainButton}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
