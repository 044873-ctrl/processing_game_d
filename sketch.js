let canvasW = 600;
let canvasH = 400;
let paddleW = 10;
let paddleH = 80;
let playerX = 20;
let playerY = 200;
let cpuX = 580;
let cpuY = 200;
let playerSpeed = 20;
let cpuMaxSpeed = 5;
let cpuMissFrames = 0;
let cpuMissTargetY = 200;
let ballX = 300;
let ballY = 200;
let ballR = 8;
let ballVX = 4;
let ballVY = 3;
let playerScore = 0;
let cpuScore = 0;
function setup(){
  createCanvas(canvasW, canvasH);
  playerY = canvasH/2;
  cpuY = canvasH/2;
  cpuMissTargetY = canvasH/2;
  resetBall(1);
  textSize(32);
  textAlign(CENTER, TOP);
}
function draw(){
  background(0);
  updatePlayer();
  updateCPU();
  updateBall();
  drawPaddles();
  drawBall();
  drawScore();
}
function updatePlayer(){
  if (keyIsDown(UP_ARROW)){
    playerY -= playerSpeed;
  }
  if (keyIsDown(DOWN_ARROW)){
    playerY += playerSpeed;
  }
  let halfH = paddleH/2;
  if (playerY < halfH){
    playerY = halfH;
  }
  if (playerY > canvasH - halfH){
    playerY = canvasH - halfH;
  }
}
function updateCPU(){
  if (cpuMissFrames > 0){
    cpuMissFrames -= 1;
    moveCpuToward(cpuMissTargetY);
  } else {
    if (ballVX > 0 && Math.random() < 0.01){
      cpuMissFrames = 30;
      cpuMissTargetY = Math.floor(Math.random()*(canvasH - paddleH)) + paddleH/2;
      moveCpuToward(cpuMissTargetY);
    } else {
      moveCpuToward(ballY);
    }
  }
  let halfH = paddleH/2;
  if (cpuY < halfH){
    cpuY = halfH;
  }
  if (cpuY > canvasH - halfH){
    cpuY = canvasH - halfH;
  }
}
function moveCpuToward(targetY){
  let dy = targetY - cpuY;
  if (Math.abs(dy) <= cpuMaxSpeed){
    cpuY = targetY;
  } else {
    cpuY += cpuMaxSpeed * (dy > 0 ? 1 : -1);
  }
}
function updateBall(){
  ballX += ballVX;
  ballY += ballVY;
  if (ballY - ballR <= 0){
    ballY = ballR;
    ballVY = Math.abs(ballVY);
  }
  if (ballY + ballR >= canvasH){
    ballY = canvasH - ballR;
    ballVY = -Math.abs(ballVY);
  }
  handlePaddleCollision();
  if (ballX - ballR <= 0){
    cpuScore += 1;
    resetBall(1);
  }
  if (ballX + ballR >= canvasW){
    playerScore += 1;
    resetBall(-1);
  }
}
function handlePaddleCollision(){
  let halfW = paddleW/2;
  let halfH = paddleH/2;
  if (Math.abs(ballX - playerX) <= halfW + ballR && Math.abs(ballY - playerY) <= halfH){
    ballX = playerX + halfW + ballR;
    ballVX = Math.abs(ballVX);
    let relY = (ballY - playerY) / halfH;
    ballVY = relY * 5;
  }
  if (Math.abs(ballX - cpuX) <= halfW + ballR && Math.abs(ballY - cpuY) <= halfH){
    ballX = cpuX - halfW - ballR;
    ballVX = -Math.abs(ballVX);
    let relY2 = (ballY - cpuY) / halfH;
    ballVY = relY2 * 5;
  }
}
function resetBall(dir){
  ballX = canvasW/2;
  ballY = canvasH/2;
  let sign = dir >= 0 ? 1 : -1;
  ballVX = 4 * sign;
  ballVY = (Math.random() * 6 - 3);
  if (ballVY === 0){
    ballVY = 1;
  }
}
function drawPaddles(){
  fill(255);
  rectMode(CENTER);
  rect(playerX, playerY, paddleW, paddleH);
  rect(cpuX, cpuY, paddleW, paddleH);
}
function drawBall(){
  fill(255);
  ellipse(ballX, ballY, ballR*2, ballR*2);
}
function drawScore(){
  fill(255);
  text(playerScore, canvasW*0.25, 10);
  text(cpuScore, canvasW*0.75, 10);
}
