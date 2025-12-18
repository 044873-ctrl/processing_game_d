let unit = 20;
let grid;
let current;
let score = 0;

function setup() {
  createCanvas(400, 800);
  grid = Array(40).fill().map(() => Array(20).fill(0));
  current = new Piece();
}

function draw() {
  background(220);
  current.show();
  current.update();
  
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] !== 0) {
        fill(255, 100, 100);
        rect(j*unit, i*unit, unit, unit);
      }
    }
  }
  checkLines();
}

function checkLines() {
  for (let i = grid.length - 1; i >= 0; i--) {
    if (grid[i].every(val => val === 1)) {
      score++;
      grid.splice(i, 1);
      grid.unshift(Array(20).fill(0));
    }
  }
}

class Piece {
  constructor() {
    this.x = 5;
    this.y = 0;
    this.shape = [
      [1, 1, 1, 1]
    ];
  }

  show() {
    fill(255);
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[i].length; j++) {
        if (this.shape[i][j] !== 0) {
          rect((this.x + j)*unit, (this.y + i)*unit, unit, unit);
        }
      }
    }
  }

  update() {
    this.y++;
    if (this.collision(0, 1)) {
      this.y--;
      this.merge();
      this.reset();
    }
  }

  reset() {
    this.y = 0;
    this.x = 5;
    this.shape = [[1, 1, 1, 1]];
  }

  merge() {
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[i].length; j++) {
        if (this.shape[i][j] !== 0) {
          grid[this.y + i][this.x + j] = 1;
        }
      }
    }
  }

  collision(dx, dy) {
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[i].length; j++) {
        let x = this.x + j + dx;
        let y = this.y + i + dy;
        if (this.shape[i][j] && (grid[y] && grid[y][x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  }
}
