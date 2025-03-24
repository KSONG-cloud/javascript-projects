// import { SNAKE_SPEED } from "./snake.js"; \\ Exporting and importing makes it 
// hard to run the files.... So I'm just going to go without module this time

const SNAKE_SPEED = 5;
const snakeBody = [
    {x:11, y:11}
];

// This is set in CSS
const BOARD_WIDTH = 21;
const BOARD_LENGTH = 21;

const BOARD_TOPOLOGY = 'RP2';  // 'torus' or 'RP2
const gameBoard = document.getElementById('game-board');


let inputDirection = {x:0, y:0};
let lastInputDirection = {x:0, y:0};


let food = { x: Math.round(Math.random() * (BOARD_LENGTH - 1)) + 1,
    y:Math.round(Math.random() * (BOARD_WIDTH - 1)) + 1};

let lastRenderTime = 0;
let gameover = false;


function main(currentTime) {    
    if (gameover) {

        if (confirm("You lost. Press ok to restart.")) {
            window.location = './index.html'
        }
        return
    }   
    window.requestAnimationFrame(main);


    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;

    // Rendering of board depends on how fast we want the snake to be.
    if (secondsSinceLastRender < 1 / SNAKE_SPEED) {
        return
    }
    lastRenderTime = currentTime;

    
    update();
    draw();
    
    
}


window.requestAnimationFrame(main);


window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (lastInputDirection.y !== 0) break
            inputDirection = {x:0, y:-1}
            break
        case 'ArrowDown':
            if (lastInputDirection.y !== 0) break
            inputDirection = {x:0, y:1}
            break
        case 'ArrowRight':
            if (lastInputDirection.x !== 0) break
            inputDirection = {x:1, y:0}
            break
        case 'ArrowLeft':
            if (lastInputDirection.x !== 0) break
            inputDirection = {x:-1, y:0}
            break

    }
})


function onSnake(position, {ignoreHead = false} = {}) {
    return snakeBody.some((segment, index) => {
        if (ignoreHead && index===0) return false
        return equalPosition(segment, position);
    })

}

function snakeIntersection() {
    return onSnake(snakeBody[0], {ignoreHead: true})
}

function equalPosition(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}


function mod(n, m) {
    return ((n % m) + m) % m;
  }


function updateSnake(inputDirection) {  
    lastInputDirection = inputDirection

    // Calculate movement
    movement_in_x = snakeBody[0].x + inputDirection.x
    movement_in_y = snakeBody[0].y + inputDirection.y

    if (BOARD_TOPOLOGY === 'torus') {
        // Torus topology
        if (movement_in_x >= 22) {
            movement_in_x -= 21;
        } else if (movement_in_x <=0) {
            movement_in_x += 21
        }
        if (movement_in_y >= 22) {
            movement_in_y -= 21;
        } else if (movement_in_y <=0) {
            movement_in_y += 21
        }
    } else if (BOARD_TOPOLOGY==='RP2') {
        // RP2 Topology
        if (movement_in_x >= 22) {
            movement_in_x -= 21;
            movement_in_y = -movement_in_y + 1 + BOARD_WIDTH
        } else if (movement_in_x <=0) {
            movement_in_x += 21
            movement_in_y = -movement_in_y + 1 + BOARD_WIDTH
        }
        if (movement_in_y >= 22) {
            movement_in_y -= 21;
            movement_in_x = -movement_in_x + 1 + BOARD_LENGTH
        } else if (movement_in_y <=0) {
            movement_in_y += 21
            movement_in_x = -movement_in_x + 1 + BOARD_LENGTH
        }
    }     
    snakeBody.unshift({x: movement_in_x , y: movement_in_y  });
    console.log({x: movement_in_x , y: movement_in_y  })
    if (!onSnake(food)) {
        snakeBody.pop();
    }
    
}




// function updateSnake() {
//     for (let i = snakeBody.length - 2; i>=0 ; i--) {
//         snakeBody[i+1] = { ...snakeBody[i]};
//     }
//     snakeBody[0].x += 0;
//     snakeBody[0].y += 1;
// }


function drawSnake() {
    snakeBody.forEach(segment => {
        const snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = segment.y
        snakeElement.style.gridColumnStart = segment.x
        snakeElement.classList.add('snake')
        gameBoard.appendChild(snakeElement)
    })
}

// Check if snake is dead through intersection with itself.
function checkDeath() {
    gameover =  snakeIntersection();
}

// If food is eaten, spawn it at another random place.
function updateFood() {
    if (onSnake(food)) {
        food = { x: Math.round(Math.random() * (BOARD_LENGTH - 1)) + 1,
                 y:Math.round(Math.random() * (BOARD_WIDTH - 1)) + 1};
    }
}


function drawFood() {
    const foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('food')
    gameBoard.appendChild(foodElement)

}


function update() {
    updateSnake(inputDirection);
    updateFood();
    checkDeath();
}




function draw() {
    gameBoard.innerHTML = ''
    drawSnake();
    drawFood();
    
}