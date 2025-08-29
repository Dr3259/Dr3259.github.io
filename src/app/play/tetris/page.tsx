
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const translations = {
  'zh-CN': {
    pageTitle: '俄罗斯方块',
    backButton: '返回',
    score: '分数',
    level: '等级',
    lines: '行数',
    newGameButton: '新游戏',
    gameOverTitle: '游戏结束!',
    playAgainButton: '再玩一次',
    next: '下一个',
  },
  'en': {
    pageTitle: 'Tetris',
    backButton: 'Back',
    score: 'Score',
    level: 'Level',
    lines: 'Lines',
    newGameButton: 'New Game',
    gameOverTitle: 'Game Over!',
    playAgainButton: 'Play Again',
    next: 'Next',
  }
};

type LanguageKey = keyof typeof translations;

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;

type TetrominoShape = (0 | 1)[][];
type Board = (string | 0)[][];

const TETROMINOS: { [key: string]: { shape: TetrominoShape, color: string } } = {
  I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-500' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-600' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-500' },
  O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-400' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-600' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500' },
};

const tetrominoKeys = Object.keys(TETROMINOS);

const createEmptyBoard = (): Board => Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));

const getRandomTetromino = () => {
  const key = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)];
  return TETROMINOS[key];
};

const checkCollision = (tetromino: TetrominoShape, pos: { x: number, y: number }, board: Board): boolean => {
  for (let y = 0; y < tetromino.length; y++) {
    for (let x = 0; x < tetromino[y].length; x++) {
      if (tetromino[y][x]) {
        const boardY = y + pos.y;
        const boardX = x + pos.x;
        if (
          boardY >= GRID_HEIGHT ||
          boardX < 0 ||
          boardX >= GRID_WIDTH ||
          (boardY >= 0 && board[boardY] && board[boardY][boardX] !== 0)
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export default function TetrisPage() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentTetromino, setCurrentTetromino] = useState<{ shape: TetrominoShape, color: string, pos: { x: number, y: number } } | null>(null);
  const [nextTetromino, setNextTetromino] = useState<{ shape: TetrominoShape, color: string } | null>(null);
  const [score, setScore] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const [level, setLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [dropInterval, setDropInterval] = useState(1000);
  const [isMounted, setIsMounted] = useState(false);
  
  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const resetPlayer = useCallback(() => {
    const newCurrent = nextTetromino || getRandomTetromino();
    const newNext = getRandomTetromino();

    const spawnPos = { x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 };
    
    // Use the *current* board state to check for collision at spawn.
    // If it collides, it's game over.
    if (checkCollision(newCurrent.shape, spawnPos, board)) {
      setGameOver(true);
      return;
    }

    setCurrentTetromino({ ...newCurrent, pos: spawnPos });
    setNextTetromino(newNext);
  }, [nextTetromino, board]);


  const initializeGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLinesCleared(0);
    setLevel(0);
    setDropInterval(1000);
    setGameOver(false);
    
    // Initialize the first two pieces
    const firstPiece = getRandomTetromino();
    const secondPiece = getRandomTetromino();
    setCurrentTetromino({
      ...firstPiece,
      pos: { x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 },
    });
    setNextTetromino(secondPiece);

  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
    initializeGame();
    setIsMounted(true);
  }, [initializeGame]);
  
  const moveTetromino = (dx: number, dy: number) => {
    if (!currentTetromino) return;
    const newPos = { x: currentTetromino.pos.x + dx, y: currentTetromino.pos.y + dy };
    if (!checkCollision(currentTetromino.shape, newPos, board)) {
      setCurrentTetromino({ ...currentTetromino, pos: newPos });
      return true;
    }
    return false;
  };
  
  const rotateTetromino = () => {
    if (!currentTetromino) return;
    const shape = currentTetromino.shape;
    const newShape: TetrominoShape = shape[0].map((_, colIndex) => shape.map(row => row[colIndex]).reverse());
    if (!checkCollision(newShape, currentTetromino.pos, board)) {
      setCurrentTetromino({ ...currentTetromino, shape: newShape });
    }
  };
  
  const dropTetromino = () => {
    if (!currentTetromino) return;
    if (!moveTetromino(0, 1)) {
        const newBoard = board.map(row => [...row]);
        currentTetromino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    const boardY = y + currentTetromino.pos.y;
                    const boardX = x + currentTetromino.pos.x;
                    if(boardY >= 0) newBoard[boardY][boardX] = currentTetromino.color;
                }
            });
        });
        
        let linesRemoved = 0;
        const boardWithoutClearedLines: Board = [];
        for (let y = 0; y < newBoard.length; y++) {
            if (newBoard[y].every(cell => cell !== 0)) {
                linesRemoved++;
            } else {
                boardWithoutClearedLines.push(newBoard[y]);
            }
        }
        
        const newLines = Array.from({ length: linesRemoved }, () => Array(GRID_WIDTH).fill(0));
        const finalBoard = [...newLines, ...boardWithoutClearedLines];

        if (linesRemoved > 0) {
            const newLinesCleared = linesCleared + linesRemoved;
            setLinesCleared(newLinesCleared);
            setScore(prev => prev + linesRemoved * 10 * (linesRemoved * 2));
            const newLevel = Math.floor(newLinesCleared / 10);
            if (newLevel > level) {
                setLevel(newLevel);
                setDropInterval(Math.max(100, 1000 - newLevel * 50));
            }
        }
        
        setBoard(finalBoard);
        // We have to pass the new board to resetPlayer to check for game over condition correctly
        const newCurrent = nextTetromino || getRandomTetromino();
        const spawnPos = { x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 };
        if (checkCollision(newCurrent.shape, spawnPos, finalBoard)) {
          setGameOver(true);
        } else {
          setCurrentTetromino({ ...newCurrent, pos: spawnPos });
          setNextTetromino(getRandomTetromino());
        }
    }
  };

  const hardDrop = () => {
    if (!currentTetromino) return;
    let newY = currentTetromino.pos.y;
    while (!checkCollision(currentTetromino.shape, {x: currentTetromino.pos.x, y: newY + 1}, board)) {
        newY++;
    }
    
    // We need to create a temporary tetromino to trigger the lock-in logic in dropTetromino
    const droppedTetromino = { ...currentTetromino, pos: { ...currentTetromino.pos, y: newY } };
    
    // Now simulate the final drop that will fail and lock the piece
    const newBoard = board.map(row => [...row]);
    droppedTetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const boardY = y + droppedTetromino.pos.y;
                const boardX = x + droppedTetromino.pos.x;
                if(boardY >= 0) newBoard[boardY][boardX] = droppedTetromino.color;
            }
        });
    });

    // The rest is the same as in dropTetromino
    let linesRemoved = 0;
    const boardWithoutClearedLines: Board = [];
    newBoard.forEach(row => {
        if (row.every(cell => cell !== 0)) {
            linesRemoved++;
        } else {
            boardWithoutClearedLines.push(row);
        }
    });

    const newEmptyLines = Array.from({ length: linesRemoved }, () => Array(GRID_WIDTH).fill(0));
    const finalBoard = [...newEmptyLines, ...boardWithoutClearedLines];

    if (linesRemoved > 0) {
        const newLinesCleared = linesCleared + linesRemoved;
        setLinesCleared(newLinesCleared);
        setScore(prev => prev + linesRemoved * 10 * (linesRemoved * 2));
        const newLevel = Math.floor(newLinesCleared / 10);
        if (newLevel > level) {
            setLevel(newLevel);
            setDropInterval(Math.max(100, 1000 - newLevel * 50));
        }
    }

    setBoard(finalBoard);

    // After hard drop, immediately get the next piece
    const newCurrent = nextTetromino || getRandomTetromino();
    const spawnPos = { x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 };
    if (checkCollision(newCurrent.shape, spawnPos, finalBoard)) {
      setGameOver(true);
    } else {
      setCurrentTetromino({ ...newCurrent, pos: spawnPos });
      setNextTetromino(getRandomTetromino());
    }
  };
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') moveTetromino(-1, 0);
    else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') moveTetromino(1, 0);
    else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') dropTetromino();
    else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') rotateTetromino();
    else if (e.key === ' ') hardDrop();
  }, [gameOver, board, currentTetromino, dropTetromino, hardDrop, moveTetromino, rotateTetromino]);

  useEffect(() => {
    if (isMounted) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, isMounted]);

  useEffect(() => {
    if (!gameOver && isMounted) {
      const interval = setInterval(() => {
        dropTetromino();
      }, dropInterval);
      return () => clearInterval(interval);
    }
  }, [dropInterval, gameOver, currentTetromino, isMounted, dropTetromino]);

  const renderedBoard = useMemo(() => {
    const newBoard = board.map(row => [...row]);
    if (currentTetromino) {
      currentTetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            const boardY = y + currentTetromino.pos.y;
            const boardX = x + currentTetromino.pos.x;
            if(boardY >= 0) newBoard[boardY][boardX] = currentTetromino.color;
          }
        });
      });
    }
    return newBoard;
  }, [board, currentTetromino]);

  const NextTetrominoDisplay = ({ tetromino }: { tetromino: { shape: TetrominoShape, color: string } | null }) => {
    if (!tetromino) return null;
    const { shape, color } = tetromino;
    const width = shape[0].length;
    const height = shape.length;
    
    // Create an empty grid for the preview
    const grid = Array.from({ length: 4 }, () => Array(4).fill(0));

    // Center the shape in the grid
    const startX = Math.floor((4 - width) / 2);
    const startY = Math.floor((4 - height) / 2);

    shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          grid[startY + r][startX + c] = 1;
        }
      });
    });

    return (
        <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(4, 1fr)'}}>
            {grid.map((row, rIdx) => 
                row.map((cell, cIdx) => (
                    <div key={`${rIdx}-${cIdx}`} className={cn("w-4 h-4 rounded-sm", cell ? color : "bg-transparent")} />
                ))
            )}
        </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 px-4 items-center">
      <header className="w-full max-w-lg mb-6">
        <Button variant="outline" size="sm" onClick={() => router.push('/rest/games')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.backButton}
        </Button>
      </header>

      <main className="w-full max-w-lg flex flex-col items-center">
        <h1 className="text-2xl font-bold text-primary mb-4">{t.pageTitle}</h1>
        
        <div className="flex flex-col md:flex-row gap-6 w-full items-center md:items-start justify-center">
          {/* Game Board */}
          <div className="relative" style={{ width: '250px', height: '500px' }}>
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-800 rounded-lg p-1 grid gap-px" style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)`, gridTemplateRows: `repeat(${GRID_HEIGHT}, 1fr)`}}>
                {Array.from({ length: GRID_WIDTH * GRID_HEIGHT }).map((_, i) => (
                  <div key={i} className="bg-gray-400/20 dark:bg-gray-900/40 rounded-sm aspect-square" />
                ))}
            </div>
            <div className="relative grid gap-px p-1" style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)`, gridTemplateRows: `repeat(${GRID_HEIGHT}, 1fr)`}}>
              {renderedBoard.map((row, rIndex) =>
                row.map((cell, cIndex) => (
                  <div key={`${rIndex}-${cIndex}`} className={cn("aspect-square rounded-sm transition-colors duration-100", cell ? cell : 'bg-transparent')} />
                ))
              )}
            </div>
          </div>
          
          {/* Info Panel */}
          <div className="w-full md:w-40 flex flex-col gap-4">
              <Card>
                <CardContent className="p-3 text-center">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t.score}</p>
                    <p className="text-2xl font-bold">{score}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t.lines}</p>
                    <p className="text-2xl font-bold">{linesCleared}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t.level}</p>
                    <p className="text-2xl font-bold">{level}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">{t.next}</p>
                    <div className="flex justify-center items-center h-16">
                        <NextTetrominoDisplay tetromino={nextTetromino} />
                    </div>
                </CardContent>
              </Card>
              <Button onClick={initializeGame} variant="outline" size="sm" className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t.newGameButton}
              </Button>
          </div>
        </div>
        
        {gameOver && (
           <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10 animate-in fade-in-50">
             <div className="bg-card p-8 rounded-lg shadow-xl text-center">
               <h2 className="text-3xl font-bold text-destructive mb-4">{t.gameOverTitle}</h2>
               <p className="text-xl mb-2">{t.score}: {score}</p>
               <Button onClick={initializeGame} variant="default" size="lg">
                 {t.playAgainButton}
               </Button>
             </div>
           </div>
         )}
      </main>
    </div>
  );
}
