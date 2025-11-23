// game state for keyboard keys
let gameState = "idle"; // idle | playing | ended


// Sound effects being used in game
let walking = new Audio("./Walking.mp3");
let coinpick = new Audio("./Coin Pick.mp3");
let enemyContact = new Audio("./Enemy contact.mp3");
let enemyAttack = new Audio("./Enemy-attack.mp3");

let levelComplete = new Audio("./Level Completed.mp3");
let lifeloss = new Audio("./Life Loss.mp3");
let gameOver = new Audio("./Game Over.mp3");
let enemy1 = document.getElementById("enemy1");
let clft = 30;
let ctop = 15;

// Making Enemies move left to right, right to left
function enemy1move() {
  let enemy1left = setInterval(() => {
    clft += 5;
    if (clft > 300) {
      clearInterval(enemy1left);
      let enemy1right = setInterval(() => {
        clft -= 5;
        if (clft < 30) {
          clearInterval(enemy1right);
          requestAnimationFrame(enemy1move);
        }
        enemy1.style.left = `${clft}px`;
      }, 50)
    }
    enemy1.style.left = `${clft}px`;
  }, 50)
};
enemy1move();


let enemy2 = document.getElementById("enemy2");
let clft2 = 15;
let ctop2 = 115;

function enemy2move() {
  let enemy2bottom = setInterval(() => {
    ctop2 += 5;
    if (ctop2 > 380) {
      clearInterval(enemy2bottom);
      let enemy2top = setInterval(() => {
        ctop2 -= 5;
        if (ctop2 < 115) {
          clearInterval(enemy2top);
          requestAnimationFrame(enemy2move);
        }
        enemy2.style.top = `${ctop2}px`;
      }, 50)
    }
    enemy2.style.top = `${ctop2}px`;
  }, 50)
};
enemy2move();

let enemy3 = document.getElementById("enemy3");
let crt3 = 15;
let cbtm3 = 115;

function enemy3move() {
  let enemy3up = setInterval(() => {
    cbtm3 += 5;
    if (cbtm3 > 380) {
      clearInterval(enemy3up);
      let enemy3down = setInterval(() => {
        cbtm3 -= 5;
        if (cbtm3 < 115) {
          clearInterval(enemy3down);
          requestAnimationFrame(enemy3move);
        }
        enemy3.style.bottom = `${cbtm3}px`;
      }, 50)
    }
    enemy3.style.bottom = `${cbtm3}px`;
  }, 50)
};
enemy3move();


let enemy4 = document.getElementById("enemy4");
let ctop4 = 125;
let cright = 110;

function enemy4move() {
  let enemy4left = setInterval(() => {
    cright += 5;
    if (cright > 225) {
      clearInterval(enemy4left);
      let enemy4right = setInterval(() => {
        cright -= 5;
        if (cright < 110) {
          clearInterval(enemy4right);
          requestAnimationFrame(enemy4move);
        }
        enemy4.style.right = `${cright}px`;
      }, 50)
    }
    enemy4.style.right = `${cright}px`;
  }, 50)
};
enemy4move();

// Controlling player movements through buttons
let player = document.querySelector(".player");
let cx = 170;
let cy = 490;
let walls = document.querySelectorAll(".wall");

// Checking Whether Player & Enemy getting in touch
function isColliding(a, b) {
  let A = a.getBoundingClientRect();
  let B = b.getBoundingClientRect();
  return (A.right <= B.left || A.left >= B.right || A.bottom <= B.top || A.top >= B.bottom);
}

function movePlayer(dx, dy) {
  let oldX = cx,
    oldY = cy;
  cx += dx;
  cy += dy;
  if (cx > 339 || cx < 0 || cy > 500 || cy < 0) {
    cx = oldX;
    cy = oldY;
    player.style.left = cx + "px";
    player.style.top = cy + "px";
  } else {
    walking.play();
    player.style.left = cx + "px";
    player.style.top = cy + "px";
  }
  
  // Checking whether player getting in touch with walls in game
  for (let wall of walls) {
    if (!isColliding(player, wall)) {
      cx = oldX;
      cy = oldY;
      player.style.left = cx + "px";
      player.style.top = cy + "px";
    }
  }
}

// game control buttons 
document.querySelector(".up").onclick = () => movePlayer(0, -15);
document.querySelector(".down").onclick = () => movePlayer(0, 15);
document.querySelector(".left").onclick = () => movePlayer(-15, 0);
document.querySelector(".right").onclick = () => movePlayer(15, 0);


// Gold collecting logic
let golds = document.querySelectorAll(".gold");
let coins = 0
let increase_coins = true;
let lives = 3;
live(lives);
let decrease_life = true;

