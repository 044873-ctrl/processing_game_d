const COLS = 10;
const ROWS = 20;
const CELL = 30;
const WIDTH = COLS * CELL;
const HEIGHT = ROWS * CELL;
let board = [];
let shapes = [];
let current = null;
let px = 0;
let py = 0;
let dropCounter = 0;
let dropInterval = 60;
let score = 0;
let gameOver = false;
function createEmptyRow() {
  let row = [];
  for (let i = 0; i < COLS; i++) {
    row.push(0);
  }
  return row;
}
function initBoard() {
  board = [];
  for (let r = 0; r < ROWS; r++) {
    board.push(createEmptyRow());
  }
}
function copyMatrix(m) {
  let out = [];
  for (let r = 0; r < m.length; r++) {
    let row = [];
    for (let c = 0; c < m[r].length; c++) {
      row.push(m[r][c]);
    }
    out.push(row);
  }
  return out;
}
function rotateMatrix(m) {
  let N = m.length;
  let res = [];
  for (let r = 0; r < N; r++) {
    let row = [];
    for (let c = 0; c < N; c++) {
      row.push(0);
    }
    res.push(row);
  }
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      res[c][N - 1 - r] = m[r][c];
    }
  }
  return res;
}
function collide(mat, x, y) {
  for (let r = 0; r < mat.length; r++) {
    for (let c = 0; c < mat[r].length; c++) {
      if (mat[r][c]) {
        let bx = x + c;
        let by = y + r;
        if (bx < 0 || bx >= COLS || by >= ROWS) {
          return true;
        }
        if (by >= 0) {
          if (board[by][bx]) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
function lockPiece() {
  for (let r = 0; r < current.length; r++) {
    for (let c = 0; c < current[r].length; c++) {
      if (current[r][c]) {
        let bx = px + c;
        let by = py + r;
        if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
          board[by][bx] = 1;
        }
      }
    }
  }
  clearLines();
  spawnPiece();
}
function clearLines() {
  let lines = 0;
  for (let y = ROWS - 1; y >= 0; y--) {
    let full = true;
    for (let x = 0; x < COLS; x++) {
      if (!board[y][x]) {
        full = false;
        break;
      }
    }
    if (full) {
      board.splice(y, 1);
      board.unshift(createEmptyRow());
      lines++;
      y++;
    }
  }
  if (lines > 0) {
    score += lines * 100;
  }
}
function spawnPiece() {
  let idx = Math.floor(Math.random() * shapes.length);
  current = copyMatrix(shapes[idx]);
  px = Math.floor(COLS / 2) - 2;
  py = 0;
  if (collide(current, px, py)) {
    gameOver = true;
  }
}
function setup() {
  createCanvas(WIDTH, HEIGHT);
  initBoard();
  shapes = [
    [
      [0,0,0,0],
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0]
    ]
  ];
  spawnPiece();
  textSize(16);
  noStroke();
}
function drawGrid() {
  stroke(50);
  for (let x = 0; x <= WIDTH; x += CELL) {
    line(x, 0, x, HEIGHT);
  }
  for (let y = 0; y <= HEIGHT; y += CELL) {
    line(0, y, WIDTH, y);
  }
  noStroke();
}
function draw() {
  background(20);
  fill(30);
  rect(0, 0, WIDTH, HEIGHT);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c]) {
        fill(200, 160, 0);
        rect(c * CELL, r * CELL, CELL, CELL);
      }
    }
  }
  if (current) {
    for (let r = 0; r < current.length; r++) {
      for (let c = 0; c < current[r].length; c++) {
        if (current[r][c]) {
          let bx = px + c;
          let by = py + r;
          if (by >= 0) {
            fill(0, 200, 200);
            rect(bx * CELL, by * CELL, CELL, CELL);
          }
        }
      }
    }
  }
  fill(255);
  text("Score: " + score, 5, 18);
  if (gameOver) {
    fill(255, 0, 0);
    textSize(32);
    text("Game Over", 50, HEIGHT / 2);
    return;
  }
  dropInterval = keyIsDown(DOWN_ARROW) ? 2 : 60;
  dropCounter++;
  if (dropCounter >= dropInterval) {
    py++;
    if (collide(current, px, py)) {
      py--;
      lockPiece();
    }
    dropCounter = 0;
  }
  drawGrid();
}
function keyPressed() {
  if (gameOver) {
    return;
  }
  if (keyCode === LEFT_ARROW) {
    if (!collide(current, px - 1, py)) {
      px--;
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (!collide(current, px + 1, py)) {
      px++;
    }
  } else if (keyCode === UP_ARROW) {
    let rotated = rotateMatrix(current);
    if (!collide(rotated, px, py)) {
      current = rotated;
    }
  } else if (keyCode === DOWN_ARROW) {
    py++;
    if (collide(current, px, py)) {
      py--;
      lockPiece();
    }
    dropCounter = 0;
  }
}
