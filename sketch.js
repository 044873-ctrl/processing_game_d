let CANVAS_W = 600;
let CANVAS_H = 400;
let PADDLE_W = 10;
let PADDLE_H = 80;
let PLAYER_SPEED = 20;
let CPU_MAX_SPEED = 15;
let BALL_R = 8;
let INIT_BALL_VX = 6;
let INIT_BALL_VY = 4;
let MISS_DURATION = 30;
let CPU_MISS_PROB = 0.004;
let player = {
  x: 20,
  y: (CANVAS_H - PADDLE_H) / 2,
  w: PADDLE_W,
  h: PADDLE_H
};
let cpu = {
  x: CANVAS_W - 20 - PADDLE_W,
  y: (CANVAS_H - PADDLE_H) / 2,
  w: PADDLE_W,
  h: PADDLE_H,
  missFrames: 0,
  targetY: (CANVAS_H) / 2
};
let ball = {
  x: CANVAS_W / 2,
  y: CANVAS_H / 2,
  vx: INIT_BALL_VX,
  vy: INIT_BALL_VY,
  r: BALL_R
};
let score = {
  player: 0,
  cpu: 0
};
function resetBall(cpuScored) {
  ball.x = CANVAS_W / 2;
  ball.y = CANVAS_H / 2;
  let dir = cpuScored ? 1 : -1;
  ball.vx = INIT_BALL_VX * dir;
  ball.vy = INIT_BALL_VY * (random() < 0.5 ? 1 : -1);
}
function handlePaddleCollision(p, isLeft) {
  let left = p.x;
  let right = p.x + p.w;
  let top = p.y;
  let bottom = p.y + p.h;
  let collided = false;
  if (ball.x - ball.r <= right && ball.x + ball.r >= left && ball.y >= top && ball.y <= bottom) {
    collided = true;
    if (isLeft) {
      ball.x = right + ball.r;
      ball.vx = abs(ball.vx);
    } else {
      ball.x = left - ball.r;
      ball.vx = -abs(ball.vx);
    }
    let centerY = top + p.h / 2;
    let relative = (ball.y - centerY) / (p.h / 2);
    if (relative > 1) {
      relative = 1;
    }
    if (relative < -1) {
      relative = -1;
    }
    ball.vy = relative * 8;
  }
  return collided;
}
function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  rectMode(CORNER);
  textAlign(CENTER, TOP);
  textSize(32);
}
function draw() {
  background(0);
  fill(255);
  let playerCenterY = player.y + player.h / 2;
  if (keyIsDown(UP_ARROW)) {
    player.y -= PLAYER_SPEED;
  }
  if (keyIsDown(DOWN_ARROW)) {
    player.y += PLAYER_SPEED;
  }
  if (player.y < 0) {
    player.y = 0;
  }
  if (player.y > CANVAS_H - player.h) {
    player.y = CANVAS_H - player.h;
  }
  if (cpu.missFrames > 0) {
    cpu.missFrames -= 1;
    let cpuCenterY = cpu.y + cpu.h / 2;
    let dy = cpu.targetY - cpuCenterY;
    if (dy > CPU_MAX_SPEED) {
      dy = CPU_MAX_SPEED;
    }
    if (dy < -CPU_MAX_SPEED) {
      dy = -CPU_MAX_SPEED;
    }
    cpu.y += dy;
  } else {
    if (ball.vx > 0 && ball.x > CANVAS_W / 2 && random() < CPU_MISS_PROB) {
      cpu.missFrames = MISS_DURATION;
      cpu.targetY = random(cpu.h / 2, CANVAS_H - cpu.h / 2);
    }
    let cpuCenterY = cpu.y + cpu.h / 2;
    let target = ball.y;
    let dy = target - cpuCenterY;
    if (dy > CPU_MAX_SPEED) {
      dy = CPU_MAX_SPEED;
    }
    if (dy < -CPU_MAX_SPEED) {
      dy = -CPU_MAX_SPEED;
    }
    cpu.y += dy;
  }
  if (cpu.y < 0) {
    cpu.y = 0;
  }
  if (cpu.y > CANVAS_H - cpu.h) {
    cpu.y = CANVAS_H - cpu.h;
  }
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.y - ball.r <= 0) {
    ball.y = ball.r;
    ball.vy = abs(ball.vy);
  }
  if (ball.y + ball.r >= CANVAS_H) {
    ball.y = CANVAS_H - ball.r;
    ball.vy = -abs(ball.vy);
  }
  if (ball.x - ball.r < 0) {
    score.cpu += 1;
    resetBall(true);
  }
  if (ball.x + ball.r > CANVAS_W) {
    score.player += 1;
    resetBall(false);
  }
  if (ball.vx < 0) {
    handlePaddleCollision(player, true);
  } else {
    handlePaddleCollision(cpu, false);
  }
  rect(player.x, player.y, player.w, player.h);
  rect(cpu.x, cpu.y, cpu.w, cpu.h);
  ellipse(ball.x, ball.y, ball.r * 2, ball.r * 2);
  fill(255);
  text(score.player, CANVAS_W * 0.25, 10);
  text(score.cpu, CANVAS_W * 0.75, 10);
}
