const startBtn = document.getElementById("start-btn");
const canvas = document.getElementById("canvas");
const startScreen = document.querySelector(".start-screen");
const checkpointScreen = document.querySelector(".checkpoint-screen");
const checkpointMessage = document.querySelector(".checkpoint-screen > p");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
const gravity = 0.5;
let isCheckpointCollisionDetectionActive = true;
let gameOver = false;
let animateId;

let score = 0;
const scoreDisplay = document.createElement('div');
scoreDisplay.style.position = 'absolute';
scoreDisplay.style.top = '10px';
scoreDisplay.style.left = '10px';
scoreDisplay.style.color = '#fff';
scoreDisplay.style.fontSize = '24px';
document.body.appendChild(scoreDisplay);
const proportionalSize = (size) => {
  return innerHeight < 500 ? Math.ceil((size / 500) * innerHeight) : size;
}

class Player {
  constructor() {
    this.position = {
      x: proportionalSize(10),
      y: proportionalSize(400),
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = proportionalSize(40);
    this.height = proportionalSize(40);
  }
  draw() {
    ctx.fillStyle = "#99c9ff";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      if (this.position.y < 0) {
        this.position.y = 0;
        this.velocity.y = gravity;
      }
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }

    if (this.position.x < this.width) {
      this.position.x = this.width;
    }

    if (this.position.x >= canvas.width - this.width * 2) {
      this.position.x = canvas.width - this.width * 2;
    }
  }
}

class Platform {
  constructor(x, y) {
    this.position = {
      x,
      y,
    };
    this.width = 200;
    this.height = proportionalSize(40);
  }
  draw() {
    ctx.fillStyle = "#acd157";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class CheckPoint {
  constructor(x, y, z) {
    this.position = {
      x,
      y,
    };
    this.width = proportionalSize(40);
    this.height = proportionalSize(70);
    this.claimed = false;
  };

  draw() {
    ctx.fillStyle = "#f1be32";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  claim() {
    this.width = 0;
    this.height = 0;
    this.position.y = Infinity;
    this.claimed = true;
  }
};

const player = new Player();

const platformPositions = [
  { x: 500, y: proportionalSize(450) },  // Platform 1
  { x: 700, y: proportionalSize(400) },  // Platform 2
  { x: 850, y: proportionalSize(350) },  // Platform 3
  { x: 1400, y: proportionalSize(300) },  // Platform 4
  { x: 1800, y: proportionalSize(400) }, // Platform 5
  { x: 2100, y: proportionalSize(450) }, // Platform 6
  { x: 2900, y: proportionalSize(400) }, // Platform 7
  { x: 3350, y: proportionalSize(400) }, // Platform 8
  { x: 3900, y: proportionalSize(450) }, // Platform 9
  { x: 4200, y: proportionalSize(400) }, // Platform 10
  { x: 4400, y: proportionalSize(200) }, // Platform 11
  { x: 4700, y: proportionalSize(150) }, // Platform 12
  { x: 5200, y: proportionalSize(300) }, // Platform 13
  { x: 5500, y: proportionalSize(250) }, // Platform 14
  { x: 5800, y: proportionalSize(350) }, // Platform 15
  { x: 6000, y: proportionalSize(150) }, // Platform 16
];

const platforms = platformPositions.map(
  (platform) => new Platform(platform.x, platform.y)
);

const checkpointPositions = [
  { x: 1000, y: proportionalSize(270), z: 1 },   // Above Platform 1
  { x: 2000, y: proportionalSize(320), z: 2 },   // Above Platform 2
  { x: 2900, y: proportionalSize(300), z: 3 },   // Above Platform 3
  { x: 3500, y: proportionalSize(200), z: 4 },   // Above Platform 4
  { x: 4000, y: proportionalSize(150), z: 5 },   // Above Platform 5
  { x: 4800, y: proportionalSize(80), z: 6 },   // Above Platform 6
  { x: 5500, y: proportionalSize(150), z: 7 },   // Above Platform 7
  { x: 5700, y: proportionalSize(180), z: 8 },   // Above Platform 8
  { x: 5800, y: proportionalSize(270), z: 9 },   // Above Platform 9
  { x: 5900, y: proportionalSize(120), z: 10 },  // Above Platform 10
];

const checkpoints = checkpointPositions.map(
  (checkpoint) => new CheckPoint(checkpoint.x, checkpoint.y, checkpoint.z)
);
const animate = () => {
  if (gameOver) return;
  animateId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  platforms.forEach((platform) => platform.draw());
  checkpoints.forEach((checkpoint) => checkpoint.draw());
  player.update();
   if (keys.rightKey.pressed && player.position.x < proportionalSize(400)) {
    player.velocity.x = 5;
  } else if (keys.leftKey.pressed && player.position.x > proportionalSize(100)) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;

    if (keys.rightKey.pressed && isCheckpointCollisionDetectionActive) {
      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });

      checkpoints.forEach((checkpoint) => {
        checkpoint.position.x -= 5;
      });
    
    } else if (keys.leftKey.pressed && isCheckpointCollisionDetectionActive) {
      platforms.forEach((platform) => {
        platform.position.x += 5;
      });

      checkpoints.forEach((checkpoint) => {
        checkpoint.position.x += 5;
      });
    }
  }

