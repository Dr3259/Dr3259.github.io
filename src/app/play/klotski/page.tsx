
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const translations = {
  'zh-CN': {
    pageTitle: '数字华容道',
    backButton: '返回',
    moves: '步数',
    resetGame: '新游戏',
    youWin: '恭喜你，成功了！',
    playAgain: '再玩一次',
  },
  'en': {
    pageTitle: 'Numeric Klotski',
    backButton: 'Back',
    moves: 'Moves',
    resetGame: 'New Game',
    youWin: 'Congratulations, You Win!',
    playAgain: 'Play Again',
  }
};

type LanguageKey = keyof typeof translations;

const GRID_SIZE = 3; // For a 3x3 puzzle
const EMPTY_TILE = 0;

// --- Game Logic ---

const shuffleArray = (array: number[]): number[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const arrayToBoard = (array: number[], size: number): number[][] => {
  const board: number[][] = [];
  for (let i = 0; i < size; i++) {
    board[i] = array.slice(i * size, (i + 1) * size);
  }
  return board;
};

const findEmptyTile = (board: number[][], size: number): { r: number; c: number } | null => {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === EMPTY_TILE) {
        return { r, c };
      }
    }
  }
  return null;
};

const createSolvableInitialBoard = (size: number): number[][] => {
  const numbers = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
  numbers.push(EMPTY_TILE);

  let shuffledNumbers;
  let boardCandidate: number[][];
  let isSolvableBoard = false;
  let attempts = 0;

  do {
    shuffledNumbers = shuffleArray([...numbers]);
    const flatBoardNoEmptyValue = shuffledNumbers.filter(n => n !== EMPTY_TILE);
    let inversions = 0;
    for (let i = 0; i < flatBoardNoEmptyValue.length; i++) {
      for (let j = i + 1; j < flatBoardNoEmptyValue.length; j++) {
        if (flatBoardNoEmptyValue[i] > flatBoardNoEmptyValue[j]) {
          inversions++;
        }
      }
    }
    
    if (size % 2 !== 0) { 
        isSolvableBoard = inversions % 2 === 0;
    } else { 
        boardCandidate = arrayToBoard(shuffledNumbers, size); 
        const emptyTilePos = findEmptyTile(boardCandidate, size);
        if(emptyTilePos){
            const emptyRowFromBottom = size - emptyTilePos.r; 
            isSolvableBoard = (inversions + emptyRowFromBottom) % 2 !== 0;
        } else {
            isSolvableBoard = false; 
        }
    }
    attempts++;
    if (attempts > 100 && !isSolvableBoard) {
        console.warn("Klotski: Could not generate a solvable board after 100 attempts. Using last attempt, which might be unsolvable.");
        isSolvableBoard = true; // Break loop to avoid infinite loop
    }
  } while (!isSolvableBoard);

  return arrayToBoard(shuffledNumbers!, size); 
};

const checkIsSolved = (board: number[][], size: number): boolean => {
  const solvedFlat = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
  solvedFlat.push(EMPTY_TILE);
  const currentFlat = board.flat();
  for (let i = 0; i < solvedFlat.length; i++) {
    if (currentFlat[i] !== solvedFlat[i]) {
      return false;
    }
  }
  return true;
};

// Helper to generate a board that is solvable AND not already solved
const generateUnsolvedSolvableBoard = (): number[][] => {
  let newBoard;
  let attempts = 0;
  const maxAttempts = 25; // Prevent potential infinite loop in very rare cases
  do {
    newBoard = createSolvableInitialBoard(GRID_SIZE);
    attempts++;
  } while (checkIsSolved(newBoard, GRID_SIZE) && attempts < maxAttempts);

  if (checkIsSolved(newBoard, GRID_SIZE) && attempts >= maxAttempts) {
    // Fallback: if still solved, create a simple, manually unsolved but solvable board
    console.warn("Klotski: Generated a solved board repeatedly. Using a manual fallback.");
    const solvedBase = Array.from({ length: GRID_SIZE * GRID_SIZE - 1 }, (_, i) => i + 1).concat(EMPTY_TILE);
    const fallbackBoardArray = arrayToBoard(solvedBase, GRID_SIZE);
    // Make one valid move from solved state: swap last number with empty tile
    if (GRID_SIZE > 1) {
        const lastNum = GRID_SIZE * GRID_SIZE - 1;
        const emptyR = GRID_SIZE - 1;
        const emptyC = GRID_SIZE - 1;
        const lastNumR = GRID_SIZE - 1;
        const lastNumC = GRID_SIZE - 2;
        
        fallbackBoardArray[emptyR][emptyC] = lastNum; // Place last number where empty was
        fallbackBoardArray[lastNumR][lastNumC] = EMPTY_TILE; // Place empty where last number was
    }
    return fallbackBoardArray;
  }
  return newBoard;
};


