let cols = 10;
let rows = 20;
let cellSize = 30;
let board = [];
let shapes = [];
let colors = [];
let current = null;
let frameCounter = 0;
let dropInterval = 30;
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
function cloneMatrix(mat) {
  let out = [];
  for (let r = 0; r < 4; r++) {
    let row = [];
    for (let c = 0; c < 4; c++) {
      row.push(mat[r][c]);
    }
    out.push(row);
  }
  return out;
}
function rotateMatrix(mat) {
  let out = [];
  for (let r = 0; r < 4; r++) {
    let row = [];
    for (let c = 0; c < 4; c++) {
      row.push(0);
    }
    out.push(row);
  }
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      out[c][3 - r] = mat[r][c];
    }
  }
  return out;
}
function getMatrix(type, rot) {
  let m = cloneMatrix(shapes[type]);
  for (let i = 0; i < (rot % 4 + 4) % 4; i++) {
    m = rotateMatrix(m);
  }
  return m;
}
function collides(mat, x, y) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (mat[r][c] === 1) {
        let tx = x + c;
        let ty = y + r;
        if (tx < 0 || tx >= cols) {
          return true;
        }
        if (ty >= rows) {
          return true;
        }
        if (ty >= 0) {
          if (board[ty][tx] !== 0) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
function spawnNew() {
  let type = Math.floor(Math.random() * shapes.length);
  let rot = 0;
  let x = 3;
  let y = 0;
  let mat = getMatrix(type, rot);
  current = { type: type, rot: rot, x: x, y: y, mat: mat };
  if (collides(current.mat, current.x, current.y)) {
    gameOver = true;
  }
}
function lockPiece() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (current.mat[r][c] === 1) {
        let tx = current.x + c;
        let ty = current.y + r;
        if (ty >= 0 && ty < rows && tx >= 0 && tx < cols) {
          board[ty][tx] = current.type + 1;
        }
      }
    }
  }
  let linesCleared = 0;
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
      linesCleared++;
      r++;
    }
  }
  if (linesCleared > 0) {
    score += linesCleared * 100;
  }
  spawnNew();
}
function dropPiece() {
  if (!collides(current.mat, current.x, current.y + 1)) {
    current.y += 1;
  } else {
    lockPiece();
  }
}
function movePiece(dx) {
  if (!collides(current.mat, current.x + dx, current.y)) {
    current.x += dx;
  }
}
function rotatePiece() {
  let newRot = (current.rot + 1) % 4;
  let newMat = getMatrix(current.type, newRot);
  if (!collides(newMat, current.x, current.y)) {
    current.rot = newRot;
    current.mat = newMat;
    return;
  }
  let kicks = [-1, 1, -2, 2];
  for (let i = 0; i < kicks.length; i++) {
    let k = kicks[i];
    if (!collides(newMat, current.x + k, current.y)) {
      current.x += k;
      current.rot = newRot;
      current.mat = newMat;
      return;
    }
  }
}
function setupShapes() {
  shapes = [];
  shapes.push([
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ]);
  shapes.push([
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ]);
  shapes.push([
    [0,1,0,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ]);
  shapes.push([
    [0,0,1,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ]);
  shapes.push([
    [1,0,0,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ]);
  shapes.push([
    [0,1,1,0],
    [1,1,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ]);
  shapes.push([
    [1,1,0,0],
    [0,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ]);
}
function setupColors() {
  colors = [
    '#00f0f0',
    '#f0f000',
    '#a000f0',
    '#f0a000',
    '#0000f0',
    '#00f000',
    '#f00000'
  ];
}
function keyPressed() {
  if (gameOver) {
    return;
  }
  if (keyCode === LEFT_ARROW) {
    movePiece(-1);
  } else if (keyCode === RIGHT_ARROW) {
    movePiece(1);
  } else if (keyCode === UP_ARROW) {
    rotatePiece();
  } else if (keyCode === DOWN_ARROW) {
    dropPiece();
  }
}
function setup() {
  createCanvas(cols * cellSize, rows * cellSize);
  board = createEmptyBoard();
  setupShapes();
  setupColors();
  frameCounter = 0;
  score = 0;
  gameOver = false;
  spawnNew();
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  fill(255);
}
function draw() {
  background(30);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let v = board[r][c];
      if (v === 0) {
        fill(40);
      } else {
        fill(colors[v - 1]);
      }
      rect(c * cellSize, r * cellSize, cellSize - 1, cellSize - 1);
    }
  }
  if (!gameOver && current !== null) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (current.mat[r][c] === 1) {
          let tx = current.x + c;
          let ty = current.y + r;
          if (ty >= 0) {
            fill(colors[current.type]);
            rect(tx * cellSize, ty * cellSize, cellSize - 1, cellSize - 1);
          } else {
            fill(colors[current.type]);
            rect(tx * cellSize, 0, cellSize - 1, cellSize - 1);
          }
        }
      }
    }
  }
  fill(255);
  text('Score: ' + score, 5, 5);
  if (gameOver) {
    fill(200, 50, 50);
    textSize(32);
    textAlign(CENTER, CENTER);
    text('GAME OVER', width / 2, height / 2);
    textSize(16);
    textAlign(LEFT, TOP);
    return;
  }
  frameCounter++;
  if (keyIsDown(DOWN_ARROW)) {
    dropPiece();
    frameCounter = 0;
  } else {
    if (frameCounter >= dropInterval) {
      dropPiece();
      frameCounter = 0;
    }
  }
}
