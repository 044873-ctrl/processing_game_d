let canvasW = 600;
let canvasH = 400;
let paddleW = 10;
let paddleH = 80;
let playerX = 10;
let cpuX = canvasW - 10 - paddleW;
let playerY = 0;
let cpuY = 0;
let playerSpeed = 20;
let cpuMaxSpeed = 15;
let ball = {
  x: 0,
  y: 0,
  vx: 15,
  vy: 30,
  r: 8
};
let leftScore = 0;
let rightScore = 0;
let cpuMissFramesLeft = 0;
let cpuMissDuration = 30;
let cpuTargetY = 0;
function setup() {
  createCanvas(canvasW, canvasH);
  playerY = (canvasH - paddleH) / 2;
  cpuY = (canvasH - paddleH) / 2;
  resetBall(Math.random() < 0.5 ? -1 : 1);
  textSize(32);
  textAlign(CENTER, CENTER);
}
function resetBall(dir) {
  ball.x = canvasW / 2;
  ball.y = canvasH / 2;
  ball.vx = Math.abs(15) * (dir >= 0 ? 1 : -1);
  ball.vy = Math.abs(30) * (Math.random() < 0.5 ? 1 : -1);
}
function draw() {
  background(0);
  if (keyIsDown(UP_ARROW)) {
    playerY -= playerSpeed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    playerY += playerSpeed;
  }
  playerY = constrain(playerY, 0, canvasH - paddleH);
  if (cpuMissFramesLeft > 0) {
    cpuMissFramesLeft -= 1;
  } else {
    if (ball.vx > 0 && Math.random() < 0.003) {
      cpuMissFramesLeft = cpuMissDuration;
      cpuTargetY = random(paddleH / 2, canvasH - paddleH / 2);
    }
  }
  let cpuCenterY = cpuY + paddleH / 2;
  let desiredCenter = cpuMissFramesLeft > 0 ? cpuTargetY : ball.y;
  let diff = desiredCenter - cpuCenterY;
  let move = constrain(diff, -cpuMaxSpeed, cpuMaxSpeed);
  cpuY += move;
  cpuY = constrain(cpuY, 0, canvasH - paddleH);
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.y - ball.r <= 0) {
    ball.y = ball.r;
    ball.vy *= -1;
  } else if (ball.y + ball.r >= canvasH) {
    ball.y = canvasH - ball.r;
    ball.vy *= -1;
  }
  if (ball.x - ball.r <= playerX + paddleW) {
    if (ball.y >= playerY && ball.y <= playerY + paddleH && ball.x + ball.r >= playerX) {
      ball.x = playerX + paddleW + ball.r;
      ball.vx = Math.abs(ball.vx);
      let rel = (ball.y - (playerY + paddleH / 2)) / (paddleH / 2);
      rel = constrain(rel, -1, 1);
      ball.vy = ball.vy + rel * 8;
    }
  }
  if (ball.x + ball.r >= cpuX) {
    if (ball.y >= cpuY && ball.y <= cpuY + paddleH && ball.x - ball.r <= cpuX + paddleW) {
      ball.x = cpuX - ball.r;
      ball.vx = -Math.abs(ball.vx);
      let rel = (ball.y - (cpuY + paddleH / 2)) / (paddleH / 2);
      rel = constrain(rel, -1, 1);
      ball.vy = ball.vy + rel * 8;
    }
  }
  if (ball.x < 0) {
    rightScore += 1;
    resetBall(-1);
    cpuMissFramesLeft = 0;
  } else if (ball.x > canvasW) {
    leftScore += 1;
    resetBall(1);
    cpuMissFramesLeft = 0;
  }
  fill(255);
  rect(playerX, playerY, paddleW, paddleH);
  rect(cpuX, cpuY, paddleW, paddleH);
  ellipse(ball.x, ball.y, ball.r * 2, ball.r * 2);
  text(leftScore, canvasW * 0.25, 30);
  text(rightScore, canvasW * 0.75, 30);
}
