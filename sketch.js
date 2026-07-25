let paddle={x:200,y:570,w:90,h:12};
let ball={x:200,y:300,r:6,vx:4,vy:-5};
let ballSpeed=Math.sqrt(4*4+(-5)*(-5));
let rows=6,cols=7;
let blocks=[];
let blockColors=["#ff6666","#ffcc66","#ffff66","66ff66","#66ccff","#cc66ff"];
let particles=[];
let score=0;
let level=1;
let lastLevelUpScore=-1;
let gameOver=false;
let startTime=0;
let lastSpeedIncreaseSecond=0;
function clamp(v,a,b){return v<a? a : v>b? b : v;}
function circleRectCollision(cx,cy,r,rx,ry,rw,rh){let closestX=clamp(cx,rx,rx+rw);let closestY=clamp(cy,ry,ry+rh);let dx=cx-closestX;let dy=cy-closestY;return dx*dx+dy*dy<=r*r+1e-6;}
function initBlocks(){let marginX=20;let gap=6;let blockW=(width - marginX*2 - gap*(cols-1))/cols;let blockH=20;let startY=60;for(let r=0;r<rows;r++){for(let c=0;c<cols;c++){let bx=marginX + c*(blockW+gap);let by=startY + r*(blockH+gap);let bcolor=blockColors[r%blockColors.length];blocks.push({x:bx,y:by,w:blockW,h:blockH,color:bcolor});}}}
function spawnParticles(px,py){for(let i=0;i<3;i++){let vx=(Math.random()*2 - 1)*2;let vy=(Math.random()*2 - 1)*2;particles.push({x:px,y:py,vx:vx,vy:vy,life:15,r:3});}}
function updateParticles(){for(let i=particles.length - 1;i>=0;i--){let p=particles[i];p.x += p.vx;p.y += p.vy;p.life -= 1;if(p.life <= 0){particles.splice(i,1);}}}
function drawParticles(){for(let i=0;i<particles.length;i++){let p=particles[i];let alpha=map(p.life,0,15,0,255);fill(255,200,0,alpha);ellipse(p.x,p.y,p.r*2,p.r*2);}}
function updatePaddle(){paddle.x=constrain(mouseX,paddle.w/2,width - paddle.w/2);} 
function drawPaddle(){fill(200);rect(paddle.x - paddle.w/2,paddle.y - paddle.h/2,paddle.w,paddle.h,4);} 
function updateBall(){if(gameOver){return;}ball.x += ball.vx;ball.y += ball.vy;if(ball.x - ball.r < 0){ball.x = ball.r; ball.vx = Math.abs(ball.vx);}if(ball.x + ball.r > width){ball.x = width - ball.r; ball.vx = -Math.abs(ball.vx);}if(ball.y - ball.r < 0){ball.y = ball.r; ball.vy = Math.abs(ball.vy);}if(ball.y - ball.r > height){gameOver = true;}if(ball.vy > 0 && circleRectCollision(ball.x,ball.y,ball.r,paddle.x - paddle.w/2,paddle.y - paddle.h/2,paddle.w,paddle.h)){let rel=(ball.x - paddle.x)/(paddle.w/2);if(rel < -1){rel = -1;}else if(rel > 1){rel = 1;}let angle = rel * (Math.PI/3);ball.vx = ballSpeed * Math.sin(angle);ball.vy = -Math.abs(ballSpeed * Math.cos(angle));ball.y = paddle.y - paddle.h/2 - ball.r - 0.1;}}
function drawBall(){fill(255);ellipse(ball.x,ball.y,ball.r*2,ball.r*2);} 
function checkLevelUp(){if(score>0 && score % 6 === 0 && lastLevelUpScore !== score){level += 1;lastLevelUpScore = score;}}
function handleBlockCollisions(){for(let i=blocks.length - 1;i>=0;i--){let b=blocks[i];if(circleRectCollision(ball.x,ball.y,ball.r,b.x,b.y,b.w,b.h)){spawnParticles(b.x + b.w/2,b.y + b.h/2);blocks.splice(i,1);score += 10;checkLevelUp();ball.vy = -ball.vy;break;}}}
function drawBlocks(){for(let i=0;i<blocks.length;i++){let b=blocks[i];fill(b.color);rect(b.x,b.y,b.w,b.h);}}
function drawUI(){fill(255);textSize(16);textAlign(LEFT,TOP);text('Score: ' + score,8,8);textAlign(CENTER,TOP);text('Level: ' + level,width/2,8);let elapsedMs=millis() - startTime;let elapsedSeconds=elapsedMs/1000;let timeStr=elapsedSeconds.toFixed(2);textAlign(RIGHT,TOP);text(timeStr,width-8,8);textAlign(LEFT,TOP);if(!gameOver){let intSec=Math.floor(elapsedSeconds);while(lastSpeedIncreaseSecond < intSec){lastSpeedIncreaseSecond++;ball.vx *= 1.2;ball.vy *= 1.2;ballSpeed *= 1.2;}}}
function setup(){createCanvas(400,600);frameRate(60);initBlocks();textSize(16);textAlign(LEFT,TOP);noStroke();startTime = millis();}
function draw(){background(30);updatePaddle();drawPaddle();updateBall();drawBall();handleBlockCollisions();updateParticles();drawBlocks();drawParticles();drawUI();if(gameOver){textSize(32);textAlign(CENTER,CENTER);fill(255);text('Game Over',width/2,height/2);textSize(16);textAlign(LEFT,TOP);}}
