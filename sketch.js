let canvasW = 600;
let canvasH = 400;
let paddleW = 10;
let paddleH = 80;
let playerX = 10;
let cpuX = canvasW - 10 - paddleW;
let playerY = canvasH / 2 - paddleH / 2;
let cpuY = canvasH / 2 - paddleH / 2;
let playerSpeed = 20;
let cpuMaxSpeed = 15;
let cpuMissFrames = 0;
let cpuMissTargetY = canvasH / 2;
let ball = {
  x: canvasW / 2,
  y: canvasH / 2,
  r: 8,
  vx: 100,
  vy: 100
};
let leftScore = 0;
let rightScore = 0;
function resetBall(direction) {
  ball.x = canvasW / 2;
  ball.y = canvasH / 2;
  ball.vx = 100;
  ball.vy = 100;
  if (direction === "left") {
    ball.vx = -Math.abs(ball.vx);
  } else if (direction === "right") {
    ball.vx = Math.abs(ball.vx);
  } else {
    if (random() < 0.5) {
      ball.vx = -Math.abs(ball.vx);
    } else {
      ball.vx = Math.abs(ball.vx);
    }
  }
  if (random() < 0.5) {
    ball.vy = -Math.abs(ball.vy);
  } else {
    ball.vy = Math.abs(ball.vy);
  }
}
function clamp(val, a, b) {
  if (val < a) return a;
  if (val > b) return b;
  return val;
}
function setup() {
  createCanvas(canvasW, canvasH);
  textAlign(CENTER, TOP);
  textSize(24);
  resetBall();
}
function draw() {
  let dt = deltaTime / 1000;
  background(0);
  fill(255);
  rect(playerX, playerY, paddleW, paddleH);
  rect(cpuX, cpuY, paddleW, paddleH);
  ellipse(ball.x, ball.y, ball.r * 2, ball.r * 2);
  if (keyIsDown(38)) {
    playerY -= playerSpeed * dt;
  }
  if (keyIsDown(40)) {
    playerY += playerSpeed * dt;
  }
  playerY = clamp(playerY, 0, canvasH - paddleH);
  if (cpuMissFrames > 0) {
    cpuMissFrames -= 1;
    let targetCenter = cpuMissTargetY;
    let cpuCenter = cpuY + paddleH / 2;
    let dir = 0;
    if (targetCenter > cpuCenter + 0.5) dir = 1;
    else if (targetCenter < cpuCenter - 0.5) dir = -1;
    cpuY += dir * cpuMaxSpeed * dt;
  } else {
    if (ball.vx > 0 && ball.x > canvasW / 2) {
      if (random() < 0.01) {
        cpuMissFrames = 30;
        cpuMissTargetY = random(paddleH / 2, canvasH - paddleH / 2);
      }
    }
    let targetY = ball.y;
    let cpuCenter = cpuY + paddleH / 2;
    let diff = targetY - cpuCenter;
    if (Math.abs(diff) > 0.5) {
      let dir = diff > 0 ? 1 : -1;
      cpuY += dir * cpuMaxSpeed * dt;
    }
  }
  cpuY = clamp(cpuY, 0, canvasH - paddleH);
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  if (ball.y - ball.r < 0) {
    ball.y = ball.r;
    ball.vy = Math.abs(ball.vy);
  }
  if (ball.y + ball.r > canvasH) {
    ball.y = canvasH - ball.r;
    ball.vy = -Math.abs(ball.vy);
  }
  if (ball.vx < 0) {
    let paddleRight = playerX + paddleW;
    if (ball.x - ball.r <= paddleRight && ball.x - ball.r >= playerX - Math.abs(ball.vx) * dt - 1) {
      let paddleTop = playerY;
      let paddleBottom = playerY + paddleH;
      if (ball.y >= paddleTop && ball.y <= paddleBottom) {
        ball.x = paddleRight + ball.r;
        ball.vx = Math.abs(ball.vx);
        let paddleCenter = playerY + paddleH / 2;
        let offset = (ball.y - paddleCenter) / (paddleH / 2);
        if (!isNaN(offset)) {
          ball.vy += offset * 150;
        }
      }
    }
  } else if (ball.vx > 0) {
    let paddleLeft = cpuX;
    if (ball.x + ball.r >= paddleLeft && ball.x + ball.r <= paddleLeft + Math.abs(ball.vx) * dt + paddleW + 1) {
      let paddleTop = cpuY;
      let paddleBottom = cpuY + paddleH;
      if (ball.y >= paddleTop && ball.y <= paddleBottom) {
        ball.x = paddleLeft - ball.r;
        ball.vx = -Math.abs(ball.vx);
        let paddleCenter = cpuY + paddleH / 2;
        let offset = (ball.y - paddleCenter) / (paddleH / 2);
        if (!isNaN(offset)) {
          ball.vy += offset * 150;
        }
      }
    }
  }
  if (ball.x + ball.r < 0) {
    rightScore += 1;
    resetBall("right");
  }
  if (ball.x - ball.r > canvasW) {
    leftScore += 1;
    resetBall("left");
  }
  fill(255);
  text(leftScore, canvasW / 4, 10);
  text(rightScore, (canvasW / 4) * 3, 10);
}
