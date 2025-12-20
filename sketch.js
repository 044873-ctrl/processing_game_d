let board = [];
let rows = 8;
let cols = 8;
let cellSize = 50;
let currentPlayer = 1;
let dirs = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
];
let gameOver = false;
function setup() {
  createCanvas(400, 400);
  initBoard();
}
function draw() {
  background(34, 139, 34);
  drawGrid();
  drawStones();
  let blackMoves = computeValidMoves(1);
  let whiteMoves = computeValidMoves(2);
  if (!gameOver) {
    if (currentPlayer === 1) {
      for (let i = 0; i < blackMoves.length; i++) {
        let mv = blackMoves[i];
        fill(0, 0, 0, 80);
        noStroke();
        ellipse(mv.c * cellSize + cellSize / 2, mv.r * cellSize + cellSize / 2, 12, 12);
      }
      if (blackMoves.length === 0) {
        doAIMove();
      }
    }
  }
  drawCounts();
  if (!gameOver && currentPlayer === 2 && whiteMoves.length > 0) {
    doAIMove();
  }
}
function initBoard() {
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      row.push(0);
    }
    board.push(row);
  }
  board[3][3] = 2;
  board[3][4] = 1;
  board[4][3] = 1;
  board[4][4] = 2;
}
function drawGrid() {
  stroke(0);
  for (let i = 0; i <= rows; i++) {
    line(0, i * cellSize, cols * cellSize, i * cellSize);
  }
  for (let j = 0; j <= cols; j++) {
    line(j * cellSize, 0, j * cellSize, rows * cellSize);
  }
}
function drawStones() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let v = board[r][c];
      if (v === 1) {
        fill(0);
        stroke(200);
        ellipse(c * cellSize + cellSize / 2, r * cellSize + cellSize / 2, cellSize - 8, cellSize - 8);
      } else if (v === 2) {
        fill(255);
        stroke(0);
        ellipse(c * cellSize + cellSize / 2, r * cellSize + cellSize / 2, cellSize - 8, cellSize - 8);
      }
    }
  }
}
function mousePressed() {
  if (gameOver) {
    return;
  }
  if (mouseX < 0 || mouseX >= cols * cellSize || mouseY < 0 || mouseY >= rows * cellSize) {
    return;
  }
  if (currentPlayer !== 1) {
    return;
  }
  let c = Math.floor(mouseX / cellSize);
  let r = Math.floor(mouseY / cellSize);
  if (r < 0 || r >= rows || c < 0 || c >= cols) {
    return;
  }
  let flips = getFlips(r, c, 1);
  if (flips.length === 0) {
    return;
  }
  applyMove(r, c, 1, flips);
  currentPlayer = 2;
  let blackMoves = computeValidMoves(1);
  let whiteMoves = computeValidMoves(2);
  if (whiteMoves.length === 0 && blackMoves.length === 0) {
    gameOver = true;
    return;
  }
  doAIMove();
}
function getFlips(r, c, player) {
  let result = [];
  if (board[r][c] !== 0) {
    return result;
  }
  for (let d = 0; d < dirs.length; d++) {
    let dir = dirs[d];
    let rr = r + dir[0];
    let cc = c + dir[1];
    let temp = [];
    while (rr >= 0 && rr < rows && cc >= 0 && cc < cols) {
      if (board[rr][cc] === 0) {
        temp = [];
        break;
      }
      if (board[rr][cc] === player) {
        break;
      }
      temp.push([rr, cc]);
      rr += dir[0];
      cc += dir[1];
    }
    if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) {
      if (board[rr][cc] === player && temp.length > 0) {
        for (let k = 0; k < temp.length; k++) {
          result.push(temp[k]);
        }
      }
    }
  }
  return result;
}
function computeValidMoves(player) {
  let moves = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] !== 0) {
        continue;
      }
      let flips = getFlips(r, c, player);
      if (flips.length > 0) {
        moves.push({ r: r, c: c, flips: flips });
      }
    }
  }
  return moves;
}
function applyMove(r, c, player, flips) {
  board[r][c] = player;
  for (let i = 0; i < flips.length; i++) {
    let p = flips[i];
    board[p[0]][p[1]] = player;
  }
}
function doAIMove() {
  if (gameOver) {
    return;
  }
  let whiteMoves = computeValidMoves(2);
  if (whiteMoves.length === 0) {
    let blackMoves = computeValidMoves(1);
    if (blackMoves.length === 0) {
      gameOver = true;
      return;
    } else {
      currentPlayer = 1;
      return;
    }
  }
  let best = [];
  let bestCount = -1;
  for (let i = 0; i < whiteMoves.length; i++) {
    let mv = whiteMoves[i];
    let cnt = mv.flips.length;
    if (cnt > bestCount) {
      bestCount = cnt;
      best = [mv];
    } else if (cnt === bestCount) {
      best.push(mv);
    }
  }
  let choice = best[Math.floor(Math.random() * best.length)];
  if (choice !== undefined) {
    applyMove(choice.r, choice.c, 2, choice.flips);
  }
  currentPlayer = 1;
  let blackMovesAfter = computeValidMoves(1);
  let whiteMovesAfter = computeValidMoves(2);
  if (blackMovesAfter.length === 0 && whiteMovesAfter.length === 0) {
    gameOver = true;
  }
}
function drawCounts() {
  let blackCount = 0;
  let whiteCount = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 1) {
        blackCount++;
      } else if (board[r][c] === 2) {
        whiteCount++;
      }
    }
  }
  noStroke();
  fill(0);
  ellipse(10, height - 18, 16, 16);
  fill(255);
  textSize(12);
  fill(255);
  textAlign(LEFT, CENTER);
  fill(255);
  text(blackCount, 20, height - 18);
  fill(255);
  ellipse(width - 60, height - 18, 16, 16);
  fill(0);
  text(whiteCount, width - 48, height - 18);
  if (gameOver) {
    let winner = 0;
    if (blackCount > whiteCount) {
      winner = 1;
    } else if (whiteCount > blackCount) {
      winner = 2;
    } else {
      winner = 0;
    }
    fill(0, 150);
    rect(50, 140, 300, 120, 8);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    if (winner === 1) {
      fill(0);
      ellipse(width / 2 - 40, 200, 28, 28);
      fill(255);
      text(String(blackCount) + " - " + String(whiteCount), width / 2 + 20, 200);
    } else if (winner === 2) {
      fill(255);
      ellipse(width / 2 - 40, 200, 28, 28);
      fill(0);
      text(String(blackCount) + " - " + String(whiteCount), width / 2 + 20, 200);
    } else {
      fill(255);
      text(String(blackCount) + " - " + String(whiteCount), width / 2, 200);
    }
  }
}
