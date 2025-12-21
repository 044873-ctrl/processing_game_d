let player;
let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;
let enemySpeed = 1.5;
let enemySpeedIncrementPerFrame = 0.0005;
let spawnInterval = 60;
function setup(){
  createCanvas(400,600);
  player = {x: width/2, y: height-40, r: 14, speed: 5};
  for(let i=0;i<30;i++){
    let s = {x: random(0,width), y: random(0,height), r: random(1,3), speed: random(0.5,2.0)};
    stars.push(s);
  }
  textSize(16);
  textAlign(LEFT, TOP);
  noStroke();
}
function draw(){
  background(0);
  fill(255);
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    ellipse(s.x, s.y, s.r*2, s.r*2);
    s.y += s.speed;
    if(s.y > height){
      s.y = random(-20,0);
      s.x = random(0,width);
      s.r = random(1,3);
      s.speed = random(0.5,2.0);
    }
  }
  if(!gameOver){
    enemySpeed += enemySpeedIncrementPerFrame;
    if(frameCount % spawnInterval === 0){
      let er = 12;
      let ex = random(er, width - er);
      let ey = -er;
      let es = enemySpeed + random(0,0.5);
      enemies.push({x: ex, y: ey, r: er, speed: es});
    }
    if(keyIsDown(LEFT_ARROW)){
      player.x -= player.speed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += player.speed;
    }
    player.x = constrain(player.x, player.r, width - player.r);
  }
  for(let i=bullets.length-1;i>=0;i--){
    let b = bullets[i];
    b.y -= b.speed;
    if(b.y < -b.r){
      bullets.splice(i,1);
      continue;
    }
    fill(255,200,0);
    ellipse(b.x, b.y, b.r*2, b.r*2);
  }
  for(let i=enemies.length-1;i>=0;i--){
    let e = enemies[i];
    if(!gameOver){
      e.y += e.speed;
    }
    if(e.y > height + e.r){
      enemies.splice(i,1);
      continue;
    }
    fill(200,50,50);
    ellipse(e.x, e.y, e.r*2, e.r*2);
  }
  for(let i=bullets.length-1;i>=0;i--){
    for(let j=enemies.length-1;j>=0;j--){
      let b = bullets[i];
      let e = enemies[j];
      if(b === undefined || e === undefined){
        continue;
      }
      let dx = b.x - e.x;
      let dy = b.y - e.y;
      let d = sqrt(dx*dx + dy*dy);
      if(d <= b.r + e.r){
        for(let k=0;k<5;k++){
          let angle = random(0, TWO_PI);
          let speed = random(1,3);
          let vx = cos(angle) * speed;
          let vy = sin(angle) * speed;
          particles.push({x: e.x, y: e.y, vx: vx, vy: vy, r: 3, life: 20});
        }
        score += 1;
        bullets.splice(i,1);
        enemies.splice(j,1);
        break;
      }
    }
  }
  for(let i=enemies.length-1;i>=0;i--){
    let e = enemies[i];
    let dx = player.x - e.x;
    let dy = player.y - e.y;
    let d = sqrt(dx*dx + dy*dy);
    if(d <= player.r + e.r){
      gameOver = true;
    }
  }
  for(let i=particles.length-1;i>=0;i--){
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    let alpha = map(p.life, 0, 20, 0, 255);
    fill(255, alpha);
    ellipse(p.x, p.y, p.r*2, p.r*2);
    if(p.life <= 0){
      particles.splice(i,1);
    }
  }
  fill(0,150,255);
  ellipse(player.x, player.y, player.r*2, player.r*2);
  fill(255);
  textAlign(LEFT, TOP);
  text("SCORE: " + score, 10, 10);
  if(gameOver){
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255,0,0);
    text("GAME OVER", width/2, height/2 - 20);
    textSize(16);
    fill(255);
    text("Press R to restart", width/2, height/2 + 20);
    textSize(16);
    textAlign(LEFT, TOP);
  }
}
function keyPressed(){
  if(!gameOver && keyCode === 32){
    let bx = player.x;
    let by = player.y - player.r - 2;
    bullets.push({x: bx, y: by, r: 4, speed: 15});
  }
  if(gameOver && (key === 'r' || key === 'R')){
    bullets = [];
    enemies = [];
    particles = [];
    score = 0;
    gameOver = false;
    enemySpeed = 1.5;
    player.x = width/2;
    player.y = height-40;
  }
}
