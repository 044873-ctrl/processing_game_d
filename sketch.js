let cols = 15;
let rows = 20;
let cellSize = 30;
let grid = [];
let pieces = [];
let colors = [];
let currentPiece = null;
let frameCounter = 0;
let baseFallInterval = 30;
let softDropInterval = 2;
let score = 0;
let gameOver = false;

function setup() {
  createCanvas(cols * cellSize, rows * cellSize);
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      row.push(0);
    }
    grid.push(row);
  }
  pieces = [
    [
      [0,0,0,0,0],
      [0,0,0,0,0],
      [1,1,1,1,0],
      [0,0,0,0,0],
      [0,0,0,0,0]
    ],
    [
      [0,0,0,0,0],
      [0,0,1,1,0],
      [0,0,1,1,0],
      [0,0,0,0,0],
      [0,0,0,0,0]
    ],
    [
      [0,0,0,0,0],
      [0,0,1,0,0],
      [0,1,1,1,0],
      [0,0,0,0,0],
      [0,0,0,0,0]
    ],
    [
      [0,0,0,0,0],
      [0,0,0,1,0],
      [0,1,1,1,0],
      [0,0,0,0,0],
      [0,0,0,0,0]
    ],
    [
      [0,0,0,0,0],
      [0,1,0,0,0],
      [0,1,1,1,0],
      [0,0,0,0,0],
      [0,0,0,0,0]
    ],
    [
      [0,0,0,0,0],
      [0,0,1,1,0],
      [0,1,1,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0]
    ],
    [
      [0,0,0,0,0],
      [0,1,1,0,0],
      [0,0,1,1,0],
      [0,0,0,0,0],
      [0,0,0,0,0]
    ]
  ];
  colors = [
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
  textAlign(CENTER, CENTER);
  textSize(18);
}

function draw() {
  background(30);
  stroke(60);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let val = grid[r][c];
      if (val !== 0) {
        fill(colors[val]);
        noStroke();
        rect(c * cellSize, r * cellSize, cellSize, cellSize);
        stroke(60);
      } else {
        noFill();
        rect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }
  }
  if (currentPiece !== null) {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (currentPiece.shape[r][c] === 1) {
          let bx = currentPiece.x + c;
          let by = currentPiece.y + r;
          if (by >= 0 && by < rows && bx >= 0 && bx < cols) {
            fill(colors[currentPiece.color]);
            noStroke();
            rect(bx * cellSize, by * cellSize, cellSize, cellSize);
            stroke(60);
          }
        }
      }
    }
  }
  let interval = keyIsDown(DOWN_ARROW) ? softDropInterval : baseFallInterval;
  frameCounter++;
  if (!gameOver && frameCounter >= interval) {
    frameCounter = 0;
    if (currentPiece !== null) {
      if (!tryMove(0, 1)) {
        lockPiece();
        clearLines();
        spawnPiece();
      }
    }
  }
  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  text("Score: " + score, 6, 6);
  if (gameOver) {
    fill(0,0,0,180);
    rect(width/2 - 120, height/2 - 40, 240, 80);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("GAME OVER", width/2, height/2 - 6);
    textSize(16);
    text("Score: " + score, width/2, height/2 + 18);
  }
}

function keyPressed() {
  if (gameOver) {
    return;
  }
  if (keyCode === LEFT_ARROW) {
    tryMove(-1, 0);
  } else if (keyCode === RIGHT_ARROW) {
    tryMove(1, 0);
  } else if (keyCode === DOWN_ARROW) {
    if (currentPiece !== null) {
      if (!tryMove(0, 1)) {
        lockPiece();
        clearLines();
        spawnPiece();
      }
    }
  } else if (keyCode === UP_ARROW) {
    rotateCurrent();
  }
}

function spawnPiece() {
  let idx = floor(random(0, pieces.length));
  let shape = cloneMatrix(pieces[idx]);
  let px = floor((cols - 5) / 2);
  let py = -1;
  let colorIdx = idx + 1;
  currentPiece = {
    x: px,
    y: py,
    shape: shape,
    color: colorIdx
  };
  if (pieceCollides(currentPiece.x, currentPiece.y, currentPiece.shape)) {
    gameOver = true;
  }
}

function cloneMatrix(mat) {
  let out = [];
  for (let r = 0; r < mat.length; r++) {
    let row = [];
    for (let c = 0; c < mat[r].length; c++) {
      row.push(mat[r][c]);
    }
    out.push(row);
  }
  return out;
}

function pieceCollides(px, py, shape) {
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (shape[r][c] === 1) {
        let bx = px + c;
        let by = py + r;
        if (bx < 0 || bx >= cols) {
          return true;
        }
        if (by >= rows) {
          return true;
        }
        if (by >= 0) {
          if (grid[by][bx] !== 0) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

function tryMove(dx, dy) {
  if (currentPiece === null) {
    return false;
  }
  let nx = currentPiece.x + dx;
  let ny = currentPiece.y + dy;
  if (!pieceCollides(nx, ny, currentPiece.shape)) {
    currentPiece.x = nx;
    currentPiece.y = ny;
    return true;
  }
  return false;
}

function lockPiece() {
  if (currentPiece === null) {
    return;
  }
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (currentPiece.shape[r][c] === 1) {
        let bx = currentPiece.x + c;
        let by = currentPiece.y + r;
        if (by >= 0 && by < rows && bx >= 0 && bx < cols) {
          grid[by][bx] = currentPiece.color;
        }
      }
    }
  }
  currentPiece = null;
}

function clearLines() {
  let linesCleared = 0;
  for (let r = rows - 1; r >= 0; r--) {
    let full = true;
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 0) {
        full = false;
        break;
      }
    }
    if (full) {
      grid.splice(r, 1);
      let newRow = [];
      for (let c = 0; c < cols; c++) {
        newRow.push(0);
      }
      grid.unshift(newRow);
      linesCleared++;
      r++;
    }
  }
  if (linesCleared > 0) {
    score += linesCleared * 100;
  }
}

function rotateMatrix(shape) {
  let n = 5;
  let out = [];
  for (let r = 0; r < n; r++) {
    let row = [];
    for (let c = 0; c < n; c++) {
      row.push(0);
    }
    out.push(row);
  }
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      out[r][c] = shape[n - 1 - c][r];
    }
  }
  return out;
}

function rotateCurrent() {
  if (currentPiece === null) {
    return;
  }
  let rotated = rotateMatrix(currentPiece.shape);
  if (!pieceCollides(currentPiece.x, currentPiece.y, rotated)) {
    currentPiece.shape = rotated;
  }
}
