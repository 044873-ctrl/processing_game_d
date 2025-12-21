const cols = 20;
const rows = 20;
const cellSize = 20;
let snake = [];
let dirX = 1;
let dirY = 0;
let food = { x: 0, y: 0 };
let score = 0;
let moveInterval = 10;
let frameCounter = 0;
let gameOver = false;
function setup() {
  createCanvas(400, 400);
  frameRate(60);
  const centerX = Math.floor(cols / 2);
  const centerY = Math.floor(rows / 2);
  snake = [
    { x: centerX, y: centerY },
    { x: centerX - 1, y: centerY },
    { x: centerX - 2, y: centerY }
  ];
  placeFood();
  textAlign(LEFT, TOP);
  textSize(16);
  noStroke();
}
function draw() {
  background(220);
  fill(0);
  text("Score: " + score, 6, 6);
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      fill(0, 120, 0);
    } else {
      fill(0, 180, 0);
    }
    rect(snake[i].x * cellSize, snake[i].y * cellSize + 20, cellSize, cellSize);
  }
  fill(200, 0, 0);
  rect(food.x * cellSize, food.y * cellSize + 20, cellSize, cellSize);
  if (!gameOver) {
    frameCounter++;
    if (frameCounter >= moveInterval) {
      moveSnake();
      frameCounter = 0;
    }
  } else {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Game Over", width / 2, height / 2);
    textSize(16);
    textAlign(LEFT, TOP);
  }
}
function moveSnake() {
  if (snake.length === 0) {
    gameOver = true;
    return;
  }
  const head = snake[0];
  const newX = head.x + dirX;
  const newY = head.y + dirY;
  if (newX < 0 || newX >= cols || newY < 0 || newY >= rows) {
    gameOver = true;
    return;
  }
  const willGrow = (food.x === newX && food.y === newY);
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === newX && snake[i].y === newY) {
      if (!(i === snake.length - 1 && !willGrow)) {
        gameOver = true;
        return;
      }
    }
  }
  snake.unshift({ x: newX, y: newY });
  if (willGrow) {
    score++;
    placeFood();
  } else {
    snake.pop();
  }
}
function placeFood() {
  let attempts = 0;
  while (true) {
    const fx = Math.floor(Math.random() * cols);
    const fy = Math.floor(Math.random() * rows);
    let collision = false;
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === fx && snake[i].y === fy) {
        collision = true;
        break;
      }
    }
    if (!collision) {
      food.x = fx;
      food.y = fy;
      return;
    }
    attempts++;
    if (attempts > 1000) {
      return;
    }
  }
}
function keyPressed() {
  if (gameOver) {
    return;
  }
  let newX = dirX;
  let newY = dirY;
  if (keyCode === UP_ARROW) {
    newX = 0;
    newY = -1;
  } else if (keyCode === DOWN_ARROW) {
    newX = 0;
    newY = 1;
  } else if (keyCode === LEFT_ARROW) {
    newX = -1;
    newY = 0;
  } else if (keyCode === RIGHT_ARROW) {
    newX = 1;
    newY = 0;
  } else {
    return;
  }
  if (newX === -dirX && newY === -dirY) {
    return;
  }
  dirX = newX;
  dirY = newY;
}
