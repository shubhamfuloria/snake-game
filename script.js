/*
 * there is a 80* 80 matrix represented by a grid layout, snake will be represented by divs inside that board
*/

const snake = [
  { x: 5, y: 15 },
  { x: 5, y: 14 }
]

let score = 0;
let snakeDir = -1;
const food = { x: 20, y: 20 };
let isGameStarted = false;
let snakeSpeed = 200;
// sound effects 

const gameOverSoundEffect = new Audio('./assets/game-over.mp3');
const eatingSoundEffect = new Audio('./assets/eating-sound.mp3')

const boardEl = document.querySelector('.main')
const scoreBoard = document.querySelector('.score')
const statusEl = document.querySelector('.status')

function drawSnake() {
  boardEl.replaceChildren();
  snake.forEach(({ x, y }, i) => {

    const snakeBodyEl = document.createElement('div')
    snakeBodyEl.classList.add('snake');
    snakeBodyEl.style.gridRowStart = x;
    snakeBodyEl.style.gridColumnStart = y;
    boardEl.appendChild(snakeBodyEl);

    if (i == 0) {
      snakeBodyEl.classList.add('head')
    }

  })
}

function drawFood() {
  const foodEl = document.createElement('div');
  foodEl.classList.add('food');
  foodEl.style.gridRowStart = food.x;
  foodEl.style.gridColumnStart = food.y;

  boardEl.appendChild(foodEl);
}

function btnPressHandler({ code }) {

  console.log(code);

  switch (code) {
    case 'ArrowUp':
      if (snakeDir == 2) break; // snake shouldn't take uturn directly
      snakeDir = 0;
      break;
    case 'ArrowRight':
      if (snakeDir == 3) break;
      snakeDir = 1;
      break;
    case 'ArrowDown':
      if (snakeDir == 0) break;
      snakeDir = 2;
      break;
    case 'ArrowLeft':
      if (snakeDir == 1) break;
      snakeDir = 3;
      break;
  }

  // if it's the first time user has pressed any key start the game
  //
  if (isGameStarted == false) {
    startGame();
  }
}

function updateSnakePosition(ifFood) {

  if (snakeDir == -1) return // snake not moving anywhere
  const newHeadPos = { ...snake[0] };
  switch (snakeDir) {
    case 0:
      newHeadPos.x -= 1;
      break;
    case 1:
      newHeadPos.y += 1;
      break;
    case 2:
      newHeadPos.x += 1;
      break;
    case 3:
      newHeadPos.y -= 1;
      break;
  }

  if (!ifFood) snake.pop();
  snake.unshift(newHeadPos)

  /*
  Snakeake.forEach(pos => {
    switch (snakeDir) {
      case 0:
        pos.x -= 1;
        break;
      case 1:
        pos.y += 1;
        break;
      case 2:
        pos.x += 1;
        break;
      case 3:
        pos.y -= 1;
        break;
    }
  })

  */
}

function generateFood() {
  const x = Math.floor(Math.random() * 40) + 1;
  const y = Math.floor(Math.random() * 40) + 1;

  food.x = x;
  food.y = y;
}

/**
  * This detects with collison either with walls or food.
  * if snake colides with wall, then this stops gameLoop
  * */
function detectColision() {
  const head = snake[0];
  // if head goes out of board kill snake

  //if head colides with snake then also it's game over 
  let isHeadCollidedWithBody = false;

  for (i = 1; i < snake.length; i++) {
    const bodyPart = snake[i];
    if (bodyPart.x == head.x && bodyPart.y == head.y) {
      isHeadCollidedWithBody = true;
    }
  }

  if (head.x >= 40 || head.y >= 40 || head.x <= 0 || head.y <= 0 || isHeadCollidedWithBody) {
    gameOver();
  } else if (head.x == food.x && head.y == food.y) {
    // eat food'
    score++;
    updateScore();
    eatingSoundEffect.play();
    generateFood();

    if (score % 2 != 0) {
      clearInterval(gameLoopIntervalId);
      snakeSpeed -= 10;
      gameLoopIntervalId = setInterval(gameLoop, snakeSpeed)
    }
    // increase snake length

    updateSnakePosition(true);

  }
}

function updateScore() {
  scoreBoard.textContent = `Score: ${score}`;
}

function gameOver() {
  gameOverSoundEffect.play();
  // stop game loop
  clearInterval(gameLoopIntervalId)
  statusEl.textContent = "GAME OVER ";
  isGameStarted = false;
}

function gameLoop() {
  console.log("running game loop");

  updateSnakePosition();
  drawSnake();
  console.log(snake[0].x, snake[0].y)
  drawFood();
  detectColision();
}

function startGame() {
  gameLoopIntervalId = setInterval(gameLoop, snakeSpeed);
  isGameStarted = true;
  statusEl.textContent = "";
  snake.length = 0;
  snake.push({ x: 5, y: 15 });
  snake.push({ x: 5, y: 14 })
  snakeSpeed = 200;
  score = 0;

}


window.onkeydown = btnPressHandler;


drawSnake();
