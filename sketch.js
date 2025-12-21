let player;
let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;
let spawnCounter = 0;
let fireCooldown = 0;
function createStar(x,y,speed,sz){
  let st = {x:x,y:y,spd:speed,sz:sz};
  return st;
}
function createBullet(x,y,vy,r){
  let b = {x:x,y:y,vy:vy,r:r};
  return b;
}
function createEnemy(x,y,vy,r){
  let e = {x:x,y:y,vy:vy,r:r};
  return e;
}
function createParticle(x,y,vx,vy,r,life){
  let p = {x:x,y:y,vx:vx,vy:vy,r:r,life:life};
  return p;
}
function setup(){
  createCanvas(400,600);
  player = {x:width/2,y:height-40,spd:5,r:16};
  for(let i=0;i<30;i++){
    let sx = Math.floor(random(0,width));
    let sy = random(0,height);
    let sspd = random(0.3,1.2);
    let ssz = random(1,3);
    stars.push(createStar(sx,sy,sspd,ssz));
  }
  score = 0;
  gameOver = false;
  spawnCounter = 0;
  fireCooldown = 0;
  bullets = [];
  enemies = [];
  particles = [];
}
function draw(){
  background(0);
  for(let i=0;i<stars.length;i++){
    let st = stars[i];
    st.y += st.spd;
    if(st.y>height){
      st.y = random(-50,0);
      st.x = random(0,width);
      st.spd = random(0.3,1.2);
      st.sz = random(1,3);
    }
    noStroke();
    fill(255);
    ellipse(st.x,st.y,st.sz,st.sz);
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      player.x -= player.spd;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += player.spd;
    }
    if(player.x < 0 + player.r){
      player.x = 0 + player.r;
    }
    if(player.x > width - player.r){
      player.x = width - player.r;
    }
    if(fireCooldown>0){
      fireCooldown--;
    }
    if(keyIsDown(32) && fireCooldown<=0){
      bullets.push(createBullet(player.x,player.y-12,-8,4));
      fireCooldown = 8;
    }
    spawnCounter++;
    if(spawnCounter>=60){
      spawnCounter = 0;
      let ex = random(12,width-12);
      let ey = -12;
      enemies.push(createEnemy(ex,ey,2,12));
    }
    for(let i=bullets.length-1;i>=0;i--){
      let b = bullets[i];
      b.y += b.vy;
      if(b.y < -b.r){
        bullets.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      e.y += e.vy;
      if(e.y > height + e.r){
        enemies.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      let hit = false;
      for(let j=bullets.length-1;j>=0;j--){
        let b = bullets[j];
        let dx = e.x - b.x;
        let dy = e.y - b.y;
        let dist2 = dx*dx + dy*dy;
        let rsum = e.r + b.r;
        if(dist2 <= rsum*rsum){
          for(let k=0;k<5;k++){
            let angle = random(0,Math.PI*2);
            let sp = random(1,3);
            let pvx = Math.cos(angle)*sp;
            let pvy = Math.sin(angle)*sp;
            particles.push(createParticle(e.x,e.y,pvx,pvy,3,20));
          }
          bullets.splice(j,1);
          enemies.splice(i,1);
          score += 1;
          hit = true;
          break;
        }
      }
      if(hit){
        continue;
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      let dx = e.x - player.x;
      let dy = e.y - player.y;
      let dist2 = dx*dx + dy*dy;
      let rsum = e.r + player.r;
      if(dist2 <= rsum*rsum){
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
  }
  fill(0,128,255);
  noStroke();
  triangle(player.x,player.y-12,player.x-12,player.y+12,player.x+12,player.y+12);
  for(let i=0;i<bullets.length;i++){
    let b = bullets[i];
    fill(255,255,0);
    noStroke();
    ellipse(b.x,b.y,b.r*2,b.r*2);
  }
  for(let i=0;i<enemies.length;i++){
    let e = enemies[i];
    fill(255,0,0);
    noStroke();
    ellipse(e.x,e.y,e.r*2,e.r*2);
  }
  for(let i=0;i<particles.length;i++){
    let p = particles[i];
    let alpha = map(p.life,0,20,0,255);
    fill(255,150,0,alpha);
    noStroke();
    ellipse(p.x,p.y,p.r*2,p.r*2);
  }
  fill(255);
  textSize(18);
  textAlign(LEFT,TOP);
  text("Score: "+score,8,8);
  if(gameOver){
    fill(255,0,0);
    textSize(36);
    textAlign(CENTER,CENTER);
    text("GAME OVER",width/2,height/2);
    textSize(18);
    text("Score: "+score,width/2,height/2+36);
  }
}
