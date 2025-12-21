let canvasW = 600;
let canvasH = 400;
let paddleW = 10;
let paddleH = 80;
let playerX = 20;
let playerY = 0;
let cpuX = 0;
let cpuY = 0;
let playerSpeed = 6;
let cpuMaxSpeed = 5;
let cpuMissTimer = 0;
let cpuTargetY = 0;
let cpuMissProb = 0.012;
let ballR = 8;
let ballX = 0;
let ballY = 0;
let ballVX = 4;
let ballVY = 3;
let maxBallVY = 8;
let leftScore = 0;
let rightScore = 0;
function resetBall() {
  ballX = canvasW / 2;
  ballY = canvasH / 2;
  ballVX = 4 * (Math.random() < 0.5 ? 1 : -1);
  ballVY = 3 * (Math.random() < 0.5 ? 1 : -1);
}
function setup() {
  createCanvas(canvasW, canvasH);
  playerY = canvasH / 2 - paddleH / 2;
  cpuX = canvasW - 20 - paddleW;
  cpuY = canvasH / 2 - paddleH / 2;
  cpuTargetY = cpuY;
  resetBall();
  leftScore = 0;
  rightScore = 0;
  textSize(32);
  textAlign(CENTER, TOP);
}
function draw() {
  background(0);
  stroke(255);
  for (let i = 0; i < canvasH; i += 20) {
    line(canvasW / 2, i, canvasW / 2, i + 10);
  }
  fill(255);
  rect(playerX, playerY, paddleW, paddleH);
  rect(cpuX, cpuY, paddleW, paddleH);
  ellipse(ballX, ballY, ballR * 2, ballR * 2);
  text(leftScore, canvasW * 0.25, 10);
  text(rightScore, canvasW * 0.75, 10);
  if (keyIsDown(UP_ARROW)) {
    playerY -= playerSpeed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    playerY += playerSpeed;
  }
  playerY = constrain(playerY, 0, canvasH - paddleH);
  if (cpuMissTimer > 0) {
    cpuMissTimer -= 1;
    let centerY = cpuY + paddleH / 2;
    let dy = cpuTargetY + paddleH / 2 - centerY;
    if (dy > cpuMaxSpeed) {
      dy = cpuMaxSpeed;
    }
    if (dy < -cpuMaxSpeed) {
      dy = -cpuMaxSpeed;
    }
    cpuY += dy;
  } else {
    if (ballX > canvasW / 2 && Math.random() < cpuMissProb) {
      cpuMissTimer = 30;
      cpuTargetY = Math.random() * (canvasH - paddleH);
      cpuTargetY = constrain(cpuTargetY, 0, canvasH - paddleH);
    } else {
      let desiredY = ballY - paddleH / 2;
      let centerY = cpuY + paddleH / 2;
      let dy = desiredY + paddleH / 2 - centerY;
      if (dy > cpuMaxSpeed) {
        dy = cpuMaxSpeed;
      }
      if (dy < -cpuMaxSpeed) {
        dy = -cpuMaxSpeed;
      }
      cpuY += dy;
    }
  }
  cpuY = constrain(cpuY, 0, canvasH - paddleH);
  ballX += ballVX;
  ballY += ballVY;
  if (ballY - ballR <= 0) {
    ballY = ballR;
    ballVY = -ballVY;
  }
  if (ballY + ballR >= canvasH) {
    ballY = canvasH - ballR;
    ballVY = -ballVY;
  }
  if (ballX - ballR <= playerX + paddleW && ballX + ballR >= playerX) {
    if (ballY >= playerY && ballY <= playerY + paddleH && ballVX < 0) {
      ballX = playerX + paddleW + ballR;
      ballVX = -ballVX;
      let offset = (ballY - (playerY + paddleH / 2)) / (paddleH / 2);
      ballVY = ballVY + offset * 5;
      ballVY = constrain(ballVY, -maxBallVY, maxBallVY);
    }
  }
  if (ballX + ballR >= cpuX && ballX - ballR <= cpuX + paddleW) {
    if (ballY >= cpuY && ballY <= cpuY + paddleH && ballVX > 0) {
      ballX = cpuX - ballR;
      ballVX = -ballVX;
      let offset = (ballY - (cpuY + paddleH / 2)) / (paddleH / 2);
      ballVY = ballVY + offset * 5;
      ballVY = constrain(ballVY, -maxBallVY, maxBallVY);
    }
  }
  if (ballX < 0) {
    rightScore += 1;
    resetBall();
  }
  if (ballX > canvasW) {
    leftScore += 1;
    resetBall();
  }
}
