
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Timer, XCircle, Pencil, Lightbulb, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { generateSudoku, solveSudoku } from '@/lib/sudoku';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const translations = {
  'zh-CN': {
    pageTitle: '数独',
    backButton: '返回',
    difficulty: '难度',
    easy: '简单',
    medium: '中等',
    hard: '困难',
    mistakes: '错误',
    timer: '时间',
    newGame: '新游戏',
    undo: '撤销',
    erase: '擦除',
    notes: '笔记',
    hint: '提示',
    youWin: '恭喜！你解决了谜题！',
    playAgain: '再玩一次',
    of: '/',
  },
  'en': {
    pageTitle: 'Sudoku',
    backButton: 'Back',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    mistakes: 'Mistakes',
    timer: 'Time',
    newGame: 'New Game',
    undo: 'Undo',
    erase: 'Erase',
    notes: 'Notes',
    hint: 'Hint',
    youWin: 'Congratulations! You solved the puzzle!',
    playAgain: 'Play Again',
    of: '/',
  }
};

type LanguageKey = keyof typeof translations;
type Difficulty = 'easy' | 'medium' | 'hard';

const GRID_SIZE = 9;

interface Cell {
  value: number; // 0 for empty
  isGiven: boolean;
  isHint: boolean;
  notes: Set<number>;
  error: boolean;
}

type Board = Cell[][];
type HistoryEntry = {
    board: Board;
    mistakes: number;
};

const createEmptyBoard = (): Board => {
  return Array(GRID_SIZE).fill(null).map(() => 
    Array(GRID_SIZE).fill(null).map(() => ({
      value: 0,
      isGiven: false,
      isHint: false,
      notes: new Set(),
      error: false
    }))
  );
};

const difficultySettings = {
    easy: 40,
    medium: 30,
    hard: 20
};

