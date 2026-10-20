const colorPalette = {
  LandColors: ["#7f5539", "#9e6c48", "#a67c52", "#b28c5a", "#c2a279", "#556b2f", "#6b8e23", "#8bc34a", "#9ccc65"],
  WaterColors: ["#6495ed", "#7ca9eb", "#94bcea", "#add0e8", "#c5e4e7", "#d0e0e3", "#bcd4e6", "#9ebcdb", "#81a4d0"],
  LandBall: "#3b2a1a",
  WaterBall: "#1f4e9c",
};

const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const LAND_BALL_COLOR = colorPalette.LandBall;
const WATER_BALL_COLOR = colorPalette.WaterBall;
const SQUARE_SIZE = 15;
const GRID_SIZE = 46; // squares per side
const MIN_SPEED = 5;
const MAX_SPEED = 10;

// The game runs in a fixed logical space, so a resize only changes how sharp it looks.
const WORLD_SIZE = GRID_SIZE * SQUARE_SIZE;
const CENTER = WORLD_SIZE / 2;
const RADIUS = WORLD_SIZE / 2;
const BALL_RADIUS = SQUARE_SIZE / 2;
const FRAME_MS = 1000 / 60; // speeds are in units per 60fps frame

let landScore = 0;
let waterScore = 0;
const squares = [];
const balls = [];

function isOnGlobe(i, j) {
  const cx = (i + 0.5) * SQUARE_SIZE - CENTER;
  const cy = (j + 0.5) * SQUARE_SIZE - CENTER;
  return Math.hypot(cx, cy) <= RADIUS;
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(canvas.offsetWidth * ratio);
  canvas.height = Math.round(canvas.offsetHeight * ratio);
  ctx.setTransform(canvas.width / WORLD_SIZE, 0, 0, canvas.height / WORLD_SIZE, 0, 0);
}

function initializeSquares() {
  for (let i = 0; i < GRID_SIZE; i++) {
    squares[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      const isLand = i < GRID_SIZE / 2;
      squares[i][j] = randomColor(isLand ? colorPalette.LandColors : colorPalette.WaterColors);
      if (isOnGlobe(i, j)) isLand ? landScore++ : waterScore++;
    }
  }
}

function initializeBalls() {
  // Each ball roams the other side's territory and paints it its own colour.
  balls[0] = {
    x: (WORLD_SIZE / 4) * 3,
    y: WORLD_SIZE / 2,
    dx: -8,
    dy: -8,
    paintColors: colorPalette.LandColors,
    ballColor: LAND_BALL_COLOR,
  };

  balls[1] = {
    x: WORLD_SIZE / 4,
    y: WORLD_SIZE / 2,
    dx: 8,
    dy: 8,
    paintColors: colorPalette.WaterColors,
    ballColor: WATER_BALL_COLOR,
  };
}

function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2, false);
  ctx.fillStyle = ball.ballColor;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.stroke();
}

function drawSquares() {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      ctx.fillStyle = squares[i][j];
      ctx.fillRect(i * SQUARE_SIZE, j * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    }
  }
}

function checkSquareCollision(ball) {
  let bounceX = false;
  let bounceY = false;

  // Check multiple points around the ball's circumference
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
    const checkX = ball.x + Math.cos(angle) * BALL_RADIUS;
    const checkY = ball.y + Math.sin(angle) * BALL_RADIUS;

    const i = Math.floor(checkX / SQUARE_SIZE);
    const j = Math.floor(checkY / SQUARE_SIZE);

    if (i >= 0 && i < GRID_SIZE && j >= 0 && j < GRID_SIZE && isOnGlobe(i, j)) {
      if (!ball.paintColors.includes(squares[i][j])) {
        // Square hit! Update square color and score
        squares[i][j] = randomColor(ball.paintColors);
        if (ball.paintColors === colorPalette.LandColors) {
          landScore++;
          waterScore--;
        } else {
          waterScore++;
          landScore--;
        }

        // Determine bounce direction based on the angle
        if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
          bounceX = true;
        } else {
          bounceY = true;
        }
      }
    }
  }

  // Bounce at most once per axis, so two hits in one frame do not cancel out.
  if (bounceX) ball.dx = -ball.dx;
  if (bounceY) ball.dy = -ball.dy;
}

function checkBoundaryCollision(ball) {
  // Bounce off the edge of the globe, not the corners of the canvas.
  const offsetX = ball.x - CENTER;
  const offsetY = ball.y - CENTER;
  const distance = Math.hypot(offsetX, offsetY);
  const limit = RADIUS - BALL_RADIUS;
  if (distance < limit || distance === 0) return;

  const nx = offsetX / distance;
  const ny = offsetY / distance;
  const dot = ball.dx * nx + ball.dy * ny;
  if (dot > 0) {
    ball.dx -= 2 * dot * nx;
    ball.dy -= 2 * dot * ny;
  }
  ball.x = CENTER + nx * limit;
  ball.y = CENTER + ny * limit;
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

function updateBackground() {
  if (landScore > waterScore) {
    document.body.style.background = "linear-gradient(to bottom, #8bc34a 0%, #9ccc65 100%)";
  } else if (waterScore > landScore) {
    document.body.style.background = "linear-gradient(to bottom, #6495ed 0%, #94bcea 100%)";
  } else {
    document.body.style.background = "linear-gradient(to bottom, #6f9fd6 0%, #8bc34a 100%)";
  }
}

let lastTime = null;

function draw(time) {
  // Scale movement by elapsed time so the speed is the same on 60Hz and 120Hz screens.
  // The cap keeps a long pause (a hidden tab) from launching the balls through the tiles.
  const step = lastTime === null ? 1 : Math.min((time - lastTime) / FRAME_MS, 3);
  lastTime = time;

  ctx.clearRect(0, 0, WORLD_SIZE, WORLD_SIZE);
  ctx.save();
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2);
  ctx.clip();
  drawSquares();

  // Move in sub-steps of at most one frame, so a fast ball cannot skip over a square.
  const subSteps = Math.ceil(step);
  balls.forEach((ball) => {
    drawBall(ball);
    for (let k = 0; k < subSteps; k++) {
      checkSquareCollision(ball);
      ball.x += (ball.dx * step) / subSteps;
      ball.y += (ball.dy * step) / subSteps;
      checkBoundaryCollision(ball);
    }

    addRandomness(ball);
  });
  ctx.restore();

  scoreElement.textContent = `land ${landScore} | water ${waterScore}`;
  updateBackground();

  requestAnimationFrame(draw);
}

window.addEventListener("resize", resizeCanvas);
initializeSquares();
initializeBalls();
resizeCanvas();
requestAnimationFrame(draw);
