let cols = 10;
let rows = 20;
let cell = 30;
let canvasW = cols * cell;
let canvasH = rows * cell;
let board = [];
let currentPiece = null;
let pieces = [];
let colors = [];
let frameCounter = 0;
let score = 0;
let gameOver = false;
function createEmptyBoard() {
  let b = [];
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      row.push(0);
    }
    b.push(row);
  }
  return b;
}
function definePieces() {
  pieces = [
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
  colors = [
    [0,255,255],
    [255,255,0],
    [160,0,255],
    [255,150,0],
    [0,0,255],
    [0,255,0],
    [255,0,0]
  ];
}
function rotateMatrix(m) {
  let size = 4;
  let res = [];
  for (let r = 0; r < size; r++) {
    let row = [];
    for (let c = 0; c < size; c++) {
      row.push(0);
    }
    res.push(row);
  }
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      res[r][c] = m[size - 1 - c][r];
    }
  }
  return res;
}
function validPosition(px, py, shape) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (shape[r][c] !== 0) {
        let x = px + c;
        let y = py + r;
        if (x < 0 || x >= cols || y >= rows) {
          return false;
        }
        if (y >= 0) {
          if (board[y][x] !== 0) {
            return false;
          }
        }
      }
    }
  }
  return true;
}
function lockPiece() {
  let shape = currentPiece.shape;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (shape[r][c] !== 0) {
        let x = currentPiece.x + c;
        let y = currentPiece.y + r;
        if (y >= 0 && y < rows && x >= 0 && x < cols) {
          board[y][x] = currentPiece.type + 1;
        }
      }
    }
  }
  clearLines();
}
function clearLines() {
  let lines = 0;
  for (let r = rows - 1; r >= 0; r--) {
    let full = true;
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 0) {
        full = false;
        break;
      }
    }
    if (full) {
      board.splice(r, 1);
      let newRow = [];
      for (let c = 0; c < cols; c++) {
        newRow.push(0);
      }
      board.unshift(newRow);
      lines++;
      r++;
    }
  }
  if (lines > 0) {
    score += lines * 100;
  }
}
function spawnPiece() {
  let idx = floor(random(0, pieces.length));
  let shape = pieces[idx].map(function(row){ return row.slice(); });
  let px = 3;
  let py = -1;
  currentPiece = {shape: shape, x: px, y: py, type: idx};
  if (!validPosition(currentPiece.x, currentPiece.y, currentPiece.shape)) {
    gameOver = true;
  }
}
function setup() {
  createCanvas(canvasW, canvasH);
  board = createEmptyBoard();
  definePieces();
  frameRate(60);
  score = 0;
  frameCounter = 0;
  gameOver = false;
  spawnPiece();
}
function drawCell(x, y, colIdx) {
  if (colIdx === 0) {
    noFill();
    stroke(40);
    rect(x, y, cell, cell);
  } else {
    let col = colors[colIdx - 1];
    fill(col[0], col[1], col[2]);
    stroke(30);
    rect(x, y, cell, cell);
  }
}
function draw() {
  background(20);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let val = board[r][c];
      drawCell(c * cell, r * cell, val);
    }
  }
  if (currentPiece !== null) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentPiece.shape[r][c] !== 0) {
          let x = currentPiece.x + c;
          let y = currentPiece.y + r;
          if (y >= 0) {
            let colIdx = currentPiece.type + 1;
            drawCell(x * cell, y * cell, colIdx);
          }
        }
      }
    }
  }
  fill(255);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text("Score: " + score, 5, 5);
  if (gameOver) {
    fill(0, 180);
    rect(0, 0, width, height);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2 - 20);
    noLoop();
    return;
  }
  let dropInterval = 30;
  if (keyIsDown(DOWN_ARROW)) {
    dropInterval = 2;
  }
  frameCounter++;
  if (frameCounter >= dropInterval) {
    frameCounter = 0;
    if (validPosition(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
      currentPiece.y += 1;
    } else {
      lockPiece();
      spawnPiece();
    }
  }
}
function keyPressed() {
  if (gameOver) {
    return;
  }
  if (keyCode === LEFT_ARROW) {
    if (currentPiece !== null) {
      if (validPosition(currentPiece.x - 1, currentPiece.y, currentPiece.shape)) {
        currentPiece.x -= 1;
      }
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (currentPiece !== null) {
      if (validPosition(currentPiece.x + 1, currentPiece.y, currentPiece.shape)) {
        currentPiece.x += 1;
      }
    }
  } else if (keyCode === UP_ARROW) {
    if (currentPiece !== null) {
      let rotated = rotateMatrix(currentPiece.shape);
      if (validPosition(currentPiece.x, currentPiece.y, rotated)) {
        currentPiece.shape = rotated;
      }
    }
  } else if (keyCode === DOWN_ARROW) {
    frameCounter = 0;
  }
}
