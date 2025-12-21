let cols = 10;
let rows = 20;
let cellSize = 30;
let grid = [];
let pieces = [];
let pieceColors = [];
let currentPiece = null;
let dropCounter = 0;
let dropInterval = 60;
let score = 0;
let gameOver = false;
function setup() {
  createCanvas(300, 600);
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      row.push(0);
    }
    grid.push(row);
  }
  pieceColors = [
    color(0, 255, 255),
    color(255, 255, 0),
    color(128, 0, 128),
    color(255, 165, 0),
    color(0, 0, 255),
    color(0, 255, 0),
    color(255, 0, 0),
    color(200, 200, 200)
  ];
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
    ],
    [
      [0,1,0,0],
      [0,1,0,0],
      [0,1,0,0],
      [0,1,0,0]
    ]
  ];
  spawnPiece();
  textSize(16);
  textAlign(LEFT, TOP);
}
function draw() {
  background(30);
  noStroke();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let val = grid[r][c];
      if (val !== 0) {
        fill(pieceColors[val - 1]);
      } else {
        fill(50);
      }
      rect(c * cellSize, r * cellSize, cellSize, cellSize);
      fill(40);
      stroke(20);
      line(c * cellSize, r * cellSize + cellSize, c * cellSize + cellSize, r * cellSize + cellSize);
      line(c * cellSize + cellSize, r * cellSize, c * cellSize + cellSize, r * cellSize + cellSize);
      noStroke();
    }
  }
  if (currentPiece !== null) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentPiece.matrix[r][c] === 1) {
          let gx = currentPiece.x + c;
          let gy = currentPiece.y + r;
          if (gy >= 0 && gy < rows && gx >= 0 && gx < cols) {
            fill(pieceColors[currentPiece.type]);
            rect(gx * cellSize, gy * cellSize, cellSize, cellSize);
          }
        }
      }
    }
  }
  if (!gameOver) {
    dropInterval = keyIsDown(DOWN_ARROW) ? 1 : 60;
    dropCounter++;
    if (dropCounter >= dropInterval) {
      dropCounter = 0;
      if (currentPiece !== null) {
        let moved = tryMove(0, 1);
        if (!moved) {
          lockPiece();
          clearLines();
          spawnPiece();
        }
      }
    }
  }
  fill(255);
  text("Score: " + score, 5, 5);
  if (gameOver) {
    fill(0, 0, 0, 180);
    rect(0, height / 2 - 40, width, 80);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
    textSize(16);
    textAlign(LEFT, TOP);
  }
}
function spawnPiece() {
  let idx = floor(random(pieces.length));
  let matrix = [];
  for (let r = 0; r < 4; r++) {
    let row = [];
    for (let c = 0; c < 4; c++) {
      row.push(pieces[idx][r][c]);
    }
    matrix.push(row);
  }
  let startX = floor((cols - 4) / 2);
  let startY = -1;
  currentPiece = {matrix: matrix, x: startX, y: startY, type: idx};
  if (collides(currentPiece.matrix, currentPiece.x, currentPiece.y)) {
    gameOver = true;
  }
}
function collides(mat, px, py) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (mat[r][c] === 1) {
        let gx = px + c;
        let gy = py + r;
        if (gx < 0 || gx >= cols || gy >= rows) {
          return true;
        }
        if (gy >= 0) {
          if (grid[gy][gx] !== 0) {
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
  if (!collides(currentPiece.matrix, nx, ny)) {
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
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (currentPiece.matrix[r][c] === 1) {
        let gx = currentPiece.x + c;
        let gy = currentPiece.y + r;
        if (gy >= 0 && gy < rows && gx >= 0 && gx < cols) {
          grid[gy][gx] = currentPiece.type + 1;
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
function rotateMatrix(mat) {
  let res = [];
  for (let r = 0; r < 4; r++) {
    let row = [];
    for (let c = 0; c < 4; c++) {
      row.push(0);
    }
    res.push(row);
  }
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      res[c][3 - r] = mat[r][c];
    }
  }
  return res;
}
function keyPressed() {
  if (gameOver) {
    return;
  }
  if (keyCode === LEFT_ARROW) {
    tryMove(-1, 0);
  } else if (keyCode === RIGHT_ARROW) {
    tryMove(1, 0);
  } else if (keyCode === UP_ARROW) {
    if (currentPiece !== null) {
      let rotated = rotateMatrix(currentPiece.matrix);
      if (!collides(rotated, currentPiece.x, currentPiece.y)) {
        currentPiece.matrix = rotated;
      }
    }
  } else if (keyCode === DOWN_ARROW) {
    if (currentPiece !== null) {
      if (!tryMove(0, 1)) {
        lockPiece();
        clearLines();
        spawnPiece();
      }
    }
  }
}
