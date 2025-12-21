let player;
let playerR = 14;
let playerSpeed = 8;
let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;
function createParticles(px, py) {
  for (let k = 0; k < 5; k++) {
    let vx = random(-2, 2);
    let vy = random(-2, 2);
    particles.push({ x: px, y: py, vx: vx, vy: vy, r: 3, life: 20 });
  }
}
function setup() {
  createCanvas(400, 600);
  player = { x: width / 2, y: height - 30, r: playerR };
  for (let i = 0; i < 30; i++) {
    stars.push({ x: random(width), y: random(height), s: random(1, 3), speed: random(0.5, 2) });
  }
  textAlign(LEFT, TOP);
  textSize(18);
}
function draw() {
  background(0);
  noStroke();
  fill(255);
  for (let i = 0; i < stars.length; i++) {
    let st = stars[i];
    ellipse(st.x, st.y, st.s);
    st.y += st.speed;
    if (st.y > height) {
      st.y = random(-20, 0);
      st.x = random(width);
    }
  }
  if (!gameOver) {
    if (keyIsDown(LEFT_ARROW)) {
      player.x -= playerSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      player.x += playerSpeed;
    }
    if (player.x < player.r) {
      player.x = player.r;
    }
    if (player.x > width - player.r) {
      player.x = width - player.r;
    }
  }
  fill(0, 150, 255);
  ellipse(player.x, player.y, player.r * 2);
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.y -= b.speed;
    fill(255, 255, 0);
    ellipse(b.x, b.y, b.r * 2);
    if (b.y < -b.r) {
      bullets.splice(i, 1);
    }
  }
  if (!gameOver && frameCount % 60 === 0) {
    let ex = random(12, width - 12);
    enemies.push({ x: ex, y: -12, r: 12, speed: 2 });
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    e.y += e.speed;
    fill(255, 0, 0);
    ellipse(e.x, e.y, e.r * 2);
    if (e.y > height + e.r) {
      enemies.splice(i, 1);
      continue;
    }
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    let dxp = e.x - player.x;
    let dyp = e.y - player.y;
    let dist2p = dxp * dxp + dyp * dyp;
    let rsumP = e.r + player.r;
    if (dist2p <= rsumP * rsumP) {
      gameOver = true;
      break;
    }
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (i < 0 || j < 0) {
        continue;
      }
      let e = enemies[i];
      let b = bullets[j];
      let dx = e.x - b.x;
      let dy = e.y - b.y;
      let dist2 = dx * dx + dy * dy;
      let rsum = e.r + b.r;
      if (dist2 <= rsum * rsum) {
        createParticles(e.x, e.y);
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 1;
        break;
      }
    }
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    let alpha = map(p.life, 0, 20, 0, 255);
    fill(255, 200, 0, alpha);
    ellipse(p.x, p.y, p.r * 2);
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
  fill(255);
  text("Score: " + score, 10, 10);
  if (gameOver) {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255, 50, 50);
    text("GAME OVER", width / 2, height / 2);
    pop();
  }
}
function keyPressed() {
  if (keyCode === 32 && !gameOver) {
    let bx = player.x;
    let by = player.y - player.r - 6;
    bullets.push({ x: bx, y: by, r: 6, speed: 8 });
  }
}
