let canvasW=600,canvasH=400
let paddleW=10,paddleH=80
let playerX,playerY
let cpuX,cpuY
let playerSpeed=6,cpuMaxSpeed=5
let ballX,ballY,ballR=8,ballVX=4,ballVY=3
let playerScore=0,cpuScore=0
let cpuMissTimer=0,cpuMissTargetY=200
function resetBall(dir){ballX=canvasW/2;ballY=canvasH/2;ballVX=4*dir;ballVY=3*(random()<0.5?1:-1);cpuMissTimer=0;cpuMissTargetY=(canvasH-paddleH)/2}
function setup(){createCanvas(canvasW,canvasH);playerX=20;playerY=(canvasH-paddleH)/2;cpuX=canvasW-20-paddleW;cpuY=(canvasH-paddleH)/2;resetBall(random()<0.5?1:-1)}
function draw(){background(0);fill(255);if(keyIsDown(UP_ARROW)){playerY-=playerSpeed}if(keyIsDown(DOWN_ARROW)){playerY+=playerSpeed}playerY=constrain(playerY,0,canvasH-paddleH);if(cpuMissTimer>0){cpuMissTimer--;let dy=cpuMissTargetY-cpuY;let move=cpuMaxSpeed; if(abs(dy)<=move){cpuY+=dy}else{cpuY+=move*(dy>0?1:-1)}}else{let targetY=ballY-paddleH/2;let dy=targetY-cpuY;let move=cpuMaxSpeed;if(abs(dy)<=move){cpuY+=dy}else{cpuY+=move*(dy>0?1:-1)}if(ballVX>0 && cpuMissTimer==0 && random()<0.005){cpuMissTimer=30;cpuMissTargetY=random(0,canvasH-paddleH)}}cpuY=constrain(cpuY,0,canvasH-paddleH);ballX+=ballVX;ballY+=ballVY;if(ballY-ballR<=0){ballY=ballR;ballVY=-ballVY}if(ballY+ballR>=canvasH){ballY=canvasH-ballR;ballVY=-ballVY}if(ballX-ballR<=playerX+paddleW && ballX-ballR>=playerX && ballY>=playerY && ballY<=playerY+paddleH){ballX=playerX+paddleW+ballR;ballVX=-ballVX;let offset=(ballY-(playerY+paddleH/2))/(paddleH/2);ballVY+=offset*3}if(ballX+ballR>=cpuX && ballX+ballR<=cpuX+paddleW && ballY>=cpuY && ballY<=cpuY+paddleH){ballX=cpuX-ballR;ballVX=-ballVX;let offset=(ballY-(cpuY+paddleH/2))/(paddleH/2);ballVY+=offset*3}if(ballVX>8){ballVX=8}if(ballVX<-8){ballVX=-8}if(abs(ballVY)>12){ballVY=ballVY>0?12:-12}if(ballX<0){cpuScore++;resetBall(1)}else if(ballX>canvasW){playerScore++;resetBall(-1)}fill(255);textSize(32);textAlign(CENTER);text(playerScore,canvasW*0.25,40);text(cpuScore,canvasW*0.75,40);fill(255);rect(playerX,playerY,paddleW,paddleH);rect(cpuX,cpuY,paddleW,paddleH);ellipse(ballX,ballY,ballR*2,ballR*2)}