  let playerCollidedWithPlatform = false; // Flag to check collision


  platforms.forEach((platform) => {
    const collisionDetectionRules = [
      player.position.y + player.height <= platform.position.y, // Above platform
      player.position.y + player.height + player.velocity.y >= platform.position.y,
      player.position.x >= platform.position.x - player.width / 2,
      player.position.x <= platform.position.x + platform.width - player.width / 3,
    ];

    if (collisionDetectionRules.every((rule) => rule)) {
      player.velocity.y = 0;
      player.position.y = platform.position.y - player.height;
      return;
    }

    const platformDetectionRules = [
      player.position.x >= platform.position.x - player.width / 2,
      player.position.x <= platform.position.x + platform.width - player.width / 3,
      player.position.y + player.height >= platform.position.y,
      player.position.y <= platform.position.y + platform.height,
    ];

    if (platformDetectionRules.every(rule => rule)) {
      stopGame("You hit the platform! Please start again.");
    }
  });

  checkpoints.forEach((checkpoint, index, checkpoints) => {
    const checkpointDetectionRules = [
      player.position.x >= checkpoint.position.x,
      player.position.y >= checkpoint.position.y,
      player.position.y + player.height <=
        checkpoint.position.y + checkpoint.height,
      isCheckpointCollisionDetectionActive,
      player.position.x - player.width <=
        checkpoint.position.x - checkpoint.width + player.width * 0.9,
      index === 0 || checkpoints[index - 1].claimed === true,
    ];

    if (checkpointDetectionRules.every((rule) => rule)) {
      checkpoint.claim();
      score += 100;
      scoreDisplay.textContent = `Score: ${score}`;

      if (index === checkpoints.length - 1) {
        isCheckpointCollisionDetectionActive = false;
        stopGame("You reached the final checkpoint!");
      } else if (player.position.x >= checkpoint.position.x &&
        player.position.x <= checkpoint.position.x + 40) {
        showCheckpointScreen("You reached a checkpoint!");
      }
    }
  });
};

const keys = {
  rightKey: { pressed: false },
  leftKey: { pressed: false }};

const movePlayer = (key, xVelocity, isPressed) => {
  if (!isCheckpointCollisionDetectionActive) {
    player.velocity.x = 0;
    player.velocity.y = 0;
    return;
  }

  switch (key) {
    case "ArrowLeft":
      keys.leftKey.pressed = isPressed;
      player.velocity.x -= xVelocity;
      break;
    case "ArrowUp":
    case " ":
    case "Spacebar":
      player.velocity.y -= 8;
      break;
    case "ArrowRight":
      keys.rightKey.pressed = isPressed;
      if (xVelocity === 0) {
        player.velocity.x = xVelocity;
      }
      player.velocity.x += xVelocity;
  }
}

// const stopGame = (msg) => {
//   gameOver = true;
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.fillStyle = "#fff";
//   ctx.font = "36px Arial";
//   ctx.fillText(msg, canvas.width / 2 - 200, canvas.height / 2);
//   cancelAnimationFrame(animateId);
// };
const stopGame = (msg) => {
  gameOver = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Display the message
  ctx.fillStyle = "#fff";
  ctx.font = "36px Arial";
  ctx.textAlign = "center";
  ctx.fillText(msg, canvas.width / 2, canvas.height / 2 - 50);

  // Display the total score
  ctx.font = "28px Arial";
  ctx.fillText(`Total Score: ${score}`, canvas.width / 2, canvas.height / 2);

  const restartBtnContainer = document.createElement('div');
  restartBtnContainer.classList.add('btn-container'); // Reuse the btn-container class

  // Create the restart button
  const restartButton = document.createElement('button');
  restartButton.textContent = "Restart";
  restartButton.classList.add('btn'); // Reuse the btn class
// Set positioning to make sure it appears correctly
restartBtnContainer.style.position = 'absolute';
 restartBtnContainer.style.top = `${canvas.height/2 + 50}px`;
 restartBtnContainer.style.left = `${canvas.width/2 - 100}px`;
 //restartBtnContainer.style.transform = 'translateX(50%)';
  // Add the restart button to the container
  restartBtnContainer.appendChild(restartButton);

  // Add the button container to the document body
  document.body.appendChild(restartBtnContainer);
  // Event listener to restart the game when the button is clicked
  // Event listener to restart the game when the button is clicked
  restartButton.addEventListener('click', () => {
    document.body.removeChild(restartBtnContainer); // Remove the button container
    window.location.reload(); // Reload the game
  });

  cancelAnimationFrame(animateId);
};

const startGame = () => {
  canvas.style.display = "block";
  startScreen.style.display = "none";
  gameOver = false;
  animate();
};

const showCheckpointScreen = (msg) => {
  checkpointScreen.style.display = "block";
  checkpointMessage.textContent = `${msg} Final Score: ${score}`;
  if (isCheckpointCollisionDetectionActive) {
    setTimeout(() => (checkpointScreen.style.display = "none"), 2000);
  }
};

startBtn.addEventListener("click", startGame);
window.addEventListener("keydown", ({ key }) => movePlayer(key, 8, true));
window.addEventListener("keyup", ({ key }) => movePlayer(key, 0, false));
