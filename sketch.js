let player;
let playerBullets = [];
let enemies = [];
let enemyBullets = [];
let particles = [];
let stars = [];
let score = 0;
let spawnTimer = 0;
let shootCooldown = 0;
let gameOver = false;
function setup(){
  createCanvas(400,600);
  player = {x: width/2, y: height-40, r: 14, speed: 5};
  for(let i=0;i<30;i++){
    let s = {x: random(0,width), y: random(0,height), r: random(1,3), vy: random(0.5,2)};
    stars.push(s);
  }
  score = 0;
  spawnTimer = 0;
  shootCooldown = 0;
  gameOver = false;
  playerBullets = [];
  enemies = [];
  enemyBullets = [];
  particles = [];
}
function draw(){
  background(0);
  fill(255);
  noStroke();
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    ellipse(s.x,s.y,s.r,s.r);
    s.y += s.vy;
    if(s.y > height){
      s.y = -random(0,50);
      s.x = random(0,width);
      s.vy = random(0.5,2);
      s.r = random(1,3);
    }
  }
  if(!gameOver){
    spawnTimer++;
    if(spawnTimer>=60){
      spawnTimer = 0;
      let ex = random(12,width-12);
      let ey = -12;
      let enemy = {x: ex, y: ey, r: 12, vy: 2};
      enemies.push(enemy);
      let dx = player.x - ex;
      let dy = player.y - ey;
      let mag = sqrt(dx*dx + dy*dy);
      if(mag === 0) mag = 1;
      let speed = 4;
      let eb = {x: ex, y: ey, r: 6, vx: dx/mag*speed, vy: dy/mag*speed};
      enemyBullets.push(eb);
    }
    if(keyIsDown(LEFT_ARROW)){
      player.x -= player.speed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += player.speed;
    }
    if(player.x < player.r) player.x = player.r;
    if(player.x > width - player.r) player.x = width - player.r;
    if(shootCooldown > 0) shootCooldown--;
    if(keyIsDown(32) && shootCooldown === 0){
      shootCooldown = 10;
      let b = {x: player.x, y: player.y - player.r, r: 4, vy: -8};
      playerBullets.push(b);
    }
    for(let i=enemies.length-1;i>=0;i--){
      enemies[i].y += enemies[i].vy;
      if(enemies[i].y - enemies[i].r > height){
        enemies.splice(i,1);
      }
    }
    for(let i=playerBullets.length-1;i>=0;i--){
      let pb = playerBullets[i];
      pb.y += pb.vy;
      if(pb.y + pb.r < 0){
        playerBullets.splice(i,1);
      }
    }
    for(let i=enemyBullets.length-1;i>=0;i--){
      let eb = enemyBullets[i];
      eb.x += eb.vx;
      eb.y += eb.vy;
      if(eb.x + eb.r < 0 || eb.x - eb.r > width || eb.y - eb.r > height || eb.y + eb.r < 0){
        enemyBullets.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let hit = false;
      for(let j=playerBullets.length-1;j>=0;j--){
        let pb = playerBullets[j];
        let dx = enemies[i].x - pb.x;
        let dy = enemies[i].y - pb.y;
        let d = sqrt(dx*dx + dy*dy);
        if(d <= enemies[i].r + pb.r){
          createExplosion(enemies[i].x, enemies[i].y);
          playerBullets.splice(j,1);
          enemies.splice(i,1);
          score += 10;
          hit = true;
          break;
        }
      }
      if(hit) continue;
    }
    for(let i=0;i<enemies.length;i++){
      let dx = enemies[i].x - player.x;
      let dy = enemies[i].y - player.y;
      let d = sqrt(dx*dx + dy*dy);
      if(d <= enemies[i].r + player.r){
        gameOver = true;
      }
    }
    for(let i=particles.length-1;i>=0;i--){
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if(p.life <= 0) particles.splice(i,1);
    }
  }
  fill(0,0,255);
  noStroke();
  triangle(player.x, player.y - player.r, player.x - player.r, player.y + player.r, player.x + player.r, player.y + player.r);
  fill(255,255,0);
  for(let i=0;i<playerBullets.length;i++){
    let b = playerBullets[i];
    ellipse(b.x,b.y,b.r*2,b.r*2);
  }
  fill(255,0,0);
  for(let i=0;i<enemies.length;i++){
    let e = enemies[i];
    ellipse(e.x,e.y,e.r*2,e.r*2);
  }
  fill(255,100,100);
  for(let i=0;i<enemyBullets.length;i++){
    let eb = enemyBullets[i];
    ellipse(eb.x,eb.y,eb.r*2,eb.r*2);
  }
  fill(255,150,0);
  for(let i=0;i<particles.length;i++){
    let p = particles[i];
    ellipse(p.x,p.y,p.r*2,p.r*2);
  }
  fill(255);
  textSize(16);
  textAlign(LEFT,TOP);
  text("SCORE: " + score, 8, 8);
  if(gameOver){
    fill(255,0,0);
    textSize(48);
    textAlign(CENTER,CENTER);
    text("GAME OVER", width/2, height/2);
  }
}
function createExplosion(x,y){
  for(let i=0;i<5;i++){
    let angle = random(0,PI*2);
    let speed = random(1,3);
    let p = {x: x, y: y, r: 3, vx: cos(angle)*speed, vy: sin(angle)*speed, life: 20};
    particles.push(p);
  }
}
