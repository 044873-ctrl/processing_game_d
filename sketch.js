var cols=10,rows=20,cellSize=30;
var grid;
function createEmptyGrid(){var g=[];for(var r=0;r<rows;r++){var row=[];for(var c=0;c<cols;c++){row.push(0);}g.push(row);}return g;}
grid=createEmptyGrid();
var pieces=[[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,0,0],[1,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,0,1,0],[1,1,1,0],[0,0,0,0]],[[0,0,0,0],[1,0,0,0],[1,1,1,0],[0,0,0,0]],[[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],[[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]]];
var colors=[[0,255,255],[255,255,0],[128,0,128],[255,165,0],[0,0,255],[0,255,0],[255,0,0]];
var currentPiece;
var score=0;
var gameOver=false;
var dropCounter=0;
var baseInterval=30;
function cloneMatrix(m){var out=[];for(var i=0;i<4;i++){var row=[];for(var j=0;j<4;j++){row.push(m[i][j]);}out.push(row);}return out;}
function rotateMatrix(m){var out=[];for(var i=0;i<4;i++){out.push([0,0,0,0]);}for(var i=0;i<4;i++){for(var j=0;j<4;j++){out[j][3-i]=m[i][j];}}return out;}
function collide(shape,x,y){for(var i=0;i<4;i++){for(var j=0;j<4;j++){if(shape[i][j]){var r=y+i;var c=x+j;if(c<0||c>=cols)return true;if(r>=rows)return true;if(r>=0&&grid[r][c])return true;}}}return false;}
function spawnPiece(){var idx=floor(random(pieces.length));var shape=cloneMatrix(pieces[idx]);var x=floor((cols-4)/2);var y=0;currentPiece={shape:shape,x:x,y:y,idx:idx+1};if(collide(currentPiece.shape,currentPiece.x,currentPiece.y)){gameOver=true;}}
function lockPiece(){for(var i=0;i<4;i++){for(var j=0;j<4;j++){if(currentPiece.shape[i][j]){var r=currentPiece.y+i;var c=currentPiece.x+j;if(r>=0&&r<rows&&c>=0&&c<cols){grid[r][c]=currentPiece.idx;}}}}clearLines();spawnPiece();}
function clearLines(){for(var r=rows-1;r>=0;r--){var full=true;for(var c=0;c<cols;c++){if(grid[r][c]===0){full=false;break;}}if(full){grid.splice(r,1);var newRow=[];for(var cc=0;cc<cols;cc++){newRow.push(0);}grid.unshift(newRow);score+=100;r++;}}}
function setup(){createCanvas(cols*cellSize,rows*cellSize);textSize(16);spawnPiece();}
function draw(){background(30);for(var r=0;r<rows;r++){for(var c=0;c<cols;c++){if(grid[r][c]){var colIdx=grid[r][c]-1;fill(colors[colIdx][0],colors[colIdx][1],colors[colIdx][2]);}else{fill(50);}stroke(20);rect(c*cellSize,r*cellSize,cellSize,cellSize);}}if(currentPiece&&!gameOver){for(var i=0;i<4;i++){for(var j=0;j<4;j++){if(currentPiece.shape[i][j]){var r=currentPiece.y+i;var c=currentPiece.x+j; if(r>=0){var colIdx=currentPiece.idx-1;fill(colors[colIdx][0],colors[colIdx][1],colors[colIdx][2]);noStroke();rect(c*cellSize,r*cellSize,cellSize,cellSize);stroke(20);}}}}var interval=keyIsDown(DOWN_ARROW)?2:baseInterval;dropCounter++;if(dropCounter>=interval){dropCounter=0;if(!collide(currentPiece.shape,currentPiece.x,currentPiece.y+1)){currentPiece.y++;}else{lockPiece();}}}fill(255);noStroke();text('Score: '+score,5,18);if(gameOver){fill(200);text('Game Over',width/2-40,height/2);noLoop();}}
function keyPressed(){if(gameOver)return; if(keyCode===LEFT_ARROW){if(currentPiece&&!collide(currentPiece.shape,currentPiece.x-1,currentPiece.y)){currentPiece.x--;}}else if(keyCode===RIGHT_ARROW){if(currentPiece&&!collide(currentPiece.shape,currentPiece.x+1,currentPiece.y)){currentPiece.x++;}}else if(keyCode===UP_ARROW){if(currentPiece){var rotated=rotateMatrix(currentPiece.shape);if(!collide(rotated,currentPiece.x,currentPiece.y)){currentPiece.shape=rotated;}}}}
