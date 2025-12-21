let COLS = 10;
let ROWS = 20;
let SIZE = 30;
let WIDTH = COLS * SIZE;
let HEIGHT = ROWS * SIZE;
let board = [];
let shapes = [];
let colors = [];
let currentPiece = null;
let dropCounter = 0;
let framesPerDrop = 30;
let score = 0;
let gameOver = false;
function setup() {
  createCanvas(WIDTH, HEIGHT);
  initBoard();
  initShapes();
  initColors();
  spawnPiece();
  textSize(16);
  noStroke();
}
function draw() {
  background(30);
  drawBoard();
  if (!gameOver) {
    framesPerDrop = keyIsDown(DOWN_ARROW) ? 2 : 30;
    dropCounter++;
    if (dropCounter >= framesPerDrop) {
      movePiece(0, 1);
      dropCounter = 0;
    }
  }
  drawCurrentPiece();
  fill(255);
  text("Score: " + score, 5, 18);
  if (gameOver) {
    fill(200, 50, 50);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("GAME OVER", WIDTH / 2, HEIGHT / 2);
    textAlign(LEFT, BASELINE);
    textSize(16);
  }
}
function initBoard() {
  for (let y = 0; y < ROWS; y++) {
    let row = [];
    for (let x = 0; x < COLS; x++) {
      row.push(0);
    }
    board.push(row);
  }
}
function initShapes() {
  shapes = [
    [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,1,0,0],
      [1,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,0,1,0],
      [1,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [1,0,0,0],
      [1,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,1,1,0],
      [1,1,0,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [1,1,0,0],
      [0,1,1,0],
      [0,0,0,0]
    ]
  ];
}
function initColors() {
  colors = [
    color(0, 240, 240),
    color(240, 240, 0),
    color(160, 0, 240),
    color(240, 160, 0),
    color(0, 0, 240),
    color(0, 240, 0),
    color(240, 0, 0)
  ];
}
function copy4x4(m) {
  let r = [];
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      row.push(m[i][j]);
    }
    r.push(row);
  }
  return r;
}
function spawnPiece() {
  let idx = floor(random(0, shapes.length));
  let shape = copy4x4(shapes[idx]);
  currentPiece = {
    shape: shape,
    x: 3,
    y: 0,
    type: idx
  };
  if (collideWith(currentPiece.shape, currentPiece.x, currentPiece.y)) {
    gameOver = true;
  }
}
function collideWith(shape, px, py) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (shape[i][j] === 1) {
        let gx = px + j;
        let gy = py + i;
        if (gx < 0 || gx >= COLS) {
          return true;
        }
        if (gy >= ROWS) {
          return true;
        }
        if (gy >= 0) {
          if (board[gy][gx] !== 0) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
function movePiece(dx, dy) {
  if (currentPiece === null) {
    return;
  }
  let nx = currentPiece.x + dx;
  let ny = currentPiece.y + dy;
  if (!collideWith(currentPiece.shape, nx, ny)) {
    currentPiece.x = nx;
    currentPiece.y = ny;
  } else {
    if (dy === 1) {
      lockPiece();
    }
  }
}
function lockPiece() {
  if (currentPiece === null) {
    return;
  }
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (currentPiece.shape[i][j] === 1) {
        let gx = currentPiece.x + j;
        let gy = currentPiece.y + i;
        if (gy < 0) {
          gameOver = true;
        } else {
          board[gy][gx] = currentPiece.type + 1;
        }
      }
    }
  }
  clearLines();
  spawnPiece();
}
function clearLines() {
  let linesCleared = 0;
  for (let y = ROWS - 1; y >= 0; y--) {
    let full = true;
    for (let x = 0; x < COLS; x++) {
      if (board[y][x] === 0) {
        full = false;
        break;
      }
    }
    if (full) {
      board.splice(y, 1);
      let newRow = [];
      for (let k = 0; k < COLS; k++) {
        newRow.push(0);
      }
      board.unshift(newRow);
      linesCleared++;
      y++;
    }
  }
  if (linesCleared > 0) {
    score += linesCleared * 100;
  }
}
function rotateMatrix(shape) {
  let m = [];
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      row.push(0);
    }
    m.push(row);
  }
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      m[j][3 - i] = shape[i][j];
    }
  }
  return m;
}
function drawBoard() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      let v = board[y][x];
      if (v === 0) {
        fill(20);
        rect(x * SIZE, y * SIZE, SIZE - 1, SIZE - 1);
      } else {
        let col = colors[v - 1];
        fill(col);
        rect(x * SIZE, y * SIZE, SIZE - 1, SIZE - 1);
      }
    }
  }
}
function drawCurrentPiece() {
  if (currentPiece === null) {
    return;
  }
  let col = colors[currentPiece.type];
  fill(col);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (currentPiece.shape[i][j] === 1) {
        let gx = currentPiece.x + j;
        let gy = currentPiece.y + i;
        if (gy >= 0) {
          rect(gx * SIZE, gy * SIZE, SIZE - 1, SIZE - 1);
        }
      }
    }
  }
}
function keyPressed() {
  if (gameOver) {
    return;
  }
  if (keyCode === LEFT_ARROW) {
    movePiece(-1, 0);
  } else if (keyCode === RIGHT_ARROW) {
    movePiece(1, 0);
  } else if (keyCode === DOWN_ARROW) {
    movePiece(0, 1);
    dropCounter = 0;
  } else if (keyCode === UP_ARROW) {
    let rotated = rotateMatrix(currentPiece.shape);
    if (!collideWith(rotated, currentPiece.x, currentPiece.y)) {
      currentPiece.shape = rotated;
    }
  }
}
