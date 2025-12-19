let player;
let invaders = [];
let playerBeams = [];
let invaderBeams = [];
let score = 0;

function setup() {
  createCanvas(600, 600);
  player = new Player();
  for (let i = 0; i < 10; i++) {
    invaders[i] = new Invader(i*60+60, 60);
  }
}

function draw() {
  background(0);
  player.show();
  player.move();

  for (let i = 0; i < playerBeams.length; i++) {
    playerBeams[i].show();
    playerBeams[i].move();
    for (let j = 0; j < invaders.length; j++) {
      if (playerBeams[i].hits(invaders[j])) {
        invaders[j].explode();
        playerBeams[i].evaporate();
        score++;
      }
    }
  }

  let edge = false;

  for (let i = 0; i < invaders.length; i++) {
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

  for (let i = invaders.length-1; i >= 0; i--) {
    if (invaders[i].toDelete) {
      invaders.splice(i, 1);
    }
  }

  for (let i = playerBeams.length-1; i >= 0; i--) {
    if (playerBeams[i].toDelete) {
      playerBeams.splice(i, 1);
    }
  }

  if (random(1) < 0.01) {
    invaderBeams.push(new Beam(invaders[0].x, invaders[0].y));
  }

  for (let i = 0; i < invaderBeams.length; i++) {
    invaderBeams[i].show();
    invaderBeams[i].move();
    if (player.hits(invaderBeams[i])) {
      player.explode();
      invaderBeams[i].evaporate();
    }
  }

  for (let i = invaderBeams.length-1; i >= 0; i--) {
    if (invaderBeams[i].toDelete) {
      invaderBeams.splice(i, 1);
    }
  }

  text("Score: "+score,10,50);
}

function keyReleased() {
  if (key != ' ') {
    player.setDir(0);
  }
}

function keyPressed() {
  if (key === ' ') {
    playerBeams.push(new Beam(player.x, height));
  }

  if (keyCode === RIGHT_ARROW) {
    player.setDir(1);
  } else if (keyCode === LEFT_ARROW) {
    player.setDir(-1);
  }
}
