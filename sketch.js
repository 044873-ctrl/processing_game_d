let canvasW=600,canvasH=400;
let plateX=150;
let pitcherX=520,pitcherY=200,batterX=140,batterY=260;
let pitchActive=false,pitchX=0,pitchY=0,pitchVx=0,pitchVy=0,pitchProcessed=false;
let swinging=false,swingTimer=0,swingDuration=12;
let balls=0,strikes=0,outs=0,inning=1,half=0;
let score=[0,0];
let bases=[false,false,false];
let atBatDelay=0,nextPitchDelay=30;
let batLength=100,batThickness=10,batOffsetX=12,batOffsetY=-6,batSwingExtend=50;
function setup(){createCanvas(canvasW,canvasH);frameRate(60);textAlign(LEFT,TOP);textSize(14);startNextPitch();}
function startNextPitch(){if(atBatDelay>0)return; if(outs>=3){outs=0;half=1-half;if(half===0){inning++;}bases=[false,false,false];} pitchActive=true; pitchProcessed=false; pitchX=pitcherX; pitchY=pitcherY; pitchVx=-6-random(0,1); pitchVy=random(-0.6,0.6); balls=0; strikes=0;}
function draw(){background(50,150,50);drawField();drawBasesAndPlayers();drawBall();drawHUD();updateSwing();if(pitchActive){pitchX+=pitchVx;pitchY+=pitchVy;if(!pitchProcessed && pitchX<=plateX+10){pitchProcessed=true;handlePlateCross();}}else{if(atBatDelay>0){atBatDelay--; } if(atBatDelay<=0 && !pitchActive){startNextPitch();}}}
function drawField(){fill(200,180,120);noStroke();quad(plateX-60,batterY+60,plateX+120,batterY-40,canvasW,0,canvasW,canvasH);fill(120);rect(plateX-10,batterY+10,20,6);}
function drawBasesAndPlayers(){fill(255);rect(plateX+60,batterY-40,14,14);rect(plateX+30,batterY-120,14,14);rect(plateX-0,batterY-40,14,14);fill(200,0,0);ellipse(pitcherX,pitcherY,26,26);fill(0,0,200);ellipse(batterX,batterY,36,36);drawBat();drawRunners();}
function drawRunners(){fill(255,255,255);let firstX=plateX+67,firstY=batterY-33;let secondX=plateX+37,secondY=batterY-117;let thirdX=plateX+7,thirdY=batterY-33;if(bases[0]){ellipse(firstX,firstY,18,18);}if(bases[1]){ellipse(secondX,secondY,18,18);}if(bases[2]){ellipse(thirdX,thirdY,18,18);}}
function drawBat(){push();noStroke();fill(140,70,20);let startX=batterX+batOffsetX;let startY=batterY+batOffsetY;let len=batLength + (swinging?batSwingExtend:0);rect(startX,startY,len,batThickness,4);pop();}
function drawBall(){if(pitchActive){fill(255,255,0);ellipse(pitchX,pitchY,12,12);}}
function drawHUD(){fill(255);text('Inning: '+inning+' '+(half===0?'Top':'Bottom'),10,10);text('Score: '+score[0]+' - '+score[1],10,30);text('Outs: '+outs+' Balls: '+balls+' Strikes: '+strikes,10,50);text('Bases: '+(bases[2]?1:0)+(bases[1]?1:0)+(bases[0]?1:0),10,70);if(swinging){text('Swing',10,90);} }
function keyPressed(){if(keyCode===32){if(!swinging){swinging=true;swingTimer=0;}}}
function updateSwing(){if(swinging){swingTimer++;if(swingTimer>swingDuration){swinging=false;swingTimer=0;}}}
function handlePlateCross(){let zoneTop=batterY-80;let zoneBottom=batterY-20;let withinZone=(pitchY>=zoneTop && pitchY<=zoneBottom);let batStartX=batterX+batOffsetX;let batEndX=batStartX+batLength+(swinging?batSwingExtend:0);let batTop=batterY+batOffsetY-batThickness;let batBottom=batterY+batOffsetY+batThickness*2;let inBatRect=(pitchX>=batStartX && pitchX<=batEndX && pitchY>=batTop && pitchY<=batBottom);let closeToBatterDistDist=(abs(pitchX-batterX)<=60 && abs(pitchY-batterY)<=60);let closeToBat=inBatRect || closeToBatterDistDist;let didHit=false; if(swinging && closeToBat){didHit=true;} if(didHit){processHit();}else{if(withinZone){strikes++;if(strikes>=3){outs++;strikes=0;balls=0;checkInning();}}else{balls++;if(balls>=4){processWalk();}}} pitchActive=false;atBatDelay=nextPitchDelay;}
function processHit(){let r=random();if(r<0.05){let scored=0;for(let i=2;i>=0;i--){if(bases[i]){scored++;bases[i]=false;}}score[half]+=scored+1;}else if(r<0.10){advanceBases(3);}else if(r<0.30){advanceBases(2);}else{advanceBases(1);}strikes=0;balls=0;atBatDelay=nextPitchDelay;pitchActive=false;}
function processWalk(){advanceBases(1);balls=0;strikes=0;atBatDelay=nextPitchDelay;pitchActive=false;}
function advanceBases(advance){let scored=0;let newBases=[false,false,false];for(let i=2;i>=0;i--){if(bases[i]){let newPos=i+advance; if(newPos>=3){scored++;}else{newBases[newPos]=true;}}}if(advance>=4){scored++;}else{if(advance-1>=0 && advance-1<3){newBases[advance-1]=true;}}bases=newBases;score[half]+=scored;}
function checkInning(){if(outs>=3){outs=0;half=1-half;if(half===0){inning++;}bases=[false,false,false];}}
