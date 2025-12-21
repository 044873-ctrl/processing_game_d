let player;
let bullets;
let enemies;
let particles;
let stars;
let score;
let frameCounter;
let gameOver;
let fireCooldown;
function setup(){
  createCanvas(400,600);
  player = {x: width/2, y: height-30, r: 16, speed: 5};
  bullets = [];
  enemies = [];
  particles = [];
  stars = [];
  score = 0;
  frameCounter = 0;
  gameOver = false;
  fireCooldown = 0;
  for(let i=0;i<30;i++){
    let s = {x: random(0,width), y: random(0,height), r: random(1,3), vy: random(0.5,2.0)};
    stars.push(s);
  }
  textAlign(LEFT,TOP);
  textSize(16);
  noStroke();
}
function draw(){
  background(0);
  for(let si=0;si<stars.length;si++){
    let s = stars[si];
    fill(255);
    ellipse(s.x,s.y,s.r*2,s.r*2);
    s.y += s.vy;
    if(s.y>height){
      s.y = 0;
      s.x = random(0,width);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      player.x -= player.speed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += player.speed;
    }
    player.x = constrain(player.x, player.r, width-player.r);
    if(fireCooldown>0){
      fireCooldown--;
    }
    if(keyIsDown(32) && fireCooldown===0){
      let b = {x: player.x, y: player.y - player.r - 2, r: 4, vy: -8};
      bullets.push(b);
      fireCooldown = 8;
    }
    if(frameCounter % 60 === 0){
      let enemySpeed = 1000000;
      let perFrameVy = enemySpeed/60;
      let e = {x: random(12,width-12), y: -12, r: 12, vy: perFrameVy};
      enemies.push(e);
    }
    for(let i=bullets.length-1;i>=0;i--){
      let b = bullets[i];
      b.y += b.vy;
      if(b.y < -b.r){
        bullets.splice(i,1);
        continue;
      }
      for(let j=enemies.length-1;j>=0;j--){
        let e = enemies[j];
        let d = dist(b.x,b.y,e.x,e.y);
        if(d <= b.r + e.r){
          bullets.splice(i,1);
          enemies.splice(j,1);
          score += 1;
          for(let p=0;p<5;p++){
            let angle = random(0,PI*2);
            let speed = random(1,4);
            let pvx = cos(angle)*speed;
            let pvy = sin(angle)*speed;
            let part = {x: e.x, y: e.y, vx: pvx, vy: pvy, r: 3, life: 20};
            particles.push(part);
          }
          break;
        }
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      e.y += e.vy;
      if(e.y > height + e.r){
        enemies.splice(i,1);
        continue;
      }
      let dplayer = dist(e.x,e.y,player.x,player.y);
      if(dplayer <= e.r + player.r){
        gameOver = true;
      }
    }
    for(let i=particles.length-1;i>=0;i--){
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      if(p.life <= 0){
        particles.splice(i,1);
      }
    }
    frameCounter++;
  }
  fill(0,150,255);
  ellipse(player.x,player.y,player.r*2,player.r*2);
  for(let i=0;i<bullets.length;i++){
    let b = bullets[i];
    fill(255,255,0);
    ellipse(b.x,b.y,b.r*2,b.r*2);
  }
  for(let i=0;i<enemies.length;i++){
    let e = enemies[i];
    fill(255,0,0);
    ellipse(e.x,e.y,e.r*2,e.r*2);
  }
  for(let i=0;i<particles.length;i++){
    let p = particles[i];
    let alpha = map(p.life,0,20,0,255);
    fill(255,150,0,alpha);
    ellipse(p.x,p.y,p.r*2,p.r*2);
  }
  fill(255);
  text("SCORE: " + score, 8, 8);
  if(gameOver){
    fill(0,0,0,150);
    rect(0,0,width,height);
    fill(255);
    textAlign(CENTER,CENTER);
    textSize(32);
    text("GAME OVER", width/2, height/2 - 16);
    textSize(16);
    text("SCORE: " + score, width/2, height/2 + 18);
  }
}
