let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("../eat.mp3");
const gameOverSound = new Audio("../gameOver.mp3");
const moveSound = new Audio('../move.mp3');
const music1 = new Audio("../starboy.mp3");
const music2 = new Audio("../waka waka.mp3");
const music3 = new Audio("../night changes.mp3");
const music4 = new Audio("../blinding lights.mp3");
const music5 = new Audio("../on my way.mp3");

let speed = 8;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

let highestScoreBox = document.getElementById("highestScoreBox");
let scoreBox = document.getElementById("scoreBox");
let board = document.getElementById("board");

const musicTracks = [music1, music2, music3, music4, music5];
let currentTrackIndex = 0;

let paused = false; // Track whether the game is paused

function playNextSong() {
    musicTracks[currentTrackIndex].pause();
    musicTracks[currentTrackIndex].currentTime = 0;
    currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
    musicTracks[currentTrackIndex].play();
}

musicTracks.forEach((track, index) => {
    track.addEventListener('ended', playNextSong);
});

let highestScore = localStorage.getItem('highestScore');
let highestScoreVal = highestScore ? JSON.parse(highestScore) : 0;
highestScoreBox.innerHTML = "Highest Score: " + highestScoreVal;

function main(ctime) {
    if (paused) return; // Stop the game loop if paused
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < (1 / speed)) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // Check if the head collides with any part of the body
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    // Check if the snake hits the wall (out of bounds)
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }

    return false;
}

function gameEngine() {
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        moveSound.pause();
        inputDir = { x: 0, y: 0 };
        snakeArr = [{ x: 13, y: 15 }]; // Reset snake
        score = 0;
        scoreBox.innerHTML = "Current score : " + score;
        return;
    }

    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > highestScoreVal) {
            highestScoreVal = score;
            localStorage.setItem("highestScore", JSON.stringify(highestScoreVal));
            highestScoreBox.innerHTML = "Highest Score: " + highestScoreVal;
        }
        scoreBox.innerHTML = "Current score : " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });

        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Render the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    // Render the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

window.requestAnimationFrame(main);

let musicStarted = false; // Flag to ensure music starts only once

window.addEventListener('keydown', (e) => {
    moveSound.play();
    if (!musicStarted) {
        musicTracks[currentTrackIndex].play().catch((error) => {
            console.log("Error playing music:", error);
        });
        musicStarted = true; // Set flag to prevent repeating
    }

    if (e.key === " " || e.key === "Spacebar") { // Toggle pause on Spacebar
        paused = !paused;
        if (!paused) {
            window.requestAnimationFrame(main); // Resume game loop
        }
        return; // Don't process movement if the game is paused
    }

    if (paused) return; // Don't process movement if the game is paused

    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) {
                inputDir.x = 0;
                inputDir.y = -1;
            }
            break;
        case "ArrowDown":
            if (inputDir.y !== -1) {
                inputDir.x = 0;
                inputDir.y = 1;
            }
            break;
        case "ArrowLeft":
            if (inputDir.x !== 1) {
                inputDir.x = -1;
                inputDir.y = 0;
            }
            break;
        case "ArrowRight":
            if (inputDir.x !== -1) {
                inputDir.x = 1;
                inputDir.y = 0;
            }
            break;
        default:
            break;
    }
});
