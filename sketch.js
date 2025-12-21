let canvasW = 600;
let canvasH = 400;
let paddleW = 10;
let paddleH = 80;
let playerSpeed = 20;
let cpuMaxSpeed = 15;
let ballR = 8;
let playerX = 10;
let cpuX = canvasW - paddleW - 10;
let playerY = (canvasH - paddleH) / 2;
let cpuY = (canvasH - paddleH) / 2;
let ballX = canvasW / 2;
let ballY = canvasH / 2;
let ballVX = 4;
let ballVY = 3;
let leftScore = 0;
let rightScore = 0;
let cpuMissFrames = 0;
let cpuTargetY = canvasH / 2;
function resetBall() {
  ballX = canvasW / 2;
  ballY = canvasH / 2;
  ballVX = (random() < 0.5) ? 4 : -4;
  ballVY = (random() < 0.5) ? 3 : -3;
  cpuMissFrames = 0;
  cpuTargetY = canvasH / 2;
}
function setup() {
  createCanvas(canvasW, canvasH);
  resetBall();
  textSize(32);
  textAlign(CENTER, TOP);
}
function draw() {
  background(0);
  fill(255);
  rect(playerX, playerY, paddleW, paddleH);
  rect(cpuX, cpuY, paddleW, paddleH);
  ellipse(ballX, ballY, ballR * 2, ballR * 2);
  if (keyIsDown(UP_ARROW)) {
    playerY -= playerSpeed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    playerY += playerSpeed;
  }
  playerY = constrain(playerY, 0, canvasH - paddleH);
  if (cpuMissFrames > 0) {
    cpuMissFrames -= 1;
  }
  if (cpuMissFrames > 0) {
    let targetCenterY = cpuTargetY;
    let cpuCenterY = cpuY + paddleH / 2;
    let dy = targetCenterY - cpuCenterY;
    if (abs(dy) <= cpuMaxSpeed) {
      cpuY += dy;
    } else {
      cpuY += cpuMaxSpeed * (dy > 0 ? 1 : -1);
    }
  } else {
    if (ballVX > 0 && ballX > canvasW / 2 && random() < 0.01) {
      cpuMissFrames = 30;
      cpuTargetY = random(paddleH / 2, canvasH - paddleH / 2);
    } else {
      let targetCenterY = ballY;
      let cpuCenterY = cpuY + paddleH / 2;
      let dy = targetCenterY - cpuCenterY;
      if (abs(dy) <= cpuMaxSpeed) {
        cpuY += dy;
      } else {
        cpuY += cpuMaxSpeed * (dy > 0 ? 1 : -1);
      }
    }
  }
  cpuY = constrain(cpuY, 0, canvasH - paddleH);
  ballX += ballVX;
  ballY += ballVY;
  if (ballY - ballR <= 0) {
    ballY = ballR;
    ballVY = abs(ballVY);
  }
  if (ballY + ballR >= canvasH) {
    ballY = canvasH - ballR;
    ballVY = -abs(ballVY);
  }
  if (ballX - ballR <= playerX + paddleW && ballX - ballR >= playerX) {
    if (ballY >= playerY && ballY <= playerY + paddleH) {
      ballX = playerX + paddleW + ballR;
      ballVX = abs(ballVX);
      let relative = (ballY - (playerY + paddleH / 2)) / (paddleH / 2);
      ballVY = relative * 6;
      if (abs(ballVY) < 0.5) {
        ballVY = ballVY >= 0 ? 0.5 : -0.5;
      }
    }
  }
  if (ballX + ballR >= cpuX && ballX + ballR <= cpuX + paddleW) {
    if (ballY >= cpuY && ballY <= cpuY + paddleH) {
      ballX = cpuX - ballR;
      ballVX = -abs(ballVX);
      let relative = (ballY - (cpuY + paddleH / 2)) / (paddleH / 2);
      ballVY = relative * 6;
      if (abs(ballVY) < 0.5) {
        ballVY = ballVY >= 0 ? 0.5 : -0.5;
      }
    }
  }
  if (ballX + ballR < 0) {
    rightScore += 1;
    resetBall();
  }
  if (ballX - ballR > canvasW) {
    leftScore += 1;
    resetBall();
  }
  fill(255);
  text(leftScore, canvasW / 4, 10);
  text(rightScore, (canvasW * 3) / 4, 10);
}
