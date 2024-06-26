const colorPalette = {
  LandColors: ["#7f5539", "#9e6c48", "#a67c52", "#b28c5a", "#c2a279", "#556b2f", "#6b8e23", "#8bc34a", "#9ccc65"],
  WaterColors: ["#6495ed", "#7ca9eb", "#94bcea", "#add0e8", "#c5e4e7", "#d0e0e3", "#bcd4e6", "#9ebcdb", "#81a4d0"],
  LandBall: "#556b2f",
  WaterBall: "#b0e0e6",
};

const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

let canvasWidth, canvasHeight;

const LAND_BALL_COLOR = colorPalette.LandBall;
const WATER_BALL_COLOR = colorPalette.WaterBall;
const SQUARE_SIZE = 15;
const MIN_SPEED = 5;
const MAX_SPEED = 10;

let numSquaresX, numSquaresY;
let landScore = 0;
let waterScore = 0;
const squares = [];
const balls = [
  {
    x: canvas.width / 4,
    y: canvas.height / 2,
    dx: 8,
    dy: -8,
    reverseColor: colorPalette.WaterColors,
    ballColor: LAND_BALL_COLOR,
  },
  {
    x: (canvas.width / 4) * 3,
    y: canvas.height / 2,
    dx: -8,
    dy: 8,
    reverseColor: colorPalette.LandColors,
    ballColor: WATER_BALL_COLOR,
  },
];

let iteration = 0;

function resizeCanvas() {
  canvasWidth = canvas.offsetWidth;
  canvasHeight = canvas.offsetHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  numSquaresX = Math.floor(canvasWidth / SQUARE_SIZE);
  numSquaresY = Math.floor(canvasHeight / SQUARE_SIZE);

  initializeSquares();
  initializeBalls();
}

function initializeSquares() {
  for (let i = 0; i < numSquaresX; i++) {
    squares[i] = [];
    for (let j = 0; j < numSquaresY; j++) {
      if (i < numSquaresX / 2) {
        // Land
        squares[i][j] = colorPalette.LandColors[Math.floor(Math.random() * colorPalette.LandColors.length)];
      } else {
        // Water
        squares[i][j] = colorPalette.WaterColors[Math.floor(Math.random() * colorPalette.WaterColors.length)];
      }
    }
  }
}

function initializeBalls() {
  balls[0] = {
    x: canvasWidth / 4,
    y: canvasHeight / 2,
    dx: 8,
    dy: -8,
    reverseColor: colorPalette.WaterColors,
    ballColor: LAND_BALL_COLOR,
  };

  balls[1] = {
    x: (canvasWidth / 4) * 3,
    y: canvasHeight / 2,
    dx: -8,
    dy: 8,
    reverseColor: colorPalette.LandColors,
    ballColor: WATER_BALL_COLOR,
  };
}

function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, SQUARE_SIZE / 2, 0, Math.PI * 2, false);
  ctx.fillStyle = ball.ballColor;
  ctx.fill();
  ctx.closePath();
}

function drawSquares() {
  landScore = 0;
  waterScore = 0;

  for (let i = 0; i < numSquaresX; i++) {
    for (let j = 0; j < numSquaresY; j++) {
      ctx.fillStyle = squares[i][j];
      ctx.fillRect(i * SQUARE_SIZE, j * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

      // Update scores
      if (colorPalette.LandColors.includes(squares[i][j])) landScore++;
      if (colorPalette.WaterColors.includes(squares[i][j])) waterScore++;
    }
  }
}

function checkSquareCollision(ball) {
  // Check multiple points around the ball's circumference
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
    const checkX = ball.x + Math.cos(angle) * (SQUARE_SIZE / 2);
    const checkY = ball.y + Math.sin(angle) * (SQUARE_SIZE / 2);

    const i = Math.floor(checkX / SQUARE_SIZE);
    const j = Math.floor(checkY / SQUARE_SIZE);

    if (i >= 0 && i < numSquaresX && j >= 0 && j < numSquaresY) {
      if (!ball.reverseColor.includes(squares[i][j])) {
        // Square hit! Update square color
        squares[i][j] = ball.reverseColor[Math.floor(Math.random() * ball.reverseColor.length)];

        // Determine bounce direction based on the angle
        if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
          ball.dx = -ball.dx;
        } else {
          ball.dy = -ball.dy;
        }
      }
    }
  }
}

function checkBoundaryCollision(ball) {
  if (ball.x + ball.dx > canvasWidth - SQUARE_SIZE / 2 || ball.x + ball.dx < SQUARE_SIZE / 2) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy > canvasHeight - SQUARE_SIZE / 2 || ball.y + ball.dy < SQUARE_SIZE / 2) {
    ball.dy = -ball.dy;
  }
}

function addRandomness(ball) {
  ball.dx += Math.random() * 0.01 - 0.005;
  ball.dy += Math.random() * 0.01 - 0.005;

  // Limit the speed of the ball
  ball.dx = Math.min(Math.max(ball.dx, -MAX_SPEED), MAX_SPEED);
  ball.dy = Math.min(Math.max(ball.dy, -MAX_SPEED), MAX_SPEED);

  // Make sure the ball always maintains a minimum speed
  if (Math.abs(ball.dx) < MIN_SPEED) ball.dx = ball.dx > 0 ? MIN_SPEED : -MIN_SPEED;
  if (Math.abs(ball.dy) < MIN_SPEED) ball.dy = ball.dy > 0 ? MIN_SPEED : -MIN_SPEED;
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawSquares();

  scoreElement.textContent = `land ${landScore} | water ${waterScore}`;

  // Update background color based on score
  if (landScore > waterScore) {
    document.body.style.background = "linear-gradient(to bottom, #8bc34a 0%, #9ccc65 100%)";
  } else if (waterScore > landScore) {
    document.body.style.background = "linear-gradient(to bottom, #6495ed 0%, #94bcea 100%)";
  } else {
    document.body.style.background = "linear-gradient(to bottom, #2c5f9b 0%, #6495ed 100%)";
  }

  balls.forEach((ball) => {
    drawBall(ball);
    checkSquareCollision(ball);
    checkBoundaryCollision(ball);
    ball.x += ball.dx;
    ball.y += ball.dy;

    addRandomness(ball);
  });

  iteration++;
  if (iteration % 1_000 === 0) console.log("iteration", iteration);

  requestAnimationFrame(draw);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(draw);
