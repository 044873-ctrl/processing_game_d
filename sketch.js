let player;
let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let score = 0;
let shootCooldown = 0;
let shootDelay = 10;
let gameOver = false;
function setup() {
  createCanvas(400, 600);
  player = { x: width / 2, y: height - 40, r: 16, speed: 5 };
  for (let i = 0; i < 30; i++) {
    let s = { x: random(0, width), y: random(0, height), size: random(1, 3), speed: random(0.5, 2) };
    stars.push(s);
  }
  textSize(16);
  textAlign(LEFT, TOP);
}
function draw() {
  background(0);
  noStroke();
  fill(255);
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    ellipse(s.x, s.y, s.size, s.size);
    if (!gameOver) {
      s.y += s.speed;
    }
    if (s.y > height + s.size) {
      s.y = -s.size;
      s.x = random(0, width);
      s.size = random(1, 3);
      s.speed = random(0.5, 2);
    }
  }
  if (!gameOver) {
    if (keyIsDown(LEFT_ARROW)) {
      player.x -= player.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      player.x += player.speed;
    }
    player.x = constrain(player.x, player.r, width - player.r);
    if (shootCooldown > 0) {
      shootCooldown--;
    }
    if (keyIsDown(32) && shootCooldown <= 0) {
      let b = { x: player.x, y: player.y - player.r, r: 4, vy: -8 };
      bullets.push(b);
      shootCooldown = shootDelay;
    }
    if (frameCount % 60 === 0) {
      let e = { x: random(12, width - 12), y: -12, r: 12, vy: 2 };
      enemies.push(e);
    }
  }
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    if (!gameOver) {
      b.y += b.vy;
    }
    fill(200, 220, 255);
    ellipse(b.x, b.y, b.r * 2, b.r * 2);
    if (b.y < -b.r) {
      bullets.splice(i, 1);
    }
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    if (!gameOver) {
      e.y += e.vy;
    }
    fill(220, 80, 80);
    ellipse(e.x, e.y, e.r * 2, e.r * 2);
    if (e.y > height + e.r) {
      enemies.splice(i, 1);
      continue;
    }
    if (!gameOver) {
      for (let j = bullets.length - 1; j >= 0; j--) {
        let b = bullets[j];
        let d = dist(e.x, e.y, b.x, b.y);
        if (d <= e.r + b.r) {
          for (let k = 0; k < 5; k++) {
            let p = { x: e.x, y: e.y, r: 3, vx: random(-2, 2), vy: random(-2, 2), life: 20 };
            particles.push(p);
          }
          score += 1;
          bullets.splice(j, 1);
          enemies.splice(i, 1);
          break;
        }
      }
    }
    let dp = dist(player.x, player.y, e.x, e.y);
    if (dp <= player.r + e.r) {
      gameOver = true;
    }
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life = p.life - 1;
    let alpha = constrain((p.life / 20) * 255, 0, 255);
    fill(255, 200, 100, alpha);
    ellipse(p.x, p.y, p.r * 2, p.r * 2);
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
  fill(100, 180, 255);
  triangle(player.x, player.y - player.r, player.x - player.r, player.y + player.r, player.x + player.r, player.y + player.r);
  fill(255);
  text(score, 10, 10);
}
