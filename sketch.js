let canvasWidth = 400;
let canvasHeight = 600;
let player = {};
let playerSpeed = 5;
let playerRadius = 14;
let bullets = [];
let bulletRadius = 4;
let bulletSpeed = 8;
let enemies = [];
let enemyRadius = 12;
let enemySpeed = 2;
let particles = [];
let particleRadius = 3;
let particleLife = 20;
let stars = [];
let starCount = 30;
let score = 0;
let gameOver = false;
function setup(){
  createCanvas(canvasWidth, canvasHeight);
  player.x = canvasWidth / 2;
  player.y = canvasHeight - 40;
  for(let i=0;i<starCount;i++){
    let s = {};
    s.x = random(0, canvasWidth);
    s.y = random(0, canvasHeight);
    s.size = random(1,3);
    s.speed = random(0.5,2);
    stars.push(s);
  }
}
function draw(){
  background(0);
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    fill(255);
    noStroke();
    circle(s.x, s.y, s.size);
    if(!gameOver){
      s.y += s.speed;
    }
    if(s.y > height){
      s.x = random(0, width);
      s.y = random(-height, -10);
      s.speed = random(0.5,2);
      s.size = random(1,3);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW) || keyIsDown(65)){
      player.x -= playerSpeed;
    }
    if(keyIsDown(RIGHT_ARROW) || keyIsDown(68)){
      player.x += playerSpeed;
    }
    if(player.x < playerRadius){
      player.x = playerRadius;
    }
    if(player.x > width - playerRadius){
      player.x = width - playerRadius;
    }
    if(frameCount % 60 === 0){
      let e = {};
      e.x = random(enemyRadius, width - enemyRadius);
      e.y = -enemyRadius;
      e.vy = enemySpeed;
      enemies.push(e);
    }
    for(let i=bullets.length-1;i>=0;i--){
      let b = bullets[i];
      b.y -= bulletSpeed;
      if(b.y < -bulletRadius){
        bullets.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      e.y += e.vy;
      if(e.y > height + enemyRadius){
        enemies.splice(i,1);
      }
    }
    for(let i=particles.length-1;i>=0;i--){
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if(p.life <= 0){
        particles.splice(i,1);
      }
    }
    for(let i=bullets.length-1;i>=0;i--){
      for(let j=enemies.length-1;j>=0;j--){
        let b = bullets[i];
        let e = enemies[j];
        let d = dist(b.x,b.y,e.x,e.y);
        if(d <= bulletRadius + enemyRadius){
          for(let k=0;k<5;k++){
            let p = {};
            p.x = e.x;
            p.y = e.y;
            let angle = random(0, TWO_PI);
            let speed = random(1,3);
            p.vx = cos(angle) * speed;
            p.vy = sin(angle) * speed;
            p.life = particleLife;
            particles.push(p);
          }
          bullets.splice(i,1);
          enemies.splice(j,1);
          score += 1;
          break;
        }
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      let d2 = dist(e.x,e.y,player.x,player.y);
      if(d2 <= enemyRadius + playerRadius){
        gameOver = true;
        break;
      }
    }
  } else {
    for(let i=particles.length-1;i>=0;i--){
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if(p.life <= 0){
        particles.splice(i,1);
      }
    }
  }
  fill(0,150,255);
  noStroke();
  triangle(player.x, player.y - 12, player.x - 12, player.y + 12, player.x + 12, player.y + 12);
  fill(255,255,0);
  for(let i=0;i<bullets.length;i++){
    let b = bullets[i];
    circle(b.x, b.y, bulletRadius*2);
  }
  fill(255,50,50);
  for(let i=0;i<enemies.length;i++){
    let e = enemies[i];
    circle(e.x, e.y, enemyRadius*2);
  }
  fill(255,150,0);
  for(let i=0;i<particles.length;i++){
    let p = particles[i];
    let alpha = map(p.life,0,particleLife,0,255);
    fill(255,150,0,alpha);
    circle(p.x, p.y, particleRadius*2);
  }
  fill(255);
  textSize(18);
  textAlign(LEFT, TOP);
  text("SCORE: " + score, 10, 10);
  if(gameOver){
    textSize(36);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width/2, height/2);
  }
}
function keyPressed(){
  if(!gameOver){
    if(key === ' ' || keyCode === 32){
      let b = {};
      b.x = player.x;
      b.y = player.y - 16;
      bullets.push(b);
    }
  }
}
