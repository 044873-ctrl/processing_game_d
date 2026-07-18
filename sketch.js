let canvasW=480;
let canvasH=640;
let playerX=240;
let playerY=600;
let playerSize=24;
let playerSpeed=4;
let shootCooldown=12;
let shootTimer=0;
let lives=3;
let score=0;
let bullets=[];
let enemies=[];
let spawnTimer=0;
let spawnInterval=60;
let gameState="play";
let maxEnemies=8;
function spawnEnemy(){
  let ex=random(20,canvasW-20);
  let ey=-20;
  let ev=random(1,2.5);
  let es=floor(random(14,28));
  let enemy={x:ex,y:ey,vy:ev,size:es,hp:1};
  enemies.push(enemy);
}
function updateBullets(){
  for(let i=bullets.length-1;i>=0;i--){
    let b=bullets[i];
    b.y += b.vy;
    if(b.y < -10){
      bullets.splice(i,1);
    }
  }
}
function updateEnemies(){
  for(let i=enemies.length-1;i>=0;i--){
    let e=enemies[i];
    e.y += e.vy;
    if(e.y > canvasH + 30){
      enemies.splice(i,1);
      lives -= 1;
      if(lives <= 0){
        gameState = "gameover";
      }
    }
  }
}
function handleCollisions(){
  for(let i=bullets.length-1;i>=0;i--){
    let b=bullets[i];
    for(let j=enemies.length-1;j>=0;j--){
      let e=enemies[j];
      let dx=b.x - e.x;
      let dy=b.y - e.y;
      let r=b.size/2 + e.size/2;
      if(dx*dx + dy*dy <= r*r){
        bullets.splice(i,1);
        enemies.splice(j,1);
        score += 10;
        break;
      }
    }
  }
  for(let i=enemies.length-1;i>=0;i--){
    let e=enemies[i];
    let dx=e.x - playerX;
    let dy=e.y - playerY;
    let r=e.size/2 + playerSize/2;
    if(dx*dx + dy*dy <= r*r){
      enemies.splice(i,1);
      lives -= 1;
      if(lives <= 0) gameState = "gameover";
    }
  }
}
function drawHUD(){
  fill(255);
  textAlign(LEFT,TOP);
  textSize(12);
  text("Score: "+score,10,10);
  text("Lives: "+lives,10,30);
  if(gameState === "gameover"){
    textAlign(CENTER,CENTER);
    textSize(32);
    fill(255,80,80);
    text("Game Over",canvasW/2,canvasH/2 - 20);
    textSize(16);
    fill(255);
    text("Press R to Restart",canvasW/2,canvasH/2 + 20);
  }
}
function resetGame(){
  score = 0;
  lives = 3;
  bullets = [];
  enemies = [];
  playerX = canvasW/2;
  playerY = canvasH - 40;
  spawnTimer = 0;
  spawnInterval = 60;
  gameState = "play";
}
function setup(){
  createCanvas(canvasW,canvasH);
  noStroke();
  textFont('Helvetica');
}
function draw(){
  background(12,18,28);
  if(gameState === "play"){
    if(keyIsDown(37) || keyIsDown(65)){
      playerX -= playerSpeed;
    }
    if(keyIsDown(39) || keyIsDown(68)){
      playerX += playerSpeed;
    }
    playerX = constrain(playerX, playerSize/2, canvasW - playerSize/2);
    if(shootTimer > 0) shootTimer -= 1;
    if(keyIsDown(32) && shootTimer <= 0){
      bullets.push({x:playerX,y:playerY - playerSize/2,vy:-8,size:6});
      shootTimer = shootCooldown;
    }
    spawnTimer += 1;
    if(spawnTimer >= spawnInterval && enemies.length < maxEnemies){
      spawnEnemy();
      spawnTimer = 0;
      if(spawnInterval > 20) spawnInterval -= 1;
    }
    updateBullets();
    updateEnemies();
    handleCollisions();
    fill(80,180,255);
    ellipse(playerX,playerY,playerSize,playerSize);
    for(let i=0;i<bullets.length;i++){
      let b=bullets[i];
      fill(255,220,60);
      ellipse(b.x,b.y,b.size,b.size);
    }
    for(let i=0;i<enemies.length;i++){
      let e=enemies[i];
      fill(255,100,100);
      ellipse(e.x,e.y,e.size,e.size);
    }
    drawHUD();
  } else {
    drawHUD();
    if(keyIsDown(82)){
      resetGame();
    }
  }
}
