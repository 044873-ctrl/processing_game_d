let player;
let bullets;
let enemies;
let particles;
let stars;
let score;
let gameOver;
let shootCooldown;
function setup(){
  createCanvas(400,600);
  player = {x: width/2, y: height-40, r: 16, speed: 5};
  bullets = [];
  enemies = [];
  particles = [];
  stars = [];
  score = 0;
  gameOver = false;
  shootCooldown = 0;
  for(let i=0;i<30;i++){
    let s = {x: random(0, width), y: random(0, height), size: random(1,3), speed: random(0.5,3)};
    stars.push(s);
  }
  textAlign(LEFT, TOP);
  textSize(16);
}
function draw(){
  background(0);
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    noStroke();
    fill(255);
    ellipse(s.x, s.y, s.size, s.size);
    s.y += s.speed;
    if(s.y > height){
      s.y = 0;
      s.x = random(0, width);
      s.size = random(1,3);
      s.speed = random(0.5,3);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      player.x -= player.speed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += player.speed;
    }
    if(keyIsDown(32) && shootCooldown <= 0){
      let b = {x: player.x, y: player.y - player.r - 4, r: 4, vy: -8};
      bullets.push(b);
      shootCooldown = 8;
    }
    if(shootCooldown > 0){
      shootCooldown--;
    }
    if(frameCount % 60 === 0){
      let e = {x: random(12, width-12), y: -12, r: 12, vy: 2};
      enemies.push(e);
    }
  }
  if(player.x < player.r){
    player.x = player.r;
  }
  if(player.x > width - player.r){
    player.x = width - player.r;
  }
  for(let i=bullets.length-1;i>=0;i--){
    let b = bullets[i];
    b.y += b.vy;
    noStroke();
    fill(200,220,255);
    ellipse(b.x, b.y, b.r*2, b.r*2);
    if(b.y < -10){
      bullets.splice(i,1);
    }
  }
  for(let i=enemies.length-1;i>=0;i--){
    let e = enemies[i];
    e.y += e.vy;
    noStroke();
    fill(255,100,100);
    ellipse(e.x, e.y, e.r*2, e.r*2);
    if(e.y > height + 20){
      enemies.splice(i,1);
      continue;
    }
    let dxp = e.x - player.x;
    let dyp = e.y - player.y;
    let distp = Math.sqrt(dxp*dxp + dyp*dyp);
    if(distp <= e.r + player.r){
      gameOver = true;
    }
    for(let j=bullets.length-1;j>=0;j--){
      let b = bullets[j];
      let dx = e.x - b.x;
      let dy = e.y - b.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if(dist <= e.r + b.r){
        bullets.splice(j,1);
        enemies.splice(i,1);
        score += 1;
        for(let k=0;k<5;k++){
          let p = {x: e.x, y: e.y, r: 3, life: 20, vx: random(-2,2), vy: random(-2,2)};
          particles.push(p);
        }
        break;
      }
    }
  }
  for(let i=particles.length-1;i>=0;i--){
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    let alpha = map(p.life, 0, 20, 0, 255);
    noStroke();
    fill(255,200,0, alpha);
    ellipse(p.x, p.y, p.r*2, p.r*2);
    if(p.life <= 0){
      particles.splice(i,1);
    }
  }
  noStroke();
  fill(100,200,255);
  ellipse(player.x, player.y, player.r*2, player.r*2);
  fill(255);
  textSize(16);
  text("Score: " + score, 10, 10);
  if(gameOver){
    textAlign(CENTER, CENTER);
    textSize(36);
    fill(255, 50, 50);
    text("GAME OVER", width/2, height/2 - 20);
    textSize(18);
    fill(255);
    text("Final Score: " + score, width/2, height/2 + 20);
    textAlign(LEFT, TOP);
  }
}