//Checking whether player getting in touch with any gold coin
let reset = 0;
setInterval(() => {
  let p = player.getBoundingClientRect();
  for (gold of golds) {
    let g = gold.getBoundingClientRect();
    if (p.left < g.right &&
      p.right > g.left &&
      p.top < g.bottom &&
      p.bottom > g.top) {
      coinpick.play();
      gold.style.display = "none";
      if (p.left < g.right &&
        p.right > g.left &&
        p.top < g.bottom &&
        p.bottom > g.top && increase_coins) {
        coins += 1;
        reset += 1;
        increase_coins = false;
        document.querySelector(".gold-coins").innerHTML = `👛Coins Collected :${coins}`;
        if (reset === 4) {
          levelComplete.play()
          lives += 1;
          live(lives);
          let reset_COINS = setInterval(() => {
            showgold();
            reset = 0;
          }, 300)
          setTimeout(() => {
            clearInterval(reset_COINS);
          }, 1000)
          
        }
        setTimeout(() => {
          increase_coins = true;
        }, 700)
        
      }
    }
  }
  
}, 50);

let enemies = document.querySelectorAll(".enemy");
// checking whether player is getting in touch with any enemy, if touched it will lose one life
setInterval(() => {
  let p = player.getBoundingClientRect();
  for (enemy of enemies) {
    let e = enemy.getBoundingClientRect();
    if (p.left < e.right &&
      p.right > e.left &&
      p.top < e.bottom &&
      p.bottom > e.top) {
      
      if (p.left < e.right &&
        p.right > e.left &&
        p.top < e.bottom &&
        p.bottom > e.top && decrease_life) {
        lives -= 1;
        lifeloss.play()
        live(lives);
        if (lives === 0) {
          gameState = "ended";
          gameOver.play()
          document.querySelector(".gold-coins2").innerHTML = `👛Coins Collected :${coins}`;
          document.querySelector(".gold-coins").innerHTML = `👛Coins Collected :${coins}`;
          cx = 170;
          cy = 490;
          coins = 0;
          showgold();
          lives = 3;
          player.style.top = `${cy}px`;
          player.style.left = `${cx}px`;
          document.querySelector(".btns").style.visibility = "hidden";
          
          document.querySelector(".gold-coins2").style.visibility = "visible";
          
          document.querySelector(".gold_hunter-game").style.visibility = "hidden";
          
          document.querySelector(".game-name").style.visibility = "hidden";
          document.querySelector(".gold-coins2").style.visibility = "visible";
          document.querySelector(".Start").style.visibility = "visible";
        }
        decrease_life = false;
        setTimeout(() => {
          decrease_life = true;
        }, 700)
      }
      
      
    }
  }
  
}, 50);

// Game name is being animate
setInterval(() => {
  document.querySelector(".game-name").classList.toggle("Actiiv");
}, 5000)

// gold coins beign rotate in game
setInterval(() => {
  document.querySelector(".gold").classList.toggle("rotation");
}, 2000)

function startGame() {
  gameState = "playing";
  coins = 0;
  reset = 0;
  lives = 3;
  live(lives);
  document.querySelector(".gold-coins2").innerHTML = `👛Coins Collected :${coins}`;
  document.querySelector(".gold-coins").innerHTML = `👛Coins Collected :${coins}`;
  document.querySelector(".gold-coins2").style.visibility = "hidden";
  
  document.querySelector(".btns").style.visibility = "visible";
  document.querySelector(".gold_hunter-game").style.visibility = "visible";
  document.querySelector(".game-name").style.visibility = "hidden";
  document.querySelector(".Start").style.visibility = "hidden";
}
// Game getting started when the button being clicked
document.querySelector(".Start").addEventListener("click", () => {
  startGame();
})
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && gameState === "idle" || e.key === "Enter" && gameState === "ended") {
    startGame();
  }
});
// reset the gold coins in game
function showgold() {
  document.getElementById("gold1").style.display = "block";
  document.getElementById("gold2").style.display = "block";
  document.getElementById("gold3").style.display = "block";
  document.getElementById("gold4").style.display = "block";
}

// showing lives as heart
function live(lives) {
  l = []
  for (let i = 0; i < lives; i++) {
    l.push('❤️')
  }
  
  document.querySelector(".lives").innerHTML = `${l.join("  ")}`;
}
// document.addEventListener("keydown", function(event) {
//   if (event.key === "w" || event.key === "ArrowUp") movePlayer(0, -15);
//   if (event.key === "s" || event.key === "ArrowDown") movePlayer(0, 15)
//   if (event.key === "a" || event.key === "ArrowLeft") movePlayer(-15, 0);
//   if (event.key === "d" || event.key === "ArrowRight") movePlayer(15, 0);

// });
document.addEventListener("keydown", (e) => {
  if (e.key === "w" || e.key === "ArrowUp") movePlayer(0, -15);
  if (e.key === "s" || e.key === "ArrowDown") movePlayer(0, 15)
  if (e.key === "a" || e.key === "ArrowLeft") movePlayer(-15, 0);
  if (e.key === "d" || e.key === "ArrowRight") movePlayer(15, 0);
  
}); 