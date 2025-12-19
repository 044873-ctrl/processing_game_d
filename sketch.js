let player;
let bullets = [];
let invaders = [];
let invaderBullets = [];
let score = 0;

function setup() {
  createCanvas(800, 600);
  player = new Player();
  for (let i = 0; i < 12; i++) {
    invaders[i] = new Invader(i * 70 + 70, 60);
  }
}

function draw() {
  background(0);
  player.show();
  player.move();

  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].show();
    bullets[i].move();
    for (let j = invaders.length - 1; j >= 0; j--) {
      if (bullets[i].hits(invaders[j])) {
        invaders[j].destroy();
        bullets[i].evaporate();
        score++;
      }
    }
  }

  let edge = false;
  for (let i = 0; i < invaders.length; i++) {
    invaders[i].show();
    invaders[i].move();
    if (invaders[i].x > width || invaders[i].x < 0) {
      edge = true;
    }
  }

  if (edge) {
    for (let i = 0; i < invaders.length; i++) {
      invaders[i].shiftDown();
    }
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].toDelete) {
      bullets.splice(i, 1);
    }
  }

  for (let i = invaders.length - 1; i >= 0; i--) {
    if (invaders[i].toDelete) {
      invaders.splice(i, 1);
    }
  }
  
  for (let i = 0; i < invaders.length; i++) {
    if (random(1) < 0.005) {
      invaderBullets.push(new Bullet(invaders[i].x, invaders[i].y));
    }
  }

  for (let i = invaderBullets.length - 1; i >= 0; i--) {
    invaderBullets[i].show();
    invaderBullets[i].move();
    if (invaderBullets[i].hits(player)) {
      invaderBullets[i].evaporate();
      player = new Player();
    }
    if (invaderBullets[i].toDelete) {
      invaderBullets.splice(i, 1);
    }
  }

  text('Score: ' + score, 10, 50);
}

function keyPressed() {
  if (key === ' ') {
    let bullet = new Bullet(player.x, height);
    bullets.push(bullet);
  }

  if (keyCode === RIGHT_ARROW) {
    player.setDirection(1);
  } else if (keyCode === LEFT_ARROW) {
    player.setDirection(-1);
  }
}

function keyReleased() {
  if (key !== ' ') {
    player.setDirection(0);
  }
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 20;
    this.xdir = 0;
  }

  show() {
    fill(255);
    rectMode(CENTER);
    rect(this.x, this.y, 20, 60);
  }

  setDirection(dir) {
    this.xdir = dir;
  }

  move() {
    this.x += this.xdir*5;
  }
}

class Invader {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 30;
    this.toDelete = false;
    this.xdir = 1;
    this.ydir = 0;
  }

  destroy() {
    this.toDelete = true;
  }

  shiftDown() {
    this.xdir *= -1;
    this.y += this.r;
  }

  move() {
    this.x = this.x + this.xdir;
  }

  show() {
    fill(255, 0, 200);
    ellipse(this.x, this.y, this.r*2, this.r*2);
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 8;
    this.toDelete = false;
  }

  evaporate() {
    this.toDelete = true;
  }

  show() {
    fill(150);
    ellipse(this.x, this.y, this.r*2, this.r*2);
  }

  move() {
    this.y = this.y - 5;
  }

  hits(invader) {
    let d = dist(this.x, this.y, invader.x, invader.y);
    if (d < this.r + invader.r) {
      return true;
    } else {
      return false;
    }
  }
}
