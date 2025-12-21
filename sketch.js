let player;
let bullets;
let enemies;
let particles;
let stars;
let score;
let gameOver;
let lastShot;
function setup(){
  createCanvas(400,600);
  player = {x: width/2, y: height-40, r: 14, speed: 5};
  bullets = [];
  enemies = [];
  particles = [];
  stars = [];
  score = 0;
  gameOver = false;
  lastShot = -100;
  for(let i=0;i<30;i++){
    let s = {x: random(0,width), y: random(0,height), speed: random(0.5,2), r: random(1,3)};
    stars.push(s);
  }
  noStroke();
  textAlign(LEFT, TOP);
  textSize(18);
}
function draw(){
  background(0);
  fill(255);
  for(let i=stars.length-1;i>=0;i--){
    let s = stars[i];
    s.y += s.speed;
    if(s.y > height){
      s.y = 0;
      s.x = random(0,width);
      s.speed = random(0.5,2);
      s.r = random(1,3);
    }
    ellipse(s.x, s.y, s.r*2, s.r*2);
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      player.x -= player.speed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += player.speed;
    }
    player.x = constrain(player.x, player.r, width - player.r);
    if(keyIsDown(32) && frameCount - lastShot >= 10){
      let b = {x: player.x, y: player.y - player.r - 4, r: 4, vy: -8};
      bullets.push(b);
      lastShot = frameCount;
    }
    if(frameCount % 60 === 0){
      let e = {x: random(12, width-12), y: -12, r: 12, vy: 2};
      enemies.push(e);
    }
  }
  for(let i=bullets.length-1;i>=0;i--){
    let b = bullets[i];
    b.y += b.vy;
    if(b.y < -b.r){
      bullets.splice(i,1);
      continue;
    }
    fill(255);
    ellipse(b.x, b.y, b.r*2, b.r*2);
  }
  for(let i=enemies.length-1;i>=0;i--){
    let e = enemies[i];
    e.y += e.vy;
    if(e.y > height + e.r){
      enemies.splice(i,1);
      continue;
    }
    fill(200,40,40);
    ellipse(e.x, e.y, e.r*2, e.r*2);
    for(let j=bullets.length-1;j>=0;j--){
      let b = bullets[j];
      let dx = e.x - b.x;
      let dy = e.y - b.y;
      let dist2 = dx*dx + dy*dy;
      let rad = e.r + b.r;
      if(dist2 <= rad*rad){
        for(let k=0;k<5;k++){
          let p = {x: e.x, y: e.y, r: 3, life: 20, vx: random(-2,2), vy: random(-2,2)};
          particles.push(p);
        }
        bullets.splice(j,1);
        enemies.splice(i,1);
        score += 1;
        break;
      }
    }
    let dxp = e.x - player.x;
    let dyp = e.y - player.y;
    let distp2 = dxp*dxp + dyp*dyp;
    let radp = e.r + player.r;
    if(distp2 <= radp*radp){
      gameOver = true;
    }
  }
  for(let i=particles.length-1;i>=0;i--){
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    let alpha = map(p.life,0,20,0,255);
    alpha = constrain(alpha,0,255);
    fill(255,150,0,alpha);
    ellipse(p.x, p.y, p.r*2, p.r*2);
    if(p.life <= 0){
      particles.splice(i,1);
    }
  }
  fill(50,180,200);
  ellipse(player.x, player.y, player.r*2, player.r*2);
  fill(255);
  text("SCORE: " + score, 8, 8);
  if(gameOver){
    textAlign(CENTER, CENTER);
    textSize(36);
    fill(255);
    text("GAME OVER", width/2, height/2);
    textSize(18);
    textAlign(LEFT, TOP);
  }
}
