var pw = 10;
var ph = 80;
var player = {x:10, y:0, w:pw, h:ph, speed:6};
var cpu = {x:0, y:0, w:pw, h:ph, maxSpeed:5, missTimer:0, targetY:0};
var ball = {x:0, y:0, r:8, vx:4, vy:3};
var playerScore = 0;
var cpuScore = 0;
var lastServeDir = 1;

function resetBall() {
  ball.x = width / 2;
  ball.y = height / 2;
  ball.vx = 4 * lastServeDir;
  ball.vy = 3 * (random() < 0.5 ? 1 : -1);
  cpu.missTimer = 0;
  cpu.targetY = constrain(ball.y - cpu.h / 2, 0, height - cpu.h);
}

function setup() {
  createCanvas(600, 400);
  player.y = (height - player.h) / 2;
  cpu.x = width - 10 - cpu.w;
  cpu.y = (height - cpu.h) / 2;
  lastServeDir = 1;
  resetBall();
  textSize(32);
  textAlign(CENTER, TOP);
}

function draw() {
  background(0);
  fill(255);
  if (keyIsDown(UP_ARROW)) {
    player.y -= player.speed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    player.y += player.speed;
  }
  player.y = constrain(player.y, 0, height - player.h);
  if (cpu.missTimer > 0) {
    cpu.missTimer -= 1;
    var dyMiss = cpu.targetY - cpu.y;
    var moveMiss = constrain(dyMiss, -cpu.maxSpeed, cpu.maxSpeed);
    cpu.y += moveMiss;
  } else {
    if (ball.vx > 0 && random() < 0.005) {
      cpu.missTimer = 30;
      cpu.targetY = random(0, height - cpu.h);
    } else {
      var target = ball.y - cpu.h / 2;
      var dy = target - cpu.y;
      var move = constrain(dy, -cpu.maxSpeed, cpu.maxSpeed);
      cpu.y += move;
    }
  }
  cpu.y = constrain(cpu.y, 0, height - cpu.h);
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.y - ball.r <= 0) {
    ball.y = ball.r;
    ball.vy = -ball.vy;
  }
  if (ball.y + ball.r >= height) {
    ball.y = height - ball.r;
    ball.vy = -ball.vy;
  }
  if (ball.x - ball.r <= player.x + player.w && ball.x + ball.r >= player.x && ball.y >= player.y && ball.y <= player.y + player.h && ball.vx < 0) {
    var paddleCenter = player.y + player.h / 2;
    var diff = (ball.y - paddleCenter) / (player.h / 2);
    diff = constrain(diff, -1, 1);
    ball.vx = -ball.vx;
    ball.vy = diff * 5;
    ball.x = player.x + player.w + ball.r + 0.1;
  }
  if (ball.x + ball.r >= cpu.x && ball.x - ball.r <= cpu.x + cpu.w && ball.y >= cpu.y && ball.y <= cpu.y + cpu.h && ball.vx > 0) {
    var paddleCenterR = cpu.y + cpu.h / 2;
    var diffR = (ball.y - paddleCenterR) / (cpu.h / 2);
    diffR = constrain(diffR, -1, 1);
    ball.vx = -ball.vx;
    ball.vy = diffR * 5;
    ball.x = cpu.x - ball.r - 0.1;
  }
  if (ball.x - ball.r <= 0) {
    cpuScore += 1;
    lastServeDir = -lastServeDir;
    resetBall();
  } else if (ball.x + ball.r >= width) {
    playerScore += 1;
    lastServeDir = -lastServeDir;
    resetBall();
  }
  rect(player.x, player.y, player.w, player.h);
  rect(cpu.x, cpu.y, cpu.w, cpu.h);
  ellipse(ball.x, ball.y, ball.r * 2, ball.r * 2);
  fill(255);
  text(playerScore, width * 0.25, 10);
  text(cpuScore, width * 0.75, 10);
}
