import Car from "./car.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let isGameOverPopupVisible = false;

const tripMode = confirm("Enable high mode (advanced)?");
let hue = 0;

let houses = [
  { x: 450, y: canvas.height / 2 - 250, width: 400, height: 450 },
  { x: 1150, y: canvas.height / 2 - 250, width: 400, height: 450 },
];
let score = 0;

let chicken = {
  x: canvas.width / 8 - 50,
  y: canvas.height / 2 + 47.5,
  width: 100,
  height: 95,
  step: 0,
};


// Münze
let coin = {
  x: Math.random() * 360,
  y: 230,
  size: 40,
};

const horizontalLanes = [230, 830];
const verticalLanes = [
  canvas.width / 8 + 100,
  canvas.width / 2 + 100,
  canvas.width - canvas.width / 8 + 50,
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function resetGame() {
  chicken.x = canvas.width / 8 - 100;
  chicken.y = canvas.height / 2 + 95;
  score = 0;
  cars = [];
}

let popupShown = false;

function getNewCoinPos() {
  let coinPosValid = false;
  let x, y;

  while (!coinPosValid) {
    x = Math.random() * canvas.width;
    y = Math.random() * canvas.height;

    const inHorizontalLane =
      (y > 230 && y < 330 - coin.size) || (y > 830 && y < 930 - coin.size);

    const inVerticalLane =
      (x > verticalLanes[0] && x < verticalLanes[0] + 100 - coin.size) ||
      (x > verticalLanes[1] && x < verticalLanes[1] + 100 - coin.size) ||
      (x > verticalLanes[2] && x < verticalLanes[2] + 100 - coin.size);

    if (inHorizontalLane || inVerticalLane) {
      coinPosValid = true;
    }
  }

  return { x: x, y: y };
}

function handleMove(direction) {
  let newX = chicken.x;
  let newY = chicken.y;

  switch (direction) {
    case "Up":
      newY -= 20;
      break;
    case "Down":
      newY += 20;
      break;
    case "Left":
      newX -= 20;
      break;
    case "Right":
      newX += 20;
      break;
  }

  const WRAP_OFFSET = 10
  if (chicken.x + chicken.width < 0) {
  chicken.x = canvas.width - chicken.width - WRAP_OFFSET; // slightly inside right
} else if (chicken.x > canvas.width) {
  chicken.x = WRAP_OFFSET; // slightly inside left
}

// Vertical wrap
if (chicken.y + chicken.height < 0) {
  chicken.y = canvas.height - chicken.height - WRAP_OFFSET; // slightly inside bottom
} else if (chicken.y > canvas.height) {
  chicken.y = WRAP_OFFSET; // slightly inside top
}

  let hitsHouse = houses.some((house) =>
    collisionRect(
      { x: newX, y: newY, width: chicken.width, height: chicken.height },
      house,
    ),
  );

  if (!hitsHouse) {
    chicken.x = newX;
    chicken.y = newY;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") handleMove("Up");
  if (e.key === "ArrowDown") handleMove("Down");
  if (e.key === "ArrowLeft") handleMove("Left");
  if (e.key === "ArrowRight") handleMove("Right");
});

function collisionRect(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function showGameOverPopup() {
  popupShown = true;
  const popup = document.getElementById("GameClosedPopUp");
  popup.style.position = "fixed";
  popup.style.top = "0";
  popup.style.left = "0";
  popup.style.width = "100%";
  popup.style.height = "100%";
  popup.style.display = "flex";
  popup.style.justifyContent = "center";
  popup.style.alignItems = "center";

  const popupdiv = document.createElement("div");
  popupdiv.style.background = "white";
  popupdiv.style.padding = "30px";
  popupdiv.style.borderRadius = "10px";
  popupdiv.style.textAlign = "center";

  const text = document.createElement("p");
  text.textContent = `Score: ${score}  \n Game Over! Play again?`;
  text.style.fontSize = "100px";

  const button = document.createElement("button");
  button.textContent = "Reset Game";
  button.style.padding = "10px 20px";
  button.style.marginTop = "10px";
  button.style.cursor = "pointer";
  button.style.width = "400px";
  button.style.fontSize = "50px"

  button.addEventListener("click", () => {
    popup.replaceChildren();
    popup.style.display = "none";
    isGameOverPopupVisible = false;
    popupShown = false;
    resetGame();
  });

  popupdiv.appendChild(text);
  popupdiv.appendChild(button);
  popup.appendChild(popupdiv);
  isGameOverPopupVisible = true;
}

function update() {
  if (Math.random() < 0.01) {
    const speed = Math.random() * 2 + 1;

    const side = Math.floor(Math.random() * 4);

    switch (side) {
      case 0: // left → right
        spawnCar(
          "Right",
          horizontalLanes[Math.floor(Math.random() * horizontalLanes.length)],
          speed,
          60,
          30,
        );
        break;

      case 1: // right → left
        spawnCar(
          "Left",
          horizontalLanes[Math.floor(Math.random() * horizontalLanes.length)],
          speed,
          60,
          30,
        );
        break;

      case 2: // top → down
        spawnCar(
          "Down",
          verticalLanes[Math.floor(Math.random() * verticalLanes.length)],
          speed,
          60,
          30,
        );
        break;

      case 3: // bottom → up
        spawnCar(
          "Up",
          verticalLanes[Math.floor(Math.random() * verticalLanes.length)],
          speed,
          60,
          30,
        );
        break;
    }
  }

  for (let car of cars) {
    switch (car.direction) {
      case "Up":
        car.y -= car.speed;
        if (car.y < 0) car.y = canvas.height;
        break;
      case "Down":
        car.y += car.speed;
        if (car.y > canvas.height) car.y = canvas.height + 60;
        break;
      case "Right":
        car.x += car.speed;
        if (car.x > canvas.width) car.x = -60;
        break;
      case "Left":
        car.x -= car.speed;
        if (car.x < 0) car.x = canvas.width + 60;
        break;
      default:
        break;
    }
  }



  for (let car of cars) {
    if (collisionRect(chicken, car)) {
      if (isGameOverPopupVisible === false) {
        showGameOverPopup();
      }
    }
  }

  if (
    collisionRect(chicken, {
      x: coin.x,
      y: coin.y,
      width: coin.size,
      height: coin.size,
    })
  ) {
    score++;
    const newCoinPos = getNewCoinPos();
    coin.x = newCoinPos.x; //Math.random() * canvas.width;
    coin.y = newCoinPos.y; //220 + Math.random() * canvas.height;
  }

  chicken.step += 0.1;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#9DBE66";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const hous of houses) {
    ctx.drawImage(document.getElementById("house"), hous.x, hous.y, 520, 520);
  }

  ctx.fillStyle = "#333";
  ctx.fillRect(0, 200, canvas.width, 100); // horizont high
  ctx.fillRect(0, 800, canvas.width, 100); // horizont low
  ctx.fillRect(canvas.width / 8 + 50, 0, 100, canvas.height); // vert right
  ctx.fillRect(canvas.width / 2 + 50, 0, 100, canvas.height); // vert mid
  ctx.fillRect(canvas.width - canvas.width / 8, 0, 100, canvas.height); // vert right

 let trees = [
  { x: 400, y: 10, width: 200, height: 200 },
  { x: 70, y: 500, width: 200, height: 200 },
  { x: 800, y: 0, width: 200, height: 200 },
  { x: 1300, y: 10, width: 200, height: 200 },
  { x: 500, y: 900, width: 200, height: 200 },
  { x: 1300, y: 900, width: 200, height: 200 },
];

  for (const tree of trees) {
    ctx.drawImage(document.getElementById("tree"), tree.x, tree.y, 200, 200);
  }

  let wobble = Math.sin(chicken.step) * 3;

  // Huhn
  ctx.fillStyle = "yellow";
  ctx.fillRect(chicken.x + wobble, chicken.y, chicken.size, chicken.size);

  ctx.drawImage(
    document.getElementById("chicken"),
    chicken.x + wobble,
    chicken.y,
    chicken.width,
    chicken.height,
  );

  for (const tree of trees) {
    let chickenUnderTree =
        chicken.x + chicken.width > tree.x &&
        chicken.x < tree.x + tree.width &&
        chicken.y + chicken.height > tree.y &&
        chicken.y < tree.y + tree.height;

    ctx.globalAlpha = chickenUnderTree ? 0.3 : 1;
    ctx.drawImage(document.getElementById("tree"), tree.x, tree.y, tree.width, tree.height);
    ctx.globalAlpha = 1; 
}

  // Auto
  for (let car of cars) {
    let carSprite = document.getElementById(String(car.color));
    if (!carSprite) continue;

    ctx.save();

    ctx.translate(car.x + car.width / 2, car.y + car.height / 2);

    switch (car.direction) {
      case "Right":
        ctx.rotate(0);
        break;
      case "Left":
        ctx.rotate(Math.PI);
        break;
      case "Up":
        ctx.rotate(-Math.PI / 2);
        break;
      case "Down":
        ctx.rotate(Math.PI / 2);
        break;
    }

    ctx.drawImage(
      carSprite,
      -car.width / 2,
      -car.height / 2,
      car.width,
      car.height,
    );

    ctx.restore();
  }

  ctx.fillStyle = "red";


  // Münze
  ctx.fillStyle = "gold";
  ctx.beginPath();
  ctx.arc(
    coin.x + coin.size / 2,
    coin.y + coin.size / 2,
    coin.size / 2,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  ctx.drawImage(
    document.getElementById("coin"),
    coin.x,
    coin.y,
    coin.size,
    coin.size,
  );

  // Punkteanzeige
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.fillText("Score: " + score, 15, 30);

  if (tripMode) {
    ctx.filter = `hue-rotate(${hue}deg)`;
    ctx.drawImage(canvas, 0, 0);
    hue++;
    if (hue == 360) hue = 0;
  }
}

function spawnCar(direction, yOrX, speed, width, height) {
  let x, y;
  let color = getRandomInt(5);

  switch (
    direction // "goes to"
  ) {
    case "Right":
      x = -60;
      y = yOrX;
      break;

    case "Left":
      x = canvas.width + 60;
      y = yOrX;
      break;

    case "Down":
      x = yOrX;
      y = -60;
      break;

    case "Up":
      x = yOrX;
      y = canvas.height + 60;
      break;
  }

  cars.push(new Car(x, y, direction, speed, width, height, color));
}

function gameLoop() {
  if (!popupShown) {
    update();
    draw();
  }
  requestAnimationFrame(gameLoop);
}

let cars = [];
/*let testy = 60
let testspeed = 1
for (let i = 0; i < 9; i++){
  cars.push(new Car(100, testy, "Right", testspeed))
  testspeed++
  testy += 100
}*/
gameLoop();