export default function SudokuPage() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [solution, setSolution] = useState<number[][] | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ r: number, c: number } | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  
  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const initializeNewGame = useCallback((level: Difficulty) => {
    const { puzzle, solvedPuzzle } = generateSudoku(difficultySettings[level]);
    const newBoard = puzzle.map(row => row.map(val => ({
      value: val,
      isGiven: val !== 0,
      isHint: false,
      notes: new Set<number>(),
      error: false,
    })));
    setBoard(newBoard);
    setSolution(solvedPuzzle);
    setMistakes(0);
    setTimer(0);
    setIsTimerRunning(true);
    setIsGameWon(false);
    setSelectedCell(null);
    setIsNotesMode(false);
    setHistory([{ board: newBoard, mistakes: 0 }]);
  }, []);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
    initializeNewGame(difficulty);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && !isGameWon) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isGameWon]);
  
  const pushToHistory = (newBoard: Board, newMistakes: number) => {
    setHistory(prev => [...prev.slice(-10), { board: newBoard, mistakes: newMistakes }]);
  };

  const handleUndo = () => {
      if (history.length <= 1) return;
      const newHistory = [...history];
      newHistory.pop();
      const lastState = newHistory[newHistory.length - 1];
      setBoard(lastState.board);
      setMistakes(lastState.mistakes);
      setHistory(newHistory);
  };
  
  const checkWinCondition = (currentBoard: Board) => {
      for(let r = 0; r < GRID_SIZE; r++) {
          for(let c = 0; c < GRID_SIZE; c++) {
              if (currentBoard[r][c].value === 0 || currentBoard[r][c].error) {
                  return;
              }
          }
      }
      setIsGameWon(true);
      setIsTimerRunning(false);
  }

  const handleCellClick = (r: number, c: number) => {
    if (board[r][c].isGiven) {
        setSelectedCell(null);
        return;
    }
    setSelectedCell({ r, c });
  };
  
  const handleNumberInput = (num: number) => {
    if (!selectedCell || isGameWon) return;
    const { r, c } = selectedCell;

    if (board[r][c].isGiven) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell, notes: new Set(cell.notes) })));
    let newMistakes = mistakes;

    if (isNotesMode) {
      const notes = newBoard[r][c].notes;
      if (notes.has(num)) {
        notes.delete(num);
      } else {
        notes.add(num);
      }
      newBoard[r][c].value = 0; // Clear main value when adding notes
    } else {
      if (newBoard[r][c].value !== num) {
        newBoard[r][c].notes.clear(); // Clear notes when setting a value
        newBoard[r][c].value = num;
        newBoard[r][c].isHint = false;

        const isCorrect = solution && solution[r][c] === num;
        newBoard[r][c].error = !isCorrect;

        if (!isCorrect) {
          newMistakes++;
          if (newMistakes >= 3) {
            setIsGameWon(true);
            setIsTimerRunning(false);
          }
          setMistakes(newMistakes);
        }
      }
    }
    
    setBoard(newBoard);
    pushToHistory(newBoard, newMistakes);
    if (!isNotesMode) {
        checkWinCondition(newBoard);
    }
  };
  
  const handleErase = () => {
    if (!selectedCell || isGameWon) return;
    const { r, c } = selectedCell;
    
    if (board[r][c].isGiven || board[r][c].isHint) return;
    
    if(board[r][c].value !== 0 || board[r][c].notes.size > 0) {
        const newBoard = board.map(row => row.map(cell => ({ ...cell, notes: new Set(cell.notes) })));
        newBoard[r][c].value = 0;
        newBoard[r][c].notes.clear();
        newBoard[r][c].error = false;
        setBoard(newBoard);
        pushToHistory(newBoard, mistakes);
    }
  };

  const handleHint = () => {
    if(isGameWon) return;
    
    const emptyCells = [];
    for(let r = 0; r < GRID_SIZE; r++) {
      for(let c = 0; c < GRID_SIZE; c++) {
        if(board[r][c].value === 0) {
          emptyCells.push({r, c});
        }
      }
    }

    if(emptyCells.length > 0 && solution) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const {r, c} = randomCell;
      
      const newBoard = board.map(row => row.map(cell => ({ ...cell, notes: new Set(cell.notes) })));
      newBoard[r][c].value = solution[r][c];
      newBoard[r][c].isHint = true;
      newBoard[r][c].notes.clear();
      newBoard[r][c].error = false;
      
      setBoard(newBoard);
      pushToHistory(newBoard, mistakes);
      checkWinCondition(newBoard);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isGameWon) return;

    if (selectedCell) {
        const { r, c } = selectedCell;
        let newR = r;
        let newC = c;
        switch(event.key) {
            case 'ArrowUp': newR = Math.max(0, r - 1); break;
            case 'ArrowDown': newR = Math.min(GRID_SIZE - 1, r + 1); break;
            case 'ArrowLeft': newC = Math.max(0, c - 1); break;
            case 'ArrowRight': newC = Math.min(GRID_SIZE - 1, c + 1); break;
        }
        if(newR !== r || newC !== c) {
            setSelectedCell({r: newR, c: newC});
        }
    }

    if (event.key >= '1' && event.key <= '9') {
        handleNumberInput(parseInt(event.key, 10));
    }
    
    if (event.key === 'Backspace' || event.key === 'Delete') {
        handleErase();
    }
    
    if (event.key.toLowerCase() === 'n') {
        setIsNotesMode(prev => !prev);
    }

  }, [isGameWon, selectedCell, handleNumberInput, handleErase]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

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
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center justify-center gap-1"><XCircle className="h-3 w-3"/>{t.mistakes}</p>
                    <p className="text-xl font-bold">{mistakes} <span className="text-base text-muted-foreground">{t.of} 3</span></p>
                </CardContent>
            </Card>
            <Card className="p-2 text-center shadow-sm">
                <CardContent className="p-0">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center justify-center gap-1"><Timer className="h-3 w-3"/>{t.timer}</p>
                    <p className="text-xl font-bold font-mono">{formatTime(timer)}</p>
                </CardContent>
            </Card>
            <Card className="p-2 text-center shadow-sm">
                <CardContent className="p-0">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t.difficulty}</p>
                     <Select value={difficulty} onValueChange={(v) => { setDifficulty(v as Difficulty); initializeNewGame(v as Difficulty); }}>
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
        
        <div 
            className="grid gap-1 p-1 bg-gray-400 dark:bg-gray-800 rounded-lg shadow-md mb-6 relative w-full"
            style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                maxWidth: '420px', 
                aspectRatio: '1 / 1'
            }}
        >
            {board.map((row, r) => row.map((cell, c) => {
                const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                const isRelated = !isSelected && selectedCell && (selectedCell.r === r || selectedCell.c === c || (Math.floor(selectedCell.r/3) === Math.floor(r/3) && Math.floor(selectedCell.c/3) === Math.floor(c/3)));
                const isMatchingValue = selectedCell && board[selectedCell.r][selectedCell.c].value !== 0 && board[selectedCell.r][selectedCell.c].value === cell.value;

                return (
                    <div
                        key={`${r}-${c}`}
                        onClick={() => handleCellClick(r, c)}
                        className={cn(
                            "flex items-center justify-center rounded-md aspect-square transition-colors duration-100",
                            "bg-card/80 hover:bg-card",
                            isSelected && "bg-primary/20 ring-2 ring-primary z-10",
                            isRelated && "bg-primary/10",
                            cell.isGiven ? "text-foreground font-semibold" : (cell.isHint ? "text-green-600 dark:text-green-400" : "text-primary"),
                            cell.error && "bg-destructive/20 text-destructive",
                            "cursor-pointer text-xl sm:text-2xl font-mono",
                             (c === 2 || c === 5) && "border-r-2 border-gray-400 dark:border-gray-800",
                             (r === 2 || r === 5) && "border-b-2 border-gray-400 dark:border-gray-800"
                        )}
                    >
                        {cell.value !== 0 ? (
                            <span className={cn(isMatchingValue && !cell.isGiven && "bg-amber-300 dark:bg-amber-700 rounded-full w-8 h-8 flex items-center justify-center")}>{cell.value}</span>
                        ) : cell.notes.size > 0 ? (
                           <div className="grid grid-cols-3 gap-0.5 text-xs text-muted-foreground w-full h-full p-0.5">
                                {[1,2,3,4,5,6,7,8,9].map(n => (
                                    <div key={n} className="flex items-center justify-center">
                                        {cell.notes.has(n) ? n : ''}
                                    </div>
                                ))}
                           </div>
                        ) : null}
                    </div>
                )
            }))}
            {isGameWon && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20 animate-in fade-in-50 rounded-lg">
                    <div className="bg-card p-6 sm:p-8 rounded-lg shadow-xl text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-green-500 mb-3">{t.youWin}</h2>
                        <p className="text-lg mb-4">{t.timer}: {formatTime(timer)}</p>
                        <Button onClick={() => initializeNewGame(difficulty)} variant="default" size="lg" className="px-6 py-3 text-base">
                        {t.playAgain}
                        </Button>
                    </div>
                </div>
            )}
        </div>

        <div className="flex justify-between items-center w-full max-w-[420px] mb-4">
          <Button variant="outline" size="lg" onClick={() => initializeNewGame(difficulty)}>
              <RotateCcw className="mr-2 h-4 w-4" />
              {t.newGame}
          </Button>
          <div className="grid grid-cols-4 gap-2">
            <Button variant={isNotesMode ? "secondary" : "outline"} onClick={() => setIsNotesMode(prev => !prev)} className="h-12 w-12 p-0"><Pencil className="h-5 w-5"/></Button>
            <Button variant="outline" onClick={handleErase} className="h-12 w-12 p-0">Erase</Button>
            <Button variant="outline" onClick={handleUndo} disabled={history.length <= 1} className="h-12 w-12 p-0"><Undo2 className="h-5 w-5"/></Button>
            <Button variant="outline" onClick={handleHint} className="h-12 w-12 p-0"><Lightbulb className="h-5 w-5"/></Button>
          </div>
        </div>

        <div className="grid grid-cols-9 gap-1 w-full max-w-[420px]">
            {Array.from({length: 9}, (_, i) => i + 1).map(num => (
                <Button key={num} onClick={() => handleNumberInput(num)} className="h-12 text-2xl font-sans" variant="outline">
                    {num}
                </Button>
            ))}
        </div>
      </main>
    </div>
  );
}
