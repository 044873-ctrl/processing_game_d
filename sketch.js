let cols = 10;
let rows = 20;
let cellSize = 30;
let board = [];
let shapes = [];
let colorsArr = [];
let currentPiece = null;
let score = 0;
let dropCounter = 0;
let baseDropInterval = 30;
let gameOver = false;
function setup() {
  createCanvas(300, 600);
  for (let r = 0; r < rows; r++) {
    let rowArr = [];
    for (let c = 0; c < cols; c++) {
      rowArr.push(0);
    }
    board.push(rowArr);
  }
  shapes = [
    [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,1,0,0],
      [1,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,0,1,0],
      [1,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [1,0,0,0],
      [1,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,1,1,0],
      [1,1,0,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [1,1,0,0],
      [0,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ]
  ];
  colorsArr = [
    color(0,0,0),
    color(0,255,255),
    color(255,255,0),
    color(128,0,128),
    color(255,165,0),
    color(0,0,255),
    color(0,255,0),
    color(255,0,0)
  ];
  spawnPiece();
  textSize(16);
  noStroke();
}
function draw() {
  background(20);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let val = board[r][c];
      if (val !== 0) {
        fill(colorsArr[val]);
        rect(c * cellSize, r * cellSize, cellSize, cellSize);
      } else {
        fill(30);
        rect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }
  }
  if (currentPiece !== null) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentPiece.shape[i][j] === 1) {
          let r = currentPiece.y + i;
          let c = currentPiece.x + j;
          if (r >= 0 && r < rows && c >= 0 && c < cols) {
            fill(colorsArr[currentPiece.color]);
            rect(c * cellSize, r * cellSize, cellSize, cellSize);
          }
        }
      }
    }
  }
  fill(255);
  text('Score: ' + score, 5, 18);
  if (gameOver) {
    fill(0,0,0,150);
    rect(0, height/2 - 40, width, 80);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text('Game Over', width/2, height/2);
    textSize(16);
    textAlign(LEFT, BASELINE);
    return;
  }
  let dropInterval = baseDropInterval;
  if (keyIsDown(DOWN_ARROW)) {
    dropInterval = 1;
  }
  dropCounter++;
  if (dropCounter >= dropInterval) {
    dropCounter = 0;
    stepDown();
  }
}
function spawnPiece() {
  let idx = floor(random(0, shapes.length));
  let shp = deepCopyShape(shapes[idx]);
  currentPiece = {
    shape: shp,
    x: 3,
    y: -1,
    color: idx + 1
  };
  if (collides(currentPiece.shape, currentPiece.x, currentPiece.y)) {
    gameOver = true;
  }
}
function deepCopyShape(s) {
  let out = [];
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      row.push(s[i][j]);
    }
    out.push(row);
  }
  return out;
}
function collides(mat, px, py) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (mat[i][j] === 0) continue;
      let r = py + i;
      let c = px + j;
      if (c < 0 || c >= cols) return true;
      if (r >= rows) return true;
      if (r >= 0) {
        if (board[r][c] !== 0) return true;
      }
    }
  }
  return false;
}
function stepDown() {
  if (currentPiece === null) return;
  if (!collides(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
    currentPiece.y += 1;
  } else {
    lockPiece();
    clearLines();
    spawnPiece();
  }
}
function lockPiece() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (currentPiece.shape[i][j] === 1) {
        let r = currentPiece.y + i;
        let c = currentPiece.x + j;
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          board[r][c] = currentPiece.color;
        }
      }
    }
  }
  currentPiece = null;
}
function clearLines() {
  let newBoard = [];
  for (let r = 0; r < rows; r++) {
    let full = true;
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 0) {
        full = false;
        break;
      }
    }
    if (!full) {
      newBoard.push(board[r].slice());
    }
  }
  let removed = rows - newBoard.length;
  for (let i = 0; i < removed; i++) {
    let emptyRow = [];
    for (let c = 0; c < cols; c++) {
      emptyRow.push(0);
    }
    newBoard.unshift(emptyRow);
  }
  board = newBoard;
  if (removed > 0) {
    score += removed * 100;
  }
}
function rotateMatrix(mat) {
  let nm = [];
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      row.push(0);
    }
    nm.push(row);
  }
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      nm[j][3 - i] = mat[i][j];
    }
  }
  return nm;
}
function keyPressed() {
  if (gameOver) return;
  if (currentPiece === null) return;
  if (keyCode === LEFT_ARROW) {
    if (!collides(currentPiece.shape, currentPiece.x - 1, currentPiece.y)) {
      currentPiece.x -= 1;
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (!collides(currentPiece.shape, currentPiece.x + 1, currentPiece.y)) {
      currentPiece.x += 1;
    }
  } else if (keyCode === UP_ARROW) {
    let rotated = rotateMatrix(currentPiece.shape);
    if (!collides(rotated, currentPiece.x, currentPiece.y)) {
      currentPiece.shape = rotated;
    }
  } else if (keyCode === DOWN_ARROW) {
    stepDown();
    dropCounter = 0;
  }
}
