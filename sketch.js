let cols=10;
let rows=20;
let cell=30;
let grid=[];
let shapes=[];
let colors=[];
let current=null;
let dropCounter=0;
let dropInterval=30;
let score=0;
let isGameOver=false;
function createEmptyGrid(){let g=[];for(let y=0;y<rows;y++){let row=[];for(let x=0;x<cols;x++){row.push(0);}g.push(row);}return g;}
function defineShapes(){shapes=[];colors=[];colors.push([0,255,255]);colors.push([255,255,0]);colors.push([128,0,128]);colors.push([255,165,0]);colors.push([0,0,255]);colors.push([0,255,0]);colors.push([255,0,0]);shapes.push([[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],[[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]]]);shapes.push([[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]]);shapes.push([[[0,0,0,0],[0,1,0,0],[1,1,1,0],[0,0,0,0]],[[0,1,0,0],[0,1,1,0],[0,1,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,0],[0,1,0,0]],[[0,1,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]]]);shapes.push([[[0,0,0,0],[0,0,1,0],[1,1,1,0],[0,0,0,0]],[[0,1,1,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[1,1,1,0],[1,0,0,0]],[[0,1,0,0],[0,1,0,0],[1,1,0,0],[0,0,0,0]]]);shapes.push([[[0,0,0,0],[1,1,1,0],[1,0,0,0],[0,0,0,0]],[[0,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,0,1,0],[1,1,1,0],[0,0,0,0]],[[1,1,0,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]]]);shapes.push([[[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],[[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,0,0]]]);shapes.push([[[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]],[[0,0,1,0],[0,1,1,0],[0,1,0,0],[0,0,0,0]]]);}
function collides(mat,x,y){for(let i=0;i<4;i++){for(let j=0;j<4;j++){if(mat[i][j]===1){let gx=x+j;let gy=y+i;if(gx<0||gx>=cols||gy<0||gy>=rows) return true;if(grid[gy][gx]!==0) return true;}}}return false;}
function spawnPiece(){let id=floor(random(0,shapes.length));let rot=0;let mat=shapes[id][rot];let x=3;let y=0;current={id:id,rot:rot,x:x,y:y,mat:mat};if(collides(current.mat,current.x,current.y)){isGameOver=true;noLoop();}}
function rotatePiece(){if(current===null) return;let next=(current.rot+1)%shapes[current.id].length;let nextMat=shapes[current.id][next];if(!collides(nextMat,current.x,current.y)){current.rot=next;current.mat=nextMat;}}
function movePiece(dx){if(current===null) return;current.x+=dx;if(collides(current.mat,current.x,current.y)){current.x-=dx;}}
function softDrop(){if(current===null) return;current.y+=1;if(collides(current.mat,current.x,current.y)){current.y-=1;mergePiece();} else {score+=1;}dropCounter=0;}
function mergePiece(){for(let i=0;i<4;i++){for(let j=0;j<4;j++){if(current.mat[i][j]===1){let gx=current.x+j;let gy=current.y+i;if(gy>=0&&gy<rows&&gx>=0&&gx<cols){grid[gy][gx]=current.id+1;}}}}clearLines();spawnPiece();}
function clearLines(){let lines=0;for(let y=rows-1;y>=0;y--){let full=true;for(let x=0;x<cols;x++){if(grid[y][x]===0){full=false;break;}}if(full){grid.splice(y,1);let newRow=[];for(let k=0;k<cols;k++) newRow.push(0);grid.unshift(newRow);lines++;y++;}}if(lines>0){score+=lines*100;}}
function setup(){createCanvas(300,600);grid=createEmptyGrid();defineShapes();spawnPiece();}
function draw(){background(20);dropCounter++;if(!isGameOver&&dropCounter>=dropInterval){current.y+=1;if(collides(current.mat,current.x,current.y)){current.y-=1;mergePiece();}dropCounter=0;}stroke(50);for(let y=0;y<rows;y++){for(let x=0;x<cols;x++){let val=grid[y][x];if(val===0){fill(30);} else {let c=colors[val-1];fill(c[0],c[1],c[2]);}rect(x*cell,y*cell,cell,cell);}}if(current!==null){for(let i=0;i<4;i++){for(let j=0;j<4;j++){if(current.mat[i][j]===1){let gx=current.x+j;let gy=current.y+i;if(gy>=0&&gy<rows&&gx>=0&&gx<cols){let c=colors[current.id];fill(c[0],c[1],c[2]);rect(gx*cell,gy*cell,cell,cell);}}}}}fill(255);noStroke();textSize(16);text('Score: '+score,5,16);if(isGameOver){fill(0,150);rect(0,0,width,height);fill(255);textSize(32);text('Game Over',50,height/2);}}
function keyPressed(){if(isGameOver) return;if(keyCode===37){movePiece(-1);} else if(keyCode===39){movePiece(1);} else if(keyCode===40){softDrop();} else if(keyCode===38){rotatePiece();}}
