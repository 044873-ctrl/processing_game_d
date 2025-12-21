let player;
let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;
let shootCooldown = 0;
function setup(){
  createCanvas(400,600);
  player = {x: width/2, y: height - 30, r: 16, speed: 5};
  for(let i=0;i<30;i++){
    let s = {x: random(0,width), y: random(0,height), speed: random(0.5,2.0), r: random(1,3)};
    stars.push(s);
  }
  score = 0;
  gameOver = false;
  shootCooldown = 0;
}
function draw(){
  background(0);
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    fill(255);
    noStroke();
    ellipse(s.x, s.y, s.r*2, s.r*2);
    s.y += s.speed;
    if(s.y > height){
      s.y = 0;
      s.x = random(0,width);
      s.speed = random(0.5,2.0);
      s.r = random(1,3);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      player.x -= player.speed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += player.speed;
    }
    player.x = constrain(player.x, player.r, width - player.r);
    if(shootCooldown > 0){
      shootCooldown -= 1;
    }
    if(keyIsDown(32) && shootCooldown <= 0){
      let b = {x: player.x, y: player.y - player.r - 4, r: 4, speed: 8};
      bullets.push(b);
      shootCooldown = 10;
    }
    if(frameCount % 60 === 0){
      let ex = random(12, width-12);
      let e = {x: ex, y: -12, r: 12, speed: 2};
      enemies.push(e);
    }
    for(let i=bullets.length-1;i>=0;i--){
      let b = bullets[i];
      fill(255,240,0);
      noStroke();
      ellipse(b.x, b.y, b.r*2, b.r*2);
      b.y -= b.speed;
      if(b.y < -b.r){
        bullets.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      fill(200,50,50);
      noStroke();
      ellipse(e.x, e.y, e.r*2, e.r*2);
      e.y += e.speed;
      if(e.y > height + e.r){
        enemies.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      for(let j=bullets.length-1;j>=0;j--){
        let b = bullets[j];
        let d = dist(e.x,e.y,b.x,b.y);
        if(d <= e.r + b.r){
          for(let k=0;k<5;k++){
            let angle = random(0, TWO_PI);
            let speed = random(1,4);
            let px = e.x;
            let py = e.y;
            let p = {x: px, y: py, vx: cos(angle)*speed, vy: sin(angle)*speed, r: 3, life: 20};
            particles.push(p);
          }
          enemies.splice(i,1);
          bullets.splice(j,1);
          score += 100;
          break;
        }
      }
    }
    for(let i=particles.length-1;i>=0;i--){
      let p = particles[i];
      fill(255,150,0);
      noStroke();
      ellipse(p.x, p.y, p.r*2, p.r*2);
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      if(p.life <= 0){
        particles.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      let d = dist(e.x,e.y,player.x,player.y);
      if(d <= e.r + player.r){
        gameOver = true;
        break;
      }
    }
  } else {
    for(let i=0;i<bullets.length;i++){
      let b = bullets[i];
      fill(255,240,0);
      noStroke();
      ellipse(b.x, b.y, b.r*2, b.r*2);
    }
    for(let i=0;i<enemies.length;i++){
      let e = enemies[i];
      fill(200,50,50);
      noStroke();
      ellipse(e.x, e.y, e.r*2, e.r*2);
    }
    for(let i=0;i<particles.length;i++){
      let p = particles[i];
      fill(255,150,0);
      noStroke();
      ellipse(p.x, p.y, p.r*2, p.r*2);
    }
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(36);
    text(
