let player;
let playerBullets;
let invaders;
let invaderBullets;
let score;

function setup() {
  createCanvas(800, 600);
  player = new Player();
  playerBullets = [];
  invaders = [];
  invaderBullets = [];
  score = 0;

  for (let i = 0; i < 10; i++) {
    invaders[i] = new Invader(i * 80 + 80, 60);
  }
}

function draw() {
  background(0);
  player.show();
  player.move();

  for (let i = playerBullets.length - 1; i >= 0; i--) {
    playerBullets[i].show();
    playerBullets[i].move();
    for (let j = invaders.length - 1; j >= 0; j--) {
      if (playerBullets[i].hits(invaders[j])) {
        invaders[j].destroy();
        playerBullets[i].evaporate();
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

  for (let i = playerBullets.length - 1; i >= 0; i--) {
    if (playerBullets[i].toDelete) {
      playerBullets.splice(i, 1);
    }
  }

  for (let i = invaders.length - 1; i >= 0; i--) {
    if (invaders[i].toDelete) {
      invaders.splice(i, 1);
    }
  }

  if (random(1) < 0.01) {
    invaderBullets.push(new Bullet(invaders[0].x, invaders[0].y));
  }

  for (let i = invaderBullets.length - 1; i >= 0; i--) {
    invaderBullets[i].show();
    invaderBullets[i].move();
    if (invaderBullets[i].hits(player)) {
      player.reset();
      invaderBullets[i].evaporate();
    }
    if (invaderBullets[i].toDelete) {
      invaderBullets.splice(i, 1);
    }
  }

  textSize(32);
  fill(255);
  text("Score: " + score, 10, 30);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    player.setDir(-1);
  } else if (keyCode === RIGHT_ARROW) {
    player.setDir(1);
  } else if (keyCode === 32) { // Spacebar
    playerBullets.push(new Bullet(player.x, height));
  }
}

function keyReleased() {
  if (keyCode !== 32) {
    player.setDir(0);
  }
}
