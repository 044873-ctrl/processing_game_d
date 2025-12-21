let canvasW = 400;
let canvasH = 600;
let paddle = {};
let ball = {};
let blocks = [];
let particles = [];
let rows = 6;
let cols = 7;
let blockW = 0;
let blockH = 20;
let score = 0;
let gameOver = false;
let colorsByRow = [];
function setup() {
  createCanvas(canvasW, canvasH);
  blockW = floor(canvasW / cols);
  colorsByRow = [
    color(255, 99, 71),
    color(255, 165, 0),
    color(255, 215, 0),
    color(144, 238, 144),
    color(135, 206, 250),
    color(221, 160, 221)
  ];
  paddle.w = 90;
  paddle.h = 12;
  paddle.x = canvasW / 2;
  paddle.y = canvasH - 40;
  ball.r = 6;
  ball.x = canvasW / 2;
  ball.y = canvasH - 60;
  ball.vx = 4;
  ball.vy = -5;
  ball.prevX = ball.x;
  ball.prevY = ball.y;
  blocks = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let bx = c * blockW;
      let by = 50 + r * (blockH + 6);
      let b = new Block(bx, by, blockW - 4, blockH, colorsByRow[r]);
      blocks.push(b);
    }
  }
  particles = [];
  score = 0;
  gameOver = false;
  textAlign(LEFT, TOP);
  textSize(16);
  noStroke();
}
function draw() {
  background(30);
  updatePaddle();
  drawPaddle();
  drawBlocks();
  updateBall();
  drawBall();
  updateParticles();
  drawParticles();
  drawUI();
  checkGameOver();
}
function updatePaddle() {
  let mx = constrain(mouseX, 0, width);
  paddle.x = constrain(mx, paddle.w / 2, width - paddle.w / 2);
}
function drawPaddle() {
  rectMode(CENTER);
  fill(200);
  rect(paddle.x, paddle.y, paddle.w, paddle.h, 4);
}
function drawBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    let b = blocks[i];
    fill(b.col);
    rect(b.x + b.w / 2, b.y + b.h / 2, b.w, b.h, 4);
  }
}
function updateBall() {
  if (gameOver) {
    return;
  }
  ball.prevX = ball.x;
  ball.prevY = ball.y;
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.x - ball.r <= 0) {
    ball.x = ball.r;
    ball.vx = -ball.vx;
  } else if (ball.x + ball.r >= width) {
    ball.x = width - ball.r;
    ball.vx = -ball.vx;
  }
  if (ball.y - ball.r <= 0) {
    ball.y = ball.r;
    ball.vy = -ball.vy;
  }
  checkPaddleCollision();
  for (let i = blocks.length - 1; i >= 0; i--) {
    let b = blocks[i];
    if (circleRectCollision(ball.x, ball.y, ball.r, b.x, b.y, b.w, b.h)) {
      spawnParticles(b.x + b.w / 2, b.y + b.h / 2, b.col);
      blocks.splice(i, 1);
      score += 10;
      resolveBallBlockCollision(b);
    }
  }
}
function checkPaddleCollision() {
  let rx = paddle.x - paddle.w / 2;
  let ry = paddle.y - paddle.h / 2;
  if (circleRectCollision(ball.x, ball.y, ball.r, rx, ry, paddle.w, paddle.h)) {
    ball.y = paddle.y - paddle.h / 2 - ball.r;
    let rel = (ball.x - paddle.x) / (paddle.w / 2);
    rel = constrain(rel, -1, 1);
    let speed = sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    if (speed === 0) {
      speed = 6.4;
    }
    let maxAngle = radians(75);
    let angle = rel * maxAngle + -PI / 2;
    ball.vx = cos(angle) * speed;
    ball.vy = sin(angle) * speed;
    if (isNaN(ball.vx) || isNaN(ball.vy)) {
      ball.vx = 4;
      ball.vy = -5;
    }
  }
}
function resolveBallBlockCollision(b) {
  if (ball.prevY + ball.r <= b.y) {
    ball.vy = -abs(ball.vy);
    ball.y = b.y - ball.r;
  } else if (ball.prevY - ball.r >= b.y + b.h) {
    ball.vy = abs(ball.vy);
    ball.y = b.y + b.h + ball.r;
  } else if (ball.prevX + ball.r <= b.x) {
    ball.vx = -abs(ball.vx);
    ball.x = b.x - ball.r;
  } else if (ball.prevX - ball.r >= b.x + b.w) {
    ball.vx = abs(ball.vx);
    ball.x = b.x + b.w + ball.r;
  } else {
    ball.vy = -ball.vy;
  }
}
function circleRectCollision(cx, cy, r, rx, ry, rw, rh) {
  let closestX = constrain(cx, rx, rx + rw);
  let closestY = constrain(cy, ry, ry + rh);
  let dx = cx - closestX;
  let dy = cy - closestY;
  return dx * dx + dy * dy <= r * r;
}
function drawBall() {
  fill(255);
  ellipse(ball.x, ball.y, ball.r * 2, ball.r * 2);
}
function spawnParticles(x, y, col) {
  for (let i = 0; i < 3; i++) {
    let ang = random(0, TWO_PI);
    let spd = random(1, 3);
    let pvx = cos(ang) * spd;
    let pvy = sin(ang) * spd;
    let p = new Particle(x, y, pvx, pvy, col);
    particles.push(p);
  }
}
function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    if (p.age >= p.lifespan) {
      particles.splice(i, 1);
    }
  }
}
function drawParticles() {
  for (let i = 0; i < particles.length; i++) {
    particles[i].draw();
  }
}
function drawUI() {
  fill(255);
  textSize(16);
  text("Score: " + score, 8, 8);
  if (gameOver) {
    textAlign(CENTER, CENTER);
    textSize(32);
    text("GAME OVER", width / 2, height / 2 - 10);
    textSize(16);
    text("Refresh to play again", width / 2, height / 2 + 24);
    textAlign(LEFT, TOP);
  }
}
function checkGameOver() {
  if (!gameOver && ball.y - ball.r > height) {
    gameOver = true;
  }
}
function Block(x, y, w, h, col) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.col = col;
}
function Particle(x, y, vx, vy, col) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.age = 0;
  this.lifespan = 15;
  this.col = col;
  this.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.age++;
  };
  this.draw = function() {
    let alpha = map(this.age, 0, this.lifespan, 255, 0);
    fill(red(this.col), green(this.col), blue(this.col), alpha);
    ellipse(this.x, this.y, 6, 6);
  };
}
