var canvasW=800,canvasH=450;
bvar batterX=150,batterY=310;
bvar pitcherX=700,pitcherY=batterY;
bvar strikeZoneHalf=40;
bvar hitWindow=40;
bvar pitchInterval=90;
bvar pitchTimer=60;
bvar currentPitch=null;
bvar ballsCount=0;
bvar strikes=0;
bvar outs=0;
bvar inning=1;
bvar topHalf=true;
bvar runs=0;
bvar bases=[false,false,false];
bvar swinging=false;
bvar swingTimer=0;
bvar swingDuration=12;
bvar fieldColor;
function setup(){createCanvas(canvasW,canvasH);frameRate(60);textFont('monospace');fieldColor=color(27,142,59);}\
nfunction draw(){background(fieldColor);drawField();updatePitch();drawHUD();updateSwing();}\
nfunction drawField(){fill(120,72,0);noStroke();rect(0,0,canvasW,canvasH/2);fill(34,139,34);rect(0,canvasH/2,canvasW,canvasH/2);fill(255);ellipse(pitcherX,pitcherY,18,18);fill(180);rect(batterX-6,batterY-30,12,30);drawBat();drawBases();}\
nfunction drawBat(){push();translate(batterX+20,batterY-10);var angle=0; if(swinging){var t=(swingDuration-swingTimer)/swingDuration;angle=map(t,0,1,-PI/6,PI/2);}rotate(angle);fill(150,75,0);rect(0,-4,60,8);pop();}\
nfunction drawBases(){fill(255);var baseSize=18; if(bases[0]){fill(200,200,0);}else{fill(255);}quad(batterX+60,batterY-10,batterX+60+baseSize/2,batterY-10-baseSize/2,batterX+60,batterY-10-baseSize,batterX+60-baseSize/2,batterY-10-baseSize/2);fill(255); if(bases[1]){fill(200,200,0);}else{fill(255);}quad(batterX+140,batterY-100,batterX+140+baseSize/2,batterY-100-baseSize/2,batterX+140,batterY-100-baseSize,batterX+140-baseSize/2,batterY-100-baseSize/2);fill(255); if(bases[2]){fill(200,200,0);}else{fill(255);}quad(batterX-20,batterY-100,batterX-20+baseSize/2,batterY-100-baseSize/2,batterX-20,batterY-100-baseSize,batterX-20-baseSize/2,batterY-100-baseSize/2);}\
nfunction drawHUD(){fill(255);textSize(14);text('Inning: '+inning+' '+(topHalf? 'Top':'Bottom'),10,20);text('Outs: '+outs,10,40);text('Balls: '+ballsCount+' Strikes: '+strikes,10,60);text('Runs: '+runs,10,80);if(currentPitch){fill(255,0,0);ellipse(currentPitch.x,currentPitch.y,16,16);}var zoneTop=batterY-strikeZoneHalf;var zoneBottom=batterY+strikeZoneHalf;noFill();stroke(255,255,0);rect(batterX-hitWindow,zoneTop,(hitWindow*2),(zoneBottom-zoneTop));stroke(255);noFill();}\
nfunction updatePitch(){if(currentPitch===null){pitchTimer--;if(pitchTimer<=0){pitchBall();pitchTimer=pitchInterval;}}else{currentPitch.x+=currentPitch.vx;currentPitch.y+=currentPitch.vy;if(currentPitch.x<0 || currentPitch.x>canvasW || currentPitch.y<0 || currentPitch.y>canvasH){currentPitch=null;}else{if(!currentPitch.processed){if(currentPitch.x<=batterX+hitWindow && currentPitch.x>=batterX-hitWindow){ }if(currentPitch.x< batterX-hitWindow){currentPitch.processed=true;if(abs(currentPitch.y-batterY)<=strikeZoneHalf){strikes++;if(strikes>=3){outs++;strikes=0;ballsCount=0;checkInning();}}else{ballsCount++;}}}}}}}\
nfunction pitchBall(){var y=pitcherY;var dx=batterX-pitcherX;var dy=batterY-pitcherY;var dist=sqrt(dx*dx+dy*dy);var speed=8+random(0,2);var vx=0;var vy=0;if(dist>0){vx=dx/dist*speed;vy=dy/dist*speed;}currentPitch={x:pitcherX
