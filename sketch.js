function createEmptyBoard(){let b=[];for(let r=0;r<20;r++){let row=[];for(let c=0;c<10;c++){row.push(0);}b.push(row);}return b;} 
let cols=10,rows=20,cell=30; 
let board=createEmptyBoard(); 
let shapes=[[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],[[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],[[0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],[[0,0,1,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],[[1,0,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],[[0,1,1,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]],[[1,1,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]]]; 
let colors=['#00FFFF','#FFFF00','#800080','#FFA500','#0000FF','#00FF00','#FF0000']; 
let current=null,currentColor=0,dropCounter=0,dropInterval=30,score=0,gameOver=false; 
function rotateMatrix(m){let res=[];for(let i=0;i<4;i++){res.push([0,0,0,0]);}for(let i=0;i<4;i++){for(let j=0;j<4;j++){res[j][3-i]=m[i][j];}}return res;} 
function validPosition(shape,x,y){for(let i=0;i<4;i++){for(let j=0;j<4;j++){if(shape[i][j]){let bx=x+j;let by=y+i;if(bx<0||bx>=cols) return false;if(by>=rows) return false;if(by>=0&&board[by][bx]!==0) return false;}}}return true;} 
function placePiece(shape,x,y,colorIndex){for(let i=0;i<4;i++){for(let j=0;j<4;j++){if(shape[i][j]){let bx=x+j;let by=y+i;if(by>=0&&by<rows&&bx>=0&&bx<cols){board[by][bx]=colorIndex;}}}}} 
function clearLines(){let lines=0;for(let r=rows-1;r>=0;r--){let full=true;for(let c=0;c<cols;c++){if(board[r][c]===0){full=false;break;}}if(full){board.splice(r,1);let newRow=[];for(let c=0;c<cols;c++){newRow.push(0);}board.unshift(newRow);lines++;r++;}}if(lines>0){score+=lines*100;}} 
function spawnPiece(){let idx=Math.floor(Math.random()*shapes.length);let shape=shapes[idx];let x=Math.floor(cols/2)-2;let y=-2;current={shape:shape,x:x,y:y};currentColor=idx+1;if(!validPosition(current.shape,current.x,current.y)){gameOver=true;}} 
function setup(){createCanvas(300,600);frameRate(60);spawnPiece();} 
function attemptMove(dx,dy){if(!current||gameOver) return;let nx=current.x+dx;let ny=current.y+dy;if(validPosition(current.shape,nx,ny)){current.x=nx;current.y=ny;return true;}return false;} 
function rotateCurrent(){if(!current||gameOver) return;let newShape=rotateMatrix(current.shape);let offsets=[0,-1,1,-2,2];for(let k=0;k<offsets.length;k++){let ox=offsets[k];if(validPosition(newShape,current.x+ox,current.y)){current.shape=newShape;current.x+=ox;return;}}} 
function lockAndSpawn(){placePiece(current.shape,current.x,current.y,currentColor);clearLines();spawnPiece();} 
function draw(){background(20);stroke(40);for(let r=0;r<rows;r++){for(let c=0;c<cols;c++){if(board[r][c]!==0){fill(colors[board[r][c]-1]);rect(c*cell,r*cell,cell,cell);}else{noFill();rect(c*cell,r*cell,cell,cell);}}}if(current&& !gameOver){dropCounter++;let interval= keyIsDown(DOWN_ARROW)?2:dropInterval;if(dropCounter>=interval){dropCounter=0;current.y++;if(!validPosition(current.shape,current.x,current.y)){current.y--;lockAndSpawn();}}for(let i=0;i<4;i++){for(let j=0;j<4;j++){if(current.shape[i][j]){let bx=current.x+j;let by=current.y+i;if(by>=0){fill(colors[currentColor-1]);rect(bx*cell,by*cell,cell,cell);}}}}}fill(255);noStroke();textSize(16);text('Score: '+score,10,20);if(gameOver){fill(255,0,0);textSize(32);text('Game Over',50,300);noLoop();}} 
function keyPressed(){if(gameOver) return;if(keyCode===LEFT_ARROW){attemptMove(-1,0);}else if(keyCode===RIGHT_ARROW){attemptMove(1,0);}else if(keyCode===UP_ARROW){rotateCurrent();}}
