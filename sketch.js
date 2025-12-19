let player;
let bullets = [];
let invaders = [];
let invaderBullets = [];
let score = 0;

function setup() {
  createCanvas(800, 600);
  player = new Player();
  for (let i = 0; i < 10; i++) {
    invaders.push(new Invader(i * 80 + 80, 60));
  }
}

function draw() {
  background(0);
  player.show();
  player.move();
  
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].show();
    bullets[i].move();
    for (let j = invaders.length - 1; j >= 0; j--) {
      if (bullets[i].hits(invaders[j])) {
        invaders[j].destroy();
        bullets[i].evaporate();
        score++;
      }
    }
  }
  
  let edge = false;
  
  for (let i = invaders.length - 1; i >= 0; i--) {
    invaders[i].show();
    invaders[i].move();
    if (invaders[i].x > width || invaders[i].x < 0) {
      edge = true;
    }
  }
  
  if (edge) {
    for (let i = 0; i < invaders.length; i++) {
      invaders[i].shiftDown();
    }
  }
  
  for (let i = invaders.length - 1; i >= 0; i--) {
    if (invaders[i].toDelete) {
      invaders.splice(i, 1);
    }
  }
  
  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].toDelete) {
      bullets.splice(i, 1);
    }
  }
  
  for (let i = invaderBullets.length - 1; i >= 0; i--) {
    invaderBullets[i].show();
    invaderBullets[i].move();
    if (invaderBullets[i].hits(player)) {
      player = new Player();
      invaderBullets[i].evaporate();
    }
  }
  
  for (let i = invaderBullets.length - 1; i >= 0; i--) {
    if (invaderBullets[i].toDelete) {
      invaderBullets.splice(i, 1);
    }
  }
  
  text('Score: ' + score, 10, 50);
}

function keyReleased() {
  if (key != ' ') {
    player.setDir(0);
  }
}

function keyPressed() {
  if (key === ' ') {
    let bullet = new Bullet(player.x, height);
    bullets.push(bullet);
    if (random(1) < 0.05) {
      let invader = random(invaders);
      invaderBullets.push(new Bullet(invader.x, invader.y));
    }
  }
  if (keyCode === RIGHT_ARROW) {
    player.setDir(1);
  } else if (keyCode === LEFT_ARROW) {
    player.setDir(-1);
  }
}
