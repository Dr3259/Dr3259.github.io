
// Sudoku Generator and Solver

const SIZE = 9;
const BOX_SIZE = 3;

// A simple backtracking solver
function solve(board: number[][]): boolean {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= SIZE; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Check if a number is valid in a given position
function isValid(board: number[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < SIZE; x++) {
    if (board[row][x] === num && x !== col) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < SIZE; x++) {
    if (board[x][col] === num && x !== row) {
      return false;
    }
  }

  // Check 3x3 box
  const startRow = row - (row % BOX_SIZE);
  const startCol = col - (col % BOX_SIZE);
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (board[i + startRow][j + startCol] === num && (i + startRow !== row || j + startCol !== col)) {
        return false;
      }
    }
  }

  return true;
}

// Function to check if a puzzle has a unique solution
function hasUniqueSolution(board: number[][]): boolean {
    let solutionCount = 0;

    function countSolutions(b: number[][]): void {
        if (solutionCount > 1) return;

        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                if (b[row][col] === 0) {
                    for (let num = 1; num <= SIZE; num++) {
                        if (isValid(b, row, col, num)) {
                            b[row][col] = num;
                            countSolutions(b);
                            b[row][col] = 0; // backtrack
                        }
                    }
                    return;
                }
            }
        }
        solutionCount++;
    }

    countSolutions(board.map(row => [...row])); // Use a copy
    return solutionCount === 1;
}

export function generateSudoku(givens: number): { puzzle: number[][], solvedPuzzle: number[][] } {
  let attempts = 5;
  while(attempts > 0) {
      try {
        const board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
        
        // Fill the diagonal 3x3 boxes
        for (let i = 0; i < SIZE; i += BOX_SIZE) {
            fillBox(board, i, i);
        }

        // Fill the rest of the board
        solve(board);

        // This is the fully solved board
        const solvedPuzzle = board.map(row => [...row]);

        // Remove cells to create the puzzle
        const puzzle = board.map(row => [...row]);
        let cellsToRemove = SIZE * SIZE - givens;
        
        let removalAttempts = 500; // Prevent infinite loop
        while (cellsToRemove > 0 && removalAttempts > 0) {
            const row = Math.floor(Math.random() * SIZE);
            const col = Math.floor(Math.random() * SIZE);

            if (puzzle[row][col] !== 0) {
                const backup = puzzle[row][col];
                puzzle[row][col] = 0;

                const puzzleCopy = puzzle.map(r => [...r]);
                if (!hasUniqueSolution(puzzleCopy)) {
                    puzzle[row][col] = backup; // Restore if not unique
                } else {
                    cellsToRemove--;
                }
            }
            removalAttempts--;
        }
        
        if (removalAttempts === 0) throw new Error("Could not create a unique puzzle.");

        return { puzzle, solvedPuzzle };

      } catch (e) {
        console.error("Sudoku generation attempt failed, retrying...", e);
        attempts--;
      }
  }
  
  // Fallback if generation fails repeatedly
  console.error("Failed to generate a valid Sudoku puzzle after multiple attempts.");
  // Return a known valid puzzle as a fallback
  const fallbackPuzzle = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
  ];
  const fallbackSolution = [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]
  ];

  return { puzzle: fallbackPuzzle, solvedPuzzle: fallbackSolution };
}


// Helper to fill a 3x3 box with random numbers
function fillBox(board: number[][], row: number, col: number): void {
  let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // Shuffle numbers
  for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      board[row + i][col + j] = nums.pop()!;
    }
  }
}

function solveSudoku(board: number[][]): number[][] | null {
    const newBoard = board.map(row => [...row]);
    if (solve(newBoard)) {
        return newBoard;
    }
    return null;
}

export { solveSudoku };
