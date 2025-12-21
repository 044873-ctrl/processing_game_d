const WIDTH = 400;
const HEIGHT = 600;
const ENEMY_SPEED = 100 / 60;
let player;
let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;
class Player {
  constructor() {
    this.x = WIDTH / 2;
    this.y = HEIGHT - 40;
    this.speed = 5;
    this.radius = 14;
    this.cooldown = 0;
  }
  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }
    this.x = constrain(this.x, this.radius, WIDTH - this.radius);
    if (this.cooldown > 0) {
      this.cooldown -= 1;
    }
  }
  canFire() {
    if (this.cooldown === 0 && keyIsDown(32)) {
      this.cooldown = 10;
      return true;
    }
    return false;
  }
  draw() {
    fill(0, 200, 255);
    noStroke();
    triangle(this.x, this.y - this.radius, this.x - this.radius, this.y + this.radius, this.x + this.radius, this.y + this.radius);
  }
}
class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 4;
    this.speed = 8;
  }
  update() {
    this.y -= this.speed;
  }
  offscreen() {
    return this.y + this.r < 0;
  }
  draw() {
    fill(255, 255, 0);
    noStroke();
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}
class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 12;
    this.speed = ENEMY_SPEED;
  }
  update() {
    this.y += this.speed;
  }
  offscreen() {
    return this.y - this.r > HEIGHT;
  }
  draw() {
    fill(255, 100, 100);
    noStroke();
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 3;
    this.life = 20;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 1;
  }
  dead() {
    return this.life <= 0;
  }
  draw() {
    fill(255, 200, 0, map(this.life, 0, 20, 0, 255));
    noStroke();
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}
class Star {
  constructor() {
    this.x = random(0, WIDTH);
    this.y = random(0, HEIGHT);
    this.size = random(1, 3);
    this.speed = random(0.5, 2);
  }
  update() {
    this.y += this.speed;
    if (this.y > HEIGHT) {
      this.y = random(-HEIGHT, 0);
      this.x = random(0, WIDTH);
    }
  }
  draw() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }
}
function setup() {
  createCanvas(WIDTH, HEIGHT);
  player = new Player();
  for (let i = 0; i < 30; i += 1) {
    stars.push(new Star());
  }
  score = 0;
  gameOver = false;
  bullets = [];
  enemies = [];
  particles = [];
}
function draw() {
  background(0);
  for (let i = 0; i < stars.length; i += 1) {
    stars[i].update();
    stars[i].draw();
  }
  if (!gameOver) {
    player.update();
    if (player.canFire()) {
      bullets.push(new Bullet(player.x, player.y - player.radius));
    }
    if (frameCount % 60 === 0) {
      let ex = random(12, WIDTH - 12);
      enemies.push(new Enemy(ex, -12));
    }
    for (let i = bullets.length - 1; i >= 0; i -= 1) {
      bullets[i].update();
      if (bullets[i].offscreen()) {
        bullets.splice(i, 1);
      }
    }
    for (let i = enemies.length - 1; i >= 0; i -= 1) {
      enemies[i].update();
      if (enemies[i].offscreen()) {
        enemies.splice(i, 1);
        continue;
      }
    }
    for (let i = enemies.length - 1; i >= 0; i -= 1) {
      let e = enemies[i];
      for (let j = bullets.length - 1; j >= 0; j -= 1) {
        let b = bullets[j];
        if (dist(e.x, e.y, b.x, b.y) <= e.r + b.r) {
          for (let k = 0; k < 5; k += 1) {
            particles.push(new Particle(e.x, e.y));
          }
          bullets.splice(j, 1);
          enemies.splice(i, 1);
          score += 1;
          break;
        }
      }
    }
    for (let i = 0; i < enemies.length; i += 1) {
      if (dist(enemies[i].x, enemies[i].y, player.x, player.y) <= enemies[i].r + player.radius) {
        gameOver = true;
        break;
      }
    }
  }
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    particles[i].update();
    if (particles[i].dead()) {
      particles.splice(i, 1);
    }
  }
  for (let i = 0; i < bullets.length; i += 1) {
    bullets[i].draw();
  }
  for (let i = 0; i < enemies.length; i += 1) {
    enemies[i].draw();
  }
  for (let i = 0; i < particles.length; i += 1) {
    particles[i].draw();
  }
  player.draw();
  fill(255);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text('SCORE: ' + score, 8, 8);
  if (gameOver) {
    fill(255, 0, 0);
    textSize(36);
    textAlign(CENTER, CENTER);
    text('GAME OVER', WIDTH / 2, HEIGHT / 2);
  }
}
