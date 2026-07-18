let canvasW=600,canvasH=400;
let pitches=[];
let hits=[];
let bat={x:180,y:canvasH-40,w:12,h:100,angle:0,swinging:false,swingSpeed:0.12,maxAngle:-1.0};
let pitchTimer=0;
let pitchInterval=90;
let score=0;
let strikes=0;
let outs=0;
let inning=1;
const maxOuts=3;
let gravity=0.35;
function spawnPitch(){let y=random(canvasH*0.35,canvasH*0.75);let r=floor(random(8,14));let speed=random(5,9);let p={x:canvasW+20,y:y,r:r,vx:-speed,hit:false};pitches.push(p);}
function checkBatHit(p){let dx=-sin(bat.angle)*bat.h;let dy=-cos(bat.angle)*bat.h;let tipX=bat.x+dx;let tipY=bat.y+dy;let d=dist(tipX,tipY,p.x,p.y);if (!isNaN(d) && d<=p.r+14){return true;}return false;}
function updateBat(){if (bat.swinging){bat.angle += -bat.swingSpeed; if (bat.angle <= bat.maxAngle){bat.swinging=false;bat.angle=bat.maxAngle;}} else {if (bat.angle < 0){bat.angle += bat.swingSpeed; if (bat.angle > 0){bat.angle=0;}}}}
function updatePitches(){for (let i=pitches.length-1;i>=0;i--){let p=pitches[i];p.x += p.vx; if (!p.hit){if (checkBatHit(p)){p.hit=true;let hvx = -random(3,6);let hvy = -random(5,10);hits.push({x:p.x,y:p.y,r:p.r,vx:hvx,vy:hvy,life:0});pitches.splice(i,1);continue;} if (p.x < -60){strikes++;pitches.splice(i,1);if (strikes>=3){strikes=0;outs++;if (outs>=maxOuts){outs=0;inning++;}}}} else {pitches.splice(i,1);}}}
function updateHits(){for (let i=hits.length-1;i>=0;i--){let h=hits[i];h.vy += gravity;h.x += h.vx;h.y += h.vy;h.life++;if (h.x < 0){score++;hits.splice(i,1);} else if (h.y > canvasH+200){hits.splice(i,1);} else if (h.life>600){hits.splice(i,1);}}}
function drawField(){background(80,160,220);noStroke();fill(80,180,90);rect(0,canvasH*0.6,canvasW,canvasH*0.4);fill(200,180,120);ellipse(canvasW*0.5,canvasH*0.75,160,60);fill(255);ellipse(bat.x,bat.y,6,6);}
function drawPitches(){noStroke();fill(255,80,80);for (let i=0;i<pitches.length;i++){let p=pitches[i];ellipse(p.x,p.y,p.r*2,p.r*2);}}
function drawHits(){fill(255,220,80);noStroke();for (let i=0;i<hits.length;i++){let h=hits[i];ellipse(h.x,h.y,h.r*2,h.r*2);}}
function drawBat(){push();translate(bat.x,bat.y);rotate(bat.angle);rectMode(CORNER);fill(120);rect(-bat.w/2,-bat.h,bat.w,bat.h);fill(180);rect(-bat.w/2,0,bat.w,12);pop();}
function drawHUD(){fill(255);noStroke();textSize(16);textAlign(LEFT,TOP);text('Score: '+score,10,10);text('Strikes: '+strikes,10,30);text('Outs: '+outs,10,50);text('Inning: '+inning,10,70);textAlign(RIGHT,TOP);text('Pitch in: '+max(0,floor((pitchInterval-pitchTimer)/60)),canvasW-10,10);}
function setup(){createCanvas(canvasW,canvasH);frameRate(60);}
function draw(){drawField();pitchTimer++;if (pitchTimer>=pitchInterval){spawnPitch();pitchTimer=0;pitchInterval=floor(random(60,120));}updateBat();updatePitches();updateHits();drawPitches();drawHits();drawBat();drawHUD();}
function keyPressed(){if (key === ' ' || keyCode === 32){if (!bat.swinging && bat.angle===0){bat.swinging=true;}}}
function mousePressed(){if (!bat.swinging && bat.angle===0){bat.swinging=true;}}
