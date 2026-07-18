let W=480,H=640;
let playerSize=28;
let playerX;
let playerY;
let playerSpeed=6;
let bullets=[];
let enemies=[];
let enemySpawnRate=60;
let spawnTimer=0;
let score=0;
let lives=3;
let shotCooldown=12;
let shotTimer=0;
function spawnEnemy(){let ex=random(20,W-20);let es=random(16,34);let ev=random(1.2,3.0);let e={x:ex,y:-es,size:es,vy:ev,health:1};enemies.push(e);}
function shoot(){if(shotTimer<=0){let b={x:playerX,y:playerY-playerSize*0.5,vy:-9,size:6};bullets.push(b);shotTimer=shotCooldown;}}
function resetGame(){playerX=W/2;playerY=H-40;bullets=[];enemies=[];score=0;lives=3;enemySpawnRate=60;shotTimer=0;spawnTimer=0;}
function checkCollisions(){for(let i=bullets.length-1;i>=0;i--){let b=bullets[i];if(b.y+b.size<0){bullets.splice(i,1);continue;}for(let j=enemies.length-1;j>=0;j--){let e=enemies[j];let dx=b.x-e.x;let dy=b.y-e.y;let distSq=dx*dx+dy*dy;let r=(b.size+e.size)*0.5;let rSq=r*r;if(distSq<=rSq){bullets.splice(i,1);enemies.splice(j,1);score+=10;break;}}}for(let k=enemies.length-1;k>=0;k--){let e=enemies[k];if(e.y-e.size>H){enemies.splice(k,1);lives-=1;if(lives<0){resetGame();}}}}
function setup(){createCanvas(W,H);playerX=W/2;playerY=H-40;textAlign(CENTER,CENTER);textSize(16);}
function draw(){background(12,12,20);if(keyIsDown(LEFT_ARROW)||keyIsDown(65)){playerX-=playerSpeed;}if(keyIsDown(RIGHT_ARROW)||keyIsDown(68)){playerX+=playerSpeed;}playerX=constrain(playerX,playerSize*0.5,W-playerSize*0.5);if(shotTimer>0){shotTimer-=1;}if(keyIsDown(32)){shoot();}spawnTimer+=1;if(spawnTimer>=enemySpawnRate){spawnTimer=0;spawnEnemy();if(enemySpawnRate>18){enemySpawnRate-=0.5;}}for(let i=enemies.length-1;i>=0;i--){let e=enemies[i];e.y+=e.vy;fill(180,60,60);noStroke();ellipse(e.x,e.y,e.size,e.size);}for(let i=bullets.length-1;i>=0;i--){let b=bullets[i];b.y+=b.vy;fill(200,200,50);noStroke();ellipse(b.x,b.y,b.size,b.size);}checkCollisions();fill(100,200,240);noStroke();rectMode(CENTER);rect(playerX,playerY,playerSize,playerSize);fill(255);text('Score: '+score,60,20);text('Lives: '+lives,W-60,20);if(frameCount%240===0){let bonus={x:random(30,W-30),y:-10,size:18,vy:2};enemies.push(bonus);}if(lives<=0){resetGame();}}
