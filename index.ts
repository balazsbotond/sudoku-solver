type Board = number[][];

const testBoard = [
  [3, 4, 0, 0, 2, 6, 0, 8, 0],
  [0, 0, 1, 0, 7, 0, 0, 0, 0],
  [7, 2, 0, 8, 0, 0, 4, 3, 9],
  [4, 0, 9, 6, 0, 0, 3, 0, 2],
  [0, 0, 0, 0, 1, 9, 0, 7, 0],
  [1, 0, 0, 0, 0, 4, 9, 0, 0],
  [0, 0, 0, 5, 6, 8, 0, 0, 7],
  [0, 0, 0, 0, 0, 2, 0, 0, 5],
  [2, 5, 4, 0, 9, 7, 8, 6, 3],
] as Board;

function wait(ms: number) {
  var waitTill = new Date(new Date().getTime() + ms);
  while(waitTill > new Date()) {
  }
}

function clearScreen() {
  process.stdout.write('\x1b[2J');
}

function moveToHome() {
  process.stdout.write('\x1b[H');
}

function printBoard(board: Board) {
  let rowNum = 1;
  for (const row of board) {
    const chunks = [0, 1, 2].map(i => row.slice(i * 3, (i + 1) * 3).map(n => n === 0 ? '_' : n).join(' '));
    console.log(chunks.join(' | '));
    if (rowNum === 3 || rowNum === 6) {
      console.log('------+-------+------');
    }
    rowNum++;
  }
}

function updateScreen(board: Board) {
  clearScreen();
  moveToHome();
  printBoard(board);
  wait(100);
}

function isValid(num: number, row: number, col: number, board: Board) {
  if (board[row][col] !== 0) {
    return false;
  }
  for (const n of board[row]) {
    if (n === num) {
      return false;
    }
  }
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) {
      return false;
    }
  }
  const boxLeft = Math.floor(col / 3) * 3;
  const boxTop = Math.floor(row / 3) * 3;
  for (let r = boxTop; r < boxTop + 3; r++) {
    for (let c = boxLeft; c < boxLeft + 3; c++) {
      if (board[r][c] === num) {
        return false;
      }
    }
  }
  return true;
}

function solve(board: Board, row: number, col: number): boolean {
  if (row === 9) {
    return true; // puzzle solved
  }
  if (board[row][col] !== 0) {
    const [nextRow, nextCol] = next(row, col);
    return solve(board, nextRow, nextCol);
  }
  for (let i = 1; i <= 9; i++) {
    if (!isValid(i, row, col, board)) {
      continue;
    }
    board[row][col] = i;
    updateScreen(board);
    const [nextRow, nextCol] = next(row, col);
    if (solve(board, nextRow, nextCol)) {
      return true;
    }
    board[row][col] = 0;
  }
  return false; // dead end
}

function next(row: number, col: number) {
  if (col < 8) {
    return [row, col + 1];
  }
  return [row + 1, 0];
}

updateScreen(testBoard);
const success = solve(testBoard, 0, 0);

if (success) {
  console.log('\nSolution found.\n');
} else {
  console.log('\nUnsolvable puzzle.\n');
}
