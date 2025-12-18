let canvasSide = 600;
let blockSide = canvasSide / 20;
let rows = canvasSide / blockSide;
let cols = canvasSide / blockSide;
let grid = create2DArray(rows, cols);
let current;
let score = 0;

function setup() {
  createCanvas(canvasSide, canvasSide);
  frameRate(5);
  current = new Block();
}

function draw() {
  background(51);
  current.show();
  current.update();
  for (let i = rows - 1; i >= 0; i--) {
    for (let j = cols - 1; j >= 0; j--) {
      if (grid[i][j]) {
        fill(255);
        rect(j * blockSide, i * blockSide, blockSide, blockSide);
      }
    }
  }
  checkGameOver();
  checkRows();
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    current.moveDown();
  } else if (keyCode === RIGHT_ARROW) {
    current.moveRight();
  } else if (keyCode === LEFT_ARROW) {
    current.moveLeft();
  } else if (keyCode === UP_ARROW) {
    current.rotate();
  }
}

function checkGameOver() {
  for (let i = 0; i < cols; i++) {
    if (grid[0][i]) {
      noLoop();
      alert("Game Over. Your score is " + score);
    }
  }
}

function checkRows() {
  for (let i = rows - 1; i >= 0; i--) {
    let full = true;
    for (let j = cols - 1; j >= 0; j--) {
      if (!grid[i][j]) {
        full = false;
      }
    }
    if (full) {
      score++;
      grid.splice(i, 1);
      grid.unshift(new Array(cols).fill(false));
    }
  }
}

function create2DArray(rows, cols) {
  let arr = new Array(rows);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols).fill(false);
  }
  return arr;
}

class Block {
  constructor() {
    this.squares = this.newBlock();
    this.topLeft = createVector(cols / 2 - 1, 0);
  }

  newBlock() {
    let blocks = [
      // long vertical block
      [createVector(0, 0), createVector(0, 1), createVector(0, 2), createVector(0, 3)],
      // square block
      [createVector(0, 0), createVector(1, 0), createVector(0, 1), createVector(1, 1)],
      // T block
      [createVector(1, 0), createVector(0, 1), createVector(1, 1), createVector(2, 1)],
      // Z block
      [createVector(0, 0), createVector(1, 0), createVector(1, 1), createVector(2, 1)],
      // S block
      [createVector(1, 0), createVector(2, 0), createVector(0, 1), createVector(1, 1)],
      // J block
      [createVector(0, 0), createVector(0, 1), createVector(1, 1), createVector(2, 1)],
      // L block
      [createVector(2, 0), createVector(0, 1), createVector(1, 1), createVector(2, 1)]
    ];
    return blocks[floor(random(blocks.length))];
  }

  show() {
    fill(255);
    for (let i = 0; i < this.squares.length; i++) {
      let pos = p5.Vector.add(this.squares[i], this.topLeft);
      rect(pos.x * blockSide, pos.y * blockSide, blockSide, blockSide);
    }
  }

  update() {
    if (this.canMoveDown()) {
      this.topLeft.y++;
    } else {
      this.merge();
      current = new Block();
    }
  }

  canMoveDown() {
    this.topLeft.y++;
    let result = this.isValid();
    this.topLeft.y--;
    return result;
  }

  merge() {
    for (let i = 0; i < this.squares.length; i++) {
      let pos = p5.Vector.add(this.squares[i], this.topLeft);
      grid[pos.y][pos.x] = true;
    }
  }

  isValid() {
    for (let i = 0; i < this.squares.length; i++) {
      let pos = p5.Vector.add(this.squares[i], this.topLeft);
      if (!pos.x < 0 || pos.x >= cols || pos.y >= rows || grid[pos.y][pos.x]) {
        return false;
      }
    }
    return true;
  }

  moveDown() {
    if (this.canMoveDown()) {
      this.topLeft.y++;
    }
  }

  moveRight() {
    this.topLeft.x++;
    if (!this.isValid()) {
      this.topLeft.x--;
    }
  }

  moveLeft() {
    this.topLeft.x--;
    if (!this.isValid()) {
      this.topLeft.x++;
    }
  }

  rotate() {
    let pivot = this.squares[1];
    for (let i = 0; i < this.squares.length; i++) {
      let rel = p5.Vector.sub(this.squares[i], pivot);
      this.squares[i] = createVector(rel.y, -rel.x);
    }
    if (!this.isValid()) {
      for (let i = 0; i < this.squares.length; i++) {
        let rel = p5.Vector.sub(this.squares[i], pivot);
        this.squares[i] = createVector(-rel.y, rel.x);
      }
    }
  }
}
