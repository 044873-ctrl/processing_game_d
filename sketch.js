let grid;
let sizeGrid = 4;
let tileSize = 100;
let score = 0;
let gameOver = false;
function createEmptyGrid() {
  let g = [];
  for (let r = 0; r < sizeGrid; r++) {
    let row = [];
    for (let c = 0; c < sizeGrid; c++) {
      row.push(0);
    }
    g.push(row);
  }
  return g;
}
function addRandomTile() {
  let empties = [];
  for (let r = 0; r < sizeGrid; r++) {
    for (let c = 0; c < sizeGrid; c++) {
      if (grid[r][c] === 0) {
        empties.push([r, c]);
      }
    }
  }
  if (empties.length === 0) {
    return;
  }
  let idx = Math.floor(Math.random() * empties.length);
  let pos = empties[idx];
  grid[pos[0]][pos[1]] = 2;
}
function compressLine(line) {
  let res = [];
  for (let i = 0; i < line.length; i++) {
    if (line[i] !== 0) {
      res.push(line[i]);
    }
  }
  return res;
}
function arraysEqual(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
function moveLeft() {
  let moved = false;
  for (let r = 0; r < sizeGrid; r++) {
    let original = grid[r].slice();
    let line = grid[r].slice();
    let comp = compressLine(line);
    let merged = [];
    let i = 0;
    while (i < comp.length) {
      if (i + 1 < comp.length && comp[i] === comp[i + 1]) {
        let val = comp[i] * 2;
        merged.push(val);
        score += val;
        i += 2;
      } else {
        merged.push(comp[i]);
        i += 1;
      }
    }
    while (merged.length < sizeGrid) {
      merged.push(0);
    }
    grid[r] = merged;
    if (!arraysEqual(original, grid[r])) {
      moved = true;
    }
  }
  return moved;
}
function moveRight() {
  let moved = false;
  for (let r = 0; r < sizeGrid; r++) {
    let original = grid[r].slice();
    let rev = grid[r].slice().reverse();
    let comp = compressLine(rev);
    let merged = [];
    let i = 0;
    while (i < comp.length) {
      if (i + 1 < comp.length && comp[i] === comp[i + 1]) {
        let val = comp[i] * 2;
        merged.push(val);
        score += val;
        i += 2;
      } else {
        merged.push(comp[i]);
        i += 1;
      }
    }
    while (merged.length < sizeGrid) {
      merged.push(0);
    }
    merged = merged.reverse();
    grid[r] = merged;
    if (!arraysEqual(original, grid[r])) {
      moved = true;
    }
  }
  return moved;
}
function moveUp() {
  let moved = false;
  for (let c = 0; c < sizeGrid; c++) {
    let col = [];
    for (let r = 0; r < sizeGrid; r++) {
      col.push(grid[r][c]);
    }
    let original = col.slice();
    let comp = compressLine(col);
    let merged = [];
    let i = 0;
    while (i < comp.length) {
      if (i + 1 < comp.length && comp[i] === comp[i + 1]) {
        let val = comp[i] * 2;
        merged.push(val);
        score += val;
        i += 2;
      } else {
        merged.push(comp[i]);
        i += 1;
      }
    }
    while (merged.length < sizeGrid) {
      merged.push(0);
    }
    for (let r = 0; r < sizeGrid; r++) {
      grid[r][c] = merged[r];
    }
    let newCol = [];
    for (let r = 0; r < sizeGrid; r++) {
      newCol.push(grid[r][c]);
    }
    if (!arraysEqual(original, newCol)) {
      moved = true;
    }
  }
  return moved;
}
function moveDown() {
  let moved = false;
  for (let c = 0; c < sizeGrid; c++) {
    let col = [];
    for (let r = 0; r < sizeGrid; r++) {
      col.push(grid[r][c]);
    }
    let original = col.slice();
    let rev = col.slice().reverse();
    let comp = compressLine(rev);
    let merged = [];
    let i = 0;
    while (i < comp.length) {
      if (i + 1 < comp.length && comp[i] === comp[i + 1]) {
        let val = comp[i] * 2;
        merged.push(val);
        score += val;
        i += 2;
      } else {
        merged.push(comp[i]);
        i += 1;
      }
    }
    while (merged.length < sizeGrid) {
      merged.push(0);
    }
    merged = merged.reverse();
    for (let r = 0; r < sizeGrid; r++) {
      grid[r][c] = merged[r];
    }
    let newCol = [];
    for (let r = 0; r < sizeGrid; r++) {
      newCol.push(grid[r][c]);
    }
    if (!arraysEqual(original, newCol)) {
      moved = true;
    }
  }
  return moved;
}
function canMove() {
  for (let r = 0; r < sizeGrid; r++) {
    for (let c = 0; c < sizeGrid; c++) {
      if (grid[r][c] === 0) {
        return true;
      }
    }
  }
  for (let r = 0; r < sizeGrid; r++) {
    for (let c = 0; c < sizeGrid - 1; c++) {
      if (grid[r][c] === grid[r][c + 1]) {
        return true;
      }
    }
  }
  for (let c = 0; c < sizeGrid; c++) {
    for (let r = 0; r < sizeGrid - 1; r++) {
      if (grid[r][c] === grid[r + 1][c]) {
        return true;
      }
    }
  }
  return false;
}
function initGame() {
  grid = createEmptyGrid();
  score = 0;
  gameOver = false;
  addRandomTile();
  addRandomTile();
}
function drawTile(x, y, val) {
  let bg;
  if (val === 0) {
    bg = color(200);
  } else if (val === 2) {
    bg = color(240, 230, 210);
  } else if (val === 4) {
    bg = color(240, 220, 180);
  } else if (val === 8) {
    bg = color(240, 160, 100);
  } else if (val === 16) {
    bg = color(240, 140, 90);
  } else if (val === 32) {
    bg = color(240, 120, 80);
  } else if (val === 64) {
    bg = color(240, 100, 60);
  } else {
    bg = color(50, 150, 200);
  }
  fill(bg);
  stroke(120);
  rect(x, y, tileSize - 4, tileSize - 4, 8);
  if (val !== 0) {
    fill(val <= 4 ? 50 : 255);
    textSize(val < 128 ? 32 : 24);
    textAlign(CENTER, CENTER);
    text(val, x + (tileSize - 4) / 2, y + (tileSize - 4) / 2);
  }
}
function setup() {
  createCanvas(400, 400);
  initGame();
}
function draw() {
  background(180);
  for (let r = 0; r < sizeGrid; r++) {
    for (let c = 0; c < sizeGrid; c++) {
      let x = c * tileSize + 10;
      let y = r * tileSize + 10;
      drawTile(x, y, grid[r][c]);
    }
  }
  fill(0);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 10 + sizeGrid * tileSize);
  if (gameOver) {
    fill(0, 150);
    rect(0, 0, width, height);
    fill(255);
    textSize(36);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2 - 20);
    textSize(18);
    text("Press R to restart", width / 2, height / 2 + 20);
  }
}
function keyPressed() {
  if (key === 'r' || key === 'R') {
    initGame();
    return;
  }
  if (gameOver) {
    return;
  }
  let moved = false;
  if (keyCode === LEFT_ARROW || key === 'a' || key === 'A') {
    moved = moveLeft();
  } else if (keyCode === RIGHT_ARROW || key === 'd' || key === 'D') {
    moved = moveRight();
  } else if (keyCode === UP_ARROW || key === 'w' || key === 'W') {
    moved = moveUp();
  } else if (keyCode === DOWN_ARROW || key === 's' || key === 'S') {
    moved = moveDown();
  }
  if (moved) {
    addRandomTile();
    if (!canMove()) {
      gameOver = true;
    }
  }
}