export default function KlotskiPage() {
  const router = useRouter(); // Initialize router
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [board, setBoard] = useState<number[][]>(() => generateUnsolvedSolvableBoard());
  const [moves, setMoves] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const initializeNewGame = useCallback(() => {
    setBoard(generateUnsolvedSolvableBoard());
    setMoves(0);
    setIsGameWon(false); 
  }, []);

  // Effect for setting language and mounted state
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
    setIsMounted(true);
  }, []);

  const moveTile = useCallback((rClicked: number, cClicked: number) => {
    if (isGameWon || !isMounted || board[rClicked][cClicked] === EMPTY_TILE) return;
  
    const emptyTilePos = findEmptyTile(board, GRID_SIZE);
    if (!emptyTilePos) return;
  
    const { r: rEmpty, c: cEmpty } = emptyTilePos;
  
    const isAdjacent =
      (Math.abs(rClicked - rEmpty) === 1 && cClicked === cEmpty) ||
      (Math.abs(cClicked - cEmpty) === 1 && rClicked === rEmpty);
  
    if (isAdjacent) {
      const newBoard = board.map(row => [...row]);
      [newBoard[rClicked][cClicked], newBoard[rEmpty][cEmpty]] =
        [newBoard[rEmpty][cEmpty], newBoard[rClicked][cClicked]];
  
      setBoard(newBoard);
      setMoves(prevMoves => prevMoves + 1);
    }
  }, [board, isGameWon, isMounted]);

  // Effect for checking win condition
  useEffect(() => {
    if (!isMounted) return;

    if (checkIsSolved(board, GRID_SIZE)) {
      if (board.flat().some(tile => tile !== EMPTY_TILE || board.flat().length === GRID_SIZE * GRID_SIZE )) {
          setIsGameWon(true);
      }
    }
  }, [board, isMounted]);


  const handleTileClick = useCallback((rClicked: number, cClicked: number) => {
    moveTile(rClicked, cClicked);
  }, [moveTile]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isGameWon) return;

    const emptyTilePos = findEmptyTile(board, GRID_SIZE);
    if (!emptyTilePos) return;

    const { r, c } = emptyTilePos;
    let targetR = r;
    let targetC = c;
    
    // Corrected logic: The key indicates which tile to move *into* the empty space
    switch (event.key) {
      case 'ArrowUp':
        targetR = r + 1; // Tile below the empty space moves up
        break;
      case 'ArrowDown':
        targetR = r - 1; // Tile above the empty space moves down
        break;
      case 'ArrowLeft':
        targetC = c + 1; // Tile to the right of the empty space moves left
        break;
      case 'ArrowRight':
        targetC = c - 1; // Tile to the left of the empty space moves right
        break;
      default:
        return;
    }
    
    event.preventDefault();

    if (targetR >= 0 && targetR < GRID_SIZE && targetC >= 0 && targetC < GRID_SIZE) {
      moveTile(targetR, targetC);
    }
  }, [board, isGameWon, moveTile]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);


  if (!isMounted) {
      return (
        <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center justify-center">
            <p>Loading Klotski...</p>
        </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center">
      <header className="w-full max-w-sm mb-6 sm:mb-8">
        <Button variant="outline" size="sm" onClick={() => router.push('/rest/games')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.backButton}
        </Button>
      </header>

      <main className="w-full max-w-sm flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-4">
          {t.pageTitle}
        </h1>

        <div className="flex justify-between items-center w-full mb-6">
            <Card className="p-2 text-center w-24 shadow-sm">
                <CardContent className="p-0">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t.moves}</p>
                    <p className="text-xl font-bold">{moves}</p>
                </CardContent>
            </Card>
            <Button onClick={initializeNewGame} variant="outline" size="sm">
                <RotateCcw className="mr-2 h-4 w-4" />
                {t.resetGame}
            </Button>
        </div>

        <div 
          className="grid gap-1 p-1 bg-gray-400 dark:bg-gray-800 rounded-lg shadow-md mb-6 relative w-full"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            maxWidth: '320px', 
            aspectRatio: '1 / 1'
          }}
        >
          {board.map((row, rIndex) =>
            row.map((tileValue, cIndex) => (
              <button
                key={`${rIndex}-${cIndex}`}
                onClick={() => handleTileClick(rIndex, cIndex)}
                disabled={isGameWon || tileValue === EMPTY_TILE || !isMounted}
                className={cn(
                  "flex items-center justify-center rounded aspect-square text-xl sm:text-2xl font-bold transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-background",
                  tileValue === EMPTY_TILE 
                    ? "bg-gray-300/60 dark:bg-gray-700/60 cursor-default opacity-80" 
                    : "bg-primary/80 text-primary-foreground hover:bg-primary active:bg-primary/90 focus:ring-primary",
                  isGameWon && tileValue !== EMPTY_TILE ? "bg-green-500 hover:bg-green-500 focus:ring-green-600" : "",
                   "disabled:opacity-70 disabled:cursor-not-allowed"
                )}
                aria-label={tileValue === EMPTY_TILE ? "Empty space" : `Tile ${tileValue}`}
              >
                {tileValue !== EMPTY_TILE ? tileValue : ''}
              </button>
            ))
          )}
           {isGameWon && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10 animate-in fade-in-50 rounded-lg">
              <div className="bg-card p-6 sm:p-8 rounded-lg shadow-xl text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-green-500 mb-3">{t.youWin}</h2>
                <p className="text-lg mb-4">{t.moves}: {moves}</p>
                <Button onClick={initializeNewGame} variant="default" size="lg" className="px-6 py-3 text-base">
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

