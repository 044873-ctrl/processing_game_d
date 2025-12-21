let cols = 20;
let rows = 20;
let cellSize = 30;
let board = [];
let shapes = [];
let colors = [];
let current = null;
let dropInterval = 30;
let downPressed = false;
let score = 0;
let gameOver = false;
function setup(){
  createCanvas(300,600);
  initShapes();
  createEmptyBoard();
  spawnPiece();
  textAlign(LEFT, TOP);
  textSize(16);
}
function draw(){
  background(30);
  if(gameOver){
    drawBoard();
    fill(255);
    text("Score: "+score,8,8);
    fill(200,50,50);
    textSize(32);
    textAlign(CENTER,CENTER);
    text("GAME OVER", width/2, height/2);
    return;
  }
  if(downPressed){
    dropInterval = 2;
  } else {
    dropInterval = 30;
  }
  if(frameCount % dropInterval === 0){
    stepDown();
  }
  drawBoard();
  drawCurrent();
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Score: "+score,8,8);
}
function createEmptyBoard(){
  board = [];
  for(let r=0;r<rows;r++){
    let row = [];
    for(let c=0;c<cols;c++){
      row.push(0);
    }
    board.push(row);
  }
}
function initShapes(){
  shapes = [];
  colors = [];
  let I = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,1,1,1,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ];
  let O = [
    [0,0,0,0,0],
    [0,1,1,0,0],
    [0,1,1,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ];
  let T = [
    [0,0,0,0,0],
    [0,0,1,0,0],
    [0,1,1,1,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ];
  let L = [
    [0,0,0,0,0],
    [0,0,0,1,0],
    [0,1,1,1,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ];
  let J = [
    [0,0,0,0,0],
    [0,1,0,0,0],
    [0,1,1,1,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ];
  let S = [
    [0,0,0,0,0],
    [0,0,1,1,0],
    [0,1,1,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ];
  let Z = [
    [0,0,0,0,0],
    [0,1,1,0,0],
    [0,0,1,1,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ];
  shapes.push(I);
  shapes.push(O);
  shapes.push(T);
  shapes.push(L);
  shapes.push(J);
  shapes.push(S);
  shapes.push(Z);
  colors.push([80,200,240]);
  colors.push([240,200,80]);
  colors.push([160,80,240]);
  colors.push([240,160,80]);
  colors.push([80,120,240]);
  colors.push([120,240,120]);
  colors.push([240,80,80]);
}
function spawnPiece(){
  let idx = floor(random(shapes.length));
  let shape = copyShape(shapes[idx]);
  let px = floor((cols - 5)/2);
  let py = -2;
  current = {shape:shape,x:px,y:py,color:colors[idx]};
  if(!canPlace(current.shape,current.x,current.y)){
    gameOver = true;
  }
}
function copyShape(s){
  let out = [];
  for(let i=0;i<5;i++){
    let row = [];
    for(let j=0;j<5;j++){
      row.push(s[i][j]);
    }
    out.push(row);
  }
  return out;
}
function canPlace(shape,x,y){
  for(let i=0;i<5;i++){
    for(let j=0;j<5;j++){
      if(shape[i][j]===1){
        let bx = x + j;
        let by = y + i;
        if(bx < 0 || bx >= cols) return false;
        if(by >= rows) return false;
        if(by < 0) continue;
        if(board[by][bx] === 1) return false;
      }
    }
  }
  return true;
}
function placePiece(){
  for(let i=0;i<5;i++){
    for(let j=0;j<5;j++){
      if(current.shape[i][j]===1){
        let bx = current.x + j;
        let by = current.y + i;
        if(by >= 0 && by < rows && bx >= 0 && bx < cols){
          board[by][bx] = 1;
        }
      }
    }
  }
}
function clearLines(){
  let linesCleared = 0;
  for(let r=rows-1;r>=0;r--){
    let full = true;
    for(let c=0;c<cols;c++){
      if(board[r][c]===0){
        full = false;
        break;
      }
    }
    if(full){
      linesCleared++;
      for(let rr=r;rr>0;rr--){
        for(let cc=0;cc<cols;cc++){
          board[rr][cc] = board[rr-1][cc];
        }
      }
      for(let cc=0;cc<cols;cc++){
        board[0][cc] = 0;
      }
      r++;
    }
  }
  if(linesCleared>0){
    score += linesCleared * 100;
  }
}
function rotateMatrix(shape){
  let out = [];
  for(let i=0;i<5;i++){
    out.push([0,0,0,0,0]);
  }
  for(let i=0;i<5;i++){
    for(let j=0;j<5;j++){
      out[j][4-i] = shape[i][j];
    }
  }
  return out;
}
function stepDown(){
  if(gameOver) return;
  let nx = current.x;
  let ny = current.y + 1;
  if(canPlace(current.shape,nx,ny)){
    current.y = ny;
  } else {
    placePiece();
    clearLines();
    spawnPiece();
  }
}
function drawBoard(){
  stroke(50);
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      let x = c * cellSize;
      let y = r * cellSize;
      if(board[r][c]===1){
        fill(180);
        rect(x,y,cellSize,cellSize);
      } else {
        noFill();
        rect(x,y,cellSize,cellSize);
      }
    }
  }
}
function drawCurrent(){
  if(!current) return;
  fill(current.color[0],current.color[1],current.color[2]);
  noStroke();
  for(let i=0;i<5;i++){
    for(let j=0;j<5;j++){
      if(current.shape[i][j]===1){
        let bx = current.x + j;
        let by = current.y + i;
        if(by >= 0 && by < rows && bx >= 0 && bx < cols){
          rect(bx*cellSize, by*cellSize, cellSize, cellSize);
        }
      }
    }
  }
  stroke(50);
}
function keyPressed(){
  if(gameOver) return;
  if(keyCode === LEFT_ARROW){
    let nx = current.x - 1;
    let ny = current.y;
    if(canPlace(current.shape,nx,ny)){
      current.x = nx;
    }
  } else if(keyCode === RIGHT_ARROW){
    let nx = current.x + 1;
    let ny = current.y;
    if(canPlace(current.shape,nx,ny)){
      current.x = nx;
    }
  } else if(keyCode === DOWN_ARROW){
    downPressed = true;
  } else if(keyCode === UP_ARROW){
    let rotated = rotateMatrix(current.shape);
    if(canPlace(rotated,current.x,current.y)){
      current.shape = rotated;
    }
  }
}
function keyReleased(){
  if(keyCode === DOWN_ARROW){
    downPressed = false;
  }
}
