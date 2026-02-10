const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Punkte
let score = 0;

// Huhn
let chicken = {
  x: 180,
  y: 450,
  size: 30,
  step: 0
};

// Auto
let car = {
  x: -60,
  y: 250,
  width: 60,
  height: 30,
  speed: 3
};

// Münze
let coin = {
  x: Math.random() * 360,
  y: 230,
  size: 20
};

function resetGame() {
  chicken.x = 180;
  chicken.y = 450;
  car.x = -60;
  score = 0;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") chicken.y -= 20;
  if (e.key === "ArrowDown") chicken.y += 20;
  if (e.key === "ArrowLeft") chicken.x -= 20;
  if (e.key === "ArrowRight") chicken.x += 20;
});

function collisionRect(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.size > b.x &&
    a.y < b.y + b.height &&
    a.y + a.size > b.y
  );
}

function collisionCircleRect(circle, rect) {
  return (
    circle.x < rect.x + rect.width &&
    circle.x + circle.size > rect.x &&
    circle.y < rect.y + rect.height &&
    circle.y + circle.size > rect.y
  );
}

function update() {
  car.x += car.speed;
  if (car.x > canvas.width) car.x = -60;

  if (collisionRect(chicken, car)) {
    alert("Huhn getroffen!");
    resetGame();
  }

  // Huhn sammelt Münze
  if (collisionCircleRect(chicken, {
    x: coin.x,
    y: coin.y,
    width: coin.size,
    height: coin.size
  })) {
    score++;
    coin.x = Math.random() * 360;
    coin.y = 220 + Math.random() * 60;
  }

  // Ziel erreicht
  if (chicken.y < 0) {
    alert("🎉 Geschafft!");
    resetGame();
  }

  chicken.step += 0.1;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Straße
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 200, canvas.width, 100);

  // Münze
  ctx.fillStyle = "gold";
  ctx.beginPath();
  ctx.arc(
    coin.x + coin.size / 2,
    coin.y + coin.size / 2,
    coin.size / 2,
    0,
    Math.PI * 2
  );
  ctx.fill();

  
  let wobble = Math.sin(chicken.step) * 3;

  // Huhn
  ctx.fillStyle = "yellow";
  ctx.fillRect(
    chicken.x + wobble,
    chicken.y,
    chicken.size,
    chicken.size
  );

  // Auto
  ctx.fillStyle = "red";
  ctx.fillRect(car.x, car.y, car.width, car.height);

  // Punkteanzeige
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Punkte: " + score, 10, 30);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();