let player;
let bullets = [];
let enemies = [];

function setup() {
  createCanvas(800, 600);
  player = new Player();
  
  for(let i = 0; i < 10; i++){
    let x = random(width);
    let y = random(height);
    enemies[i] = new Enemy(x, y);
  }
}

function draw() {
  background(0);
  
  player.show();
  player.move();

  for(let i = bullets.length-1; i >= 0; i--) {
    bullets[i].show();
    bullets[i].move();
    
    for(let j = enemies.length-1; j >= 0; j--) {
      if(bullets[i].hits(enemies[j])) {
        enemies.splice(j, 1);
        bullets.splice(i, 1);
        break;
      }
    }
  }
  
  for(let enemy of enemies) {
    enemy.show();
    enemy.move();
  }
}

function keyReleased() {
  if(key == ' ') {
    let bullet = new Bullet(player.x, height);
    bullets.push(bullet);
  }
}

function Player() {
  this.x = width / 2;

  this.show = function() {
    fill(255);
    rect(this.x, height - 20, 20, 20);
  }

  this.move = function() {
    if(keyIsDown(LEFT_ARROW)) {
      this.x -= 5;
    } else if(keyIsDown(RIGHT_ARROW)) {
      this.x += 5;
    }
  }
}

function Bullet(x, y) {
  this.x = x;
  this.y = y;

  this.show = function() {
    fill(255);
    ellipse(this.x, this.y, 8, 8);
  }

  this.move = function() {
    this.y -= 5;
  }

  this.hits = function(enemy) {
    let d = dist(this.x, this.y, enemy.x, enemy.y);
    return (d < enemy.r);
  }
}

function Enemy(x, y) {
  this.x = x;
  this.y = y;
  this.r = 30;
  this.speed = 2;

  this.show = function() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.r*2, this.r*2);
  }

  this.move = function() {
    this.y += this.speed;
  }
}
