import Car from "./car.js"

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let isGameOverPopupVisible = false;


// Punkte
let score = 0;

// Huhn
let chicken = {
  x: canvas.width/2,
  y: canvas.height/2,
  size: 30,
  step: 0
};

// Auto
let defaultCar = {
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
  defaultCar.x = -60;
  score = 0;
}

let popupShown = false

function handleMove(direction){
  const moves = ["Up", "Down","Left","Right"]
  const num = moves.indexOf(direction)

  switch (num){
    case 0:
      console.log("up")
      if (chicken.y - 20 > 0){
        chicken.y -= 20;
      }
      break;
    case 1:
      console.log("down")
      if (chicken.y + 20 < canvas.height){
        chicken.y += 20;
      }
      break;
    case 2:
      console.log("left")
      if (chicken.x - 20 > 0){
        chicken.x -= 20;
      }
      break;
    case 3:
      console.log("right")
      if (chicken.x + 20 < canvas.width){
        chicken.x += 20;
      }
      break;
    default:
      console.log("Not a valid move direction")
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") handleMove("Up");
  if (e.key === "ArrowDown") handleMove("Down")
  if (e.key === "ArrowLeft") handleMove("Left")
  if (e.key === "ArrowRight") handleMove("Right")
});

function collisionRect(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.size > b.x &&
    a.y < b.y + b.height &&
    a.y + a.size > b.y
  );
}

function collisionCircleRect(circle, car) {
  return (
    circle.x < car.x + car.width &&
    circle.x + circle.size > car.x &&
    circle.y < car.y + car.height &&
    circle.y + circle.size > car.y
  );
}

function showGameOverPopup() {
  popupShown = true;
  const popup = document.getElementById('GameClosedPopUp');
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
  text.textContent = "Game Over! Play again?";

  const button = document.createElement("button");
  button.textContent = "Reset Game";
  button.style.padding = "10px 20px";
  button.style.marginTop = "10px";
  button.style.cursor = "pointer";

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
  for (let car of cars){
    switch (car.direction){
      case "Up":
        car.y -= car.speed
        if (car.y < 0) car.y = canvas.height;
        break
      case "Down":
        car.y += car.speed
        if (car.y > canvas.height) car.y = canvas.height + 60;
        break
      case "Right":
        car.x += car.speed
        if (car.x > canvas.width) car.x = -60;
        break
      case "Left":
        car.x -= car.speed
        if (car.x < 0) car.x = canvas.width + 60;
        break
      default:
        break;
    }
  }
  
  defaultCar.x += defaultCar.speed;
  if (defaultCar.x > canvas.width) defaultCar.x = -60;

  if (collisionRect(chicken, defaultCar)) {
    if(isGameOverPopupVisible === false)
    {
      showGameOverPopup();
    }
  }

  for (let car of cars){
    if (collisionRect(chicken, car)) {
    if(isGameOverPopupVisible === false)
    {
      showGameOverPopup();
    }
  }
  }

 
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

  
  if (chicken.y < 0) {   

    resetGame();
  }


  chicken.step += 0.1;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // streets
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 200, canvas.width, 100); // horizont high
  ctx.fillRect(0, 800, canvas.width, 100); // horizont low
  ctx.fillRect(canvas.width/8 + 50, 0, 100, canvas.height); // vert right
  ctx.fillRect(canvas.width/2 + 50, 0, 100, canvas.height); // vert mid
  ctx.fillRect(canvas.width - canvas.width/8, 0, 100, canvas.height); // vert right

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
  for (let car of cars){
    ctx.fillStyle = "red";
    ctx.fillRect(car.x, car.y, car.width, car.height);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(defaultCar.x, defaultCar.y, defaultCar.width, defaultCar.height);

  // Punkteanzeige
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Test: " + score, 10, 30);
}

function gameLoop() {
  if (!popupShown ) {
    update();
    draw();
  }
  requestAnimationFrame(gameLoop);
}


let cars = []
let testy = 60
let testspeed = 1
for (let i = 0; i < 9; i++){
  cars.push(new Car(100, testy, "Up", testspeed))
  testspeed++
  testy += 100
}
gameLoop();