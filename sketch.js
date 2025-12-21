let cols = 20;
let rows = 20;
let cellSize = 20;
let snake = [];
let dir = {x:1, y:0};
let food = {x:0, y:0};
let score = 0;
let moveInterval = 10;
let tickCounter = 0;
let gameOver = false;
function setup(){
  createCanvas(cols*cellSize, rows*cellSize);
  let centerX = Math.floor(cols/2);
  let centerY = Math.floor(rows/2);
  snake = [];
  snake.push({x:centerX, y:centerY});
  snake.push({x:centerX-1, y:centerY});
  snake.push({x:centerX-2, y:centerY});
  dir = {x:1, y:0};
  score = 0;
  tickCounter = 0;
  gameOver = false;
  food = placeFood();
  textAlign(CENTER, CENTER);
  textSize(16);
}
function draw(){
  background(220);
  drawFood();
  drawSnake();
  drawUI();
  if(!gameOver){
    tickCounter++;
    if(tickCounter >= moveInterval){
      tickCounter = 0;
      updateSnake();
    }
  } else {
    fill(180,20,20);
    textSize(32);
    text("Game Over", width/2, height/2);
  }
}
function drawSnake(){
  for(let i=0;i<snake.length;i++){
    let s = snake[i];
    if(i===0){
      fill(20,120,20);
    } else {
      fill(50,180,50);
    }
    rect(s.x*cellSize, s.y*cellSize, cellSize, cellSize);
  }
}
function drawFood(){
  fill(200,30,30);
  rect(food.x*cellSize, food.y*cellSize, cellSize, cellSize);
}
function drawUI(){
  fill(0);
  textSize(16);
  text("Score: " + score, width/2, 12);
}
function updateSnake(){
  if(snake.length <= 0){
    return;
  }
  let head = snake[0];
  let newHead = {x: head.x + dir.x, y: head.y + dir.y};
  if(newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows){
    gameOver = true;
    return;
  }
  for(let i=0;i<snake.length;i++){
    let s = snake[i];
    if(s.x === newHead.x && s.y === newHead.y){
      gameOver = true;
      return;
    }
  }
  snake.unshift(newHead);
  if(newHead.x === food.x && newHead.y === food.y){
    score++;
    food = placeFood();
  } else {
    snake.pop();
  }
}
function placeFood(){
  let maxAttempts = cols * rows;
  let attempt = 0;
  while(attempt < maxAttempts){
    let fx = Math.floor(Math.random() * cols);
    let fy = Math.floor(Math.random() * rows);
    let conflict = false;
    for(let i=0;i<snake.length;i++){
      if(snake[i].x === fx && snake[i].y === fy){
        conflict = true;
        break;
      }
    }
    if(!conflict){
      return {x:fx, y:fy};
    }
    attempt++;
  }
  return {x:0, y:0};
}
function keyPressed(){
  if(gameOver){
    return;
  }
  let newDir = {x:dir.x, y:dir.y};
  if(keyCode === LEFT_ARROW){
    newDir = {x:-1, y:0};
  } else if(keyCode === RIGHT_ARROW){
    newDir = {x:1, y:0};
  } else if(keyCode === UP_ARROW){
    newDir = {x:0, y:-1};
  } else if(keyCode === DOWN_ARROW){
    newDir = {x:0, y:1};
  } else {
    return;
  }
  if(newDir.x === -dir.x && newDir.y === -dir.y){
    return;
  }
  dir = newDir;
}
