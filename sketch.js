let cols = 20;
let rows = 20;
let cell = 20;
let snake = [];
let dir = {x: 1, y: 0};
let food = {x: 0, y: 0};
let score = 0;
let tick = 0;
let moveInterval = 10;
let gameOver = false;

function setup() {
  createCanvas(cols * cell, rows * cell);
  initGame();
  textFont('Arial');
}

function initGame() {
  snake = [];
  let centerX = Math.floor(cols / 2);
  let centerY = Math.floor(rows / 2);
  for (let i = 0; i < 3; i++) {
    snake.push({x: centerX - i, y: centerY});
  }
  dir = {x: 1, y: 0};
  score = 0;
  tick = 0;
  gameOver = false;
  placeFood();
}

function placeFood() {
  let valid = false;
  let fx = 0;
  let fy = 0;
  while (!valid) {
    fx = Math.floor(random(cols));
    fy = Math.floor(random(rows));
    valid = true;
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === fx && snake[i].y === fy) {
        valid = false;
        break;
      }
    }
  }
  food = {x: fx, y: fy};
}

function draw() {
  background(30);
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 8, 8);
  fill(200, 0, 0);
  rect(food.x * cell, food.y * cell, cell, cell);
  fill(0, 200, 0);
  for (let i = 0; i < snake.length; i++) {
    rect(snake[i].x * cell, snake[i].y * cell, cell, cell);
  }
  if (!gameOver) {
    tick++;
    if (tick % moveInterval === 0) {
      let newHead = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
      if (newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows) {
        gameOver = true;
        return;
      }
      let willEat = (newHead.x === food.x && newHead.y === food.y);
      let limit = snake.length - (willEat ? 0 : 1);
      for (let i = 0; i < limit; i++) {
        if (snake[i].x === newHead.x && snake[i].y === newHead.y) {
          gameOver = true;
          return;
        }
      }
      snake.unshift(newHead);
      if (willEat) {
        score++;
        placeFood();
      } else {
        snake.pop();
      }
    }
  } else {
    textAlign(CENTER, CENTER);
    fill(255, 50, 50);
    textSize(32);
    text('Game Over', width / 2, height / 2 - 16);
    textSize(14);
    text('Press ENTER to restart', width / 2, height / 2 + 16);
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    let nd = {x: 0, y: -1};
    if (!(nd.x === -dir.x && nd.y === -dir.y)) {
      dir = nd;
    }
  } else if (keyCode === DOWN_ARROW) {
    let nd = {x: 0, y: 1};
    if (!(nd.x === -dir.x && nd.y === -dir.y)) {
      dir = nd;
    }
  } else if (keyCode === LEFT_ARROW) {
    let nd = {x: -1, y: 0};
    if (!(nd.x === -dir.x && nd.y === -dir.y)) {
      dir = nd;
    }
  } else if (keyCode === RIGHT_ARROW) {
    let nd = {x: 1, y: 0};
    if (!(nd.x === -dir.x && nd.y === -dir.y)) {
      dir = nd;
    }
  } else if (keyCode === ENTER) {
    if (gameOver) {
      initGame();
    }
  }
}
