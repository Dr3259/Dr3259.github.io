
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const translations = {
  'zh-CN': {
    pageTitle: '数字华容道',
    backButton: '返回休息区',
    moves: '步数',
    resetGame: '重置游戏',
    youWin: '恭喜你，成功了！',
    playAgain: '再玩一次',
  },
  'en': {
    pageTitle: 'Numeric Klotski',
    backButton: 'Back to Rest Area',
    moves: 'Moves',
    resetGame: 'Reset Game',
    youWin: 'Congratulations, You Win!',
    playAgain: 'Play Again',
  }
};

type LanguageKey = keyof typeof translations;

const GRID_SIZE = 3; // For a 3x3 puzzle
const EMPTY_TILE = 0;

// --- Game Logic ---

// Fisher-Yates shuffle for a 1D array
const shuffleArray = (array: number[]): number[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Converts 1D array to 2D board
const arrayToBoard = (array: number[], size: number): number[][] => {
  const board: number[][] = [];
  for (let i = 0; i < size; i++) {
    board[i] = array.slice(i * size, (i + 1) * size);
  }
  return board;
};

// Generates an initial shuffled board.
// For an N*N puzzle, a common way to ensure solvability is to check the number of inversions.
// An inversion is any pair of tiles (a, b) such that a appears before b in the flat list of tiles,
// but a > b. The empty square is not counted.
// - If grid width is odd, the puzzle is solvable if the number of inversions is even.
// - If grid width is even, the puzzle is solvable if (number of inversions + row of empty square, counted from bottom, 1-indexed) is odd.
// This function attempts to create a solvable board by shuffling until a solvable one is found.
const createSolvableInitialBoard = (size: number): number[][] => {
  const numbers = Array.from({ length: size * size -1 }, (_, i) => i + 1);
  numbers.push(EMPTY_TILE);

  let shuffledNumbers;
  let boardCandidate: number[][];
  let isSolvableBoard = false;

  // Loop until a solvable board is generated (important for larger grids, less so for 3x3 but good practice)
  // For 3x3, most shuffles are solvable if we aim for empty tile in last position.
  // The check here is simplified: we will rely on the standard goal where empty tile is last.
  // A more robust check for general N*N would count inversions properly.
  // For 3x3, we check if inversion count is even (as grid width is odd).
  do {
    shuffledNumbers = shuffleArray([...numbers]); // Create a new shuffle each time
    boardCandidate = arrayToBoard(shuffledNumbers, size);

    // Calculate inversions (ignoring the empty tile)
    const flatBoardNoEmpty = shuffledNumbers.filter(n => n !== EMPTY_TILE);
    let inversions = 0;
    for (let i = 0; i < flatBoardNoEmpty.length; i++) {
      for (let j = i + 1; j < flatBoardNoEmpty.length; j++) {
        if (flatBoardNoEmpty[i] > flatBoardNoEmpty[j]) {
          inversions++;
        }
      }
    }
    
    // For a 3x3 grid (odd width), the number of inversions must be even.
    if (size % 2 !== 0) { // Odd grid width
        isSolvableBoard = inversions % 2 === 0;
    } else { // Even grid width (e.g. 4x4) - more complex rule involving blank row
        // For simplicity, we'll assume this simplified shuffle is enough for 3x3.
        // A full solvability check for even grids is more involved.
        // For 3x3, this part is not hit, but kept for structure.
        const emptyTilePos = findEmptyTile(boardCandidate, size);
        if(emptyTilePos){
            const emptyRowFromBottom = size - emptyTilePos.r; // 1-indexed from bottom
            isSolvableBoard = (inversions + emptyRowFromBottom) % 2 !== 0;
        } else {
            isSolvableBoard = false; // Should not happen if EMPTY_TILE is in numbers
        }
    }
    // For 3x3, this simpler check is often sufficient.
    // If after many tries we don't get a solvable, it means the solvability logic has issues or bad luck.
    // We can add a counter to break the loop if needed. For now, let's assume it finds one quickly for 3x3.
  } while (!isSolvableBoard);


  return arrayToBoard(shuffledNumbers, size);
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

const checkIsSolved = (board: number[][], size: number): boolean => {
  const solvedFlat = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
  solvedFlat.push(EMPTY_TILE); // Solved state has empty tile at the end
  
  const currentFlat = board.flat();
  
  for (let i = 0; i < solvedFlat.length; i++) {
    if (currentFlat[i] !== solvedFlat[i]) {
      return false;
    }
  }
  return true;
};


export default function KlotskiPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [board, setBoard] = useState<number[][]>(() => createSolvableInitialBoard(GRID_SIZE));
  const [moves, setMoves] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const initializeNewGame = useCallback(() => {
    setBoard(createSolvableInitialBoard(GRID_SIZE));
    setMoves(0);
    setIsGameWon(false);
  }, []);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
    // Initialize board on mount, but state initializer already does it
    // This ensures resetGame can be called and also sets mounted state
    setIsMounted(true); 
    if (checkIsSolved(board, GRID_SIZE)) { // Check if initial shuffle is already solved
        setIsGameWon(true);
    }
  }, [board]); // Add board to deps for checking if initial is solved

  const handleTileClick = useCallback((rClicked: number, cClicked: number) => {
    if (isGameWon || !isMounted || board[rClicked][cClicked] === EMPTY_TILE) return;

    const emptyTilePos = findEmptyTile(board, GRID_SIZE);
    if (!emptyTilePos) return;

    const { r: rEmpty, c: cEmpty } = emptyTilePos;

    // Check if the clicked tile is adjacent to the empty tile
    const isAdjacent = 
      (Math.abs(rClicked - rEmpty) === 1 && cClicked === cEmpty) ||
      (Math.abs(cClicked - cEmpty) === 1 && rClicked === rEmpty);

    if (isAdjacent) {
      const newBoard = board.map(row => [...row]);
      // Swap tiles
      [newBoard[rClicked][cClicked], newBoard[rEmpty][cEmpty]] = 
        [newBoard[rEmpty][cEmpty], newBoard[rClicked][cClicked]];
      
      setBoard(newBoard);
      const newMoves = moves + 1;
      setMoves(newMoves);

      if (checkIsSolved(newBoard, GRID_SIZE)) {
        setIsGameWon(true);
      }
    }
  }, [board, moves, isGameWon, isMounted]);


  if (!isMounted) {
      return (
        <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center justify-center">
            <p>Loading Klotski...</p>
        </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center">
      <header className="w-full max-w-xs sm:max-w-sm md:max-w-md mb-6 sm:mb-8">
        <Link href="/rest" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-4">
          {t.pageTitle}
        </h1>

        <div className="flex justify-between items-center w-full mb-6 px-1">
          <div className="text-lg">
            <span className="font-semibold">{t.moves}: </span>
            <span>{moves}</span>
          </div>
          <Button onClick={initializeNewGame} variant="default" size="sm">
            <RotateCcw className="mr-2 h-4 w-4" />
            {t.resetGame}
          </Button>
        </div>

        <div 
          className="grid gap-1 p-1 bg-gray-400 dark:bg-gray-800 rounded-lg shadow-md mb-6 relative"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(100%, 280px)', 
            height: 'min(100vw - 60px, 280px)' 
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
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 rounded-lg">
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

