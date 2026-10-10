// Состояние игры
const gameState = {
    sequence: [],
    playerSequence: [],
    level: 0,
    isPlaying: false,
    isShowing: false,
    isWaiting: false
};

// DOM элементы
const board = document.getElementById('board');
const btns = document.querySelectorAll('.btn');
const startBtn = document.getElementById('start-btn');
const levelDisplay = document.getElementById('level');
const messageDisplay = document.getElementById('message');

const COLORS = [0, 1, 2, 3];
const SHOW_DELAY = 650;
const ACTIVE_TIME = 450;

// --- Задержка через Promise + setTimeout ---
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- Подсветка кнопки ---
function flashButton(index) {
    const btn = btns[index];
    btn.classList.add('active');
    setTimeout(() => {
        btn.classList.remove('active');
    }, ACTIVE_TIME);
}

// --- Логика игры ---

function startGame() {
    gameState.sequence = [];
    gameState.playerSequence = [];
    gameState.level = 0;
    gameState.isPlaying = true;
    gameState.isShowing = false;
    gameState.isWaiting = false;
    
    levelDisplay.textContent = '0';
    messageDisplay.textContent = 'WATCH...';
    messageDisplay.style.color = '#00ffff';
    
    nextRound();
}

async function nextRound() {
    if (!gameState.isPlaying) return;

    board.classList.add('blocked');
    gameState.isShowing = true;
    gameState.isWaiting = false;

    gameState.level++;
    levelDisplay.textContent = gameState.level;

    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    gameState.sequence.push(randomColor);
    gameState.playerSequence = [];

    messageDisplay.textContent = 'WATCH...';
    messageDisplay.style.color = '#ffee00';

    await showSequence();
    
    messageDisplay.textContent = 'YOUR TURN!';
    messageDisplay.style.color = '#00ff88';
    gameState.isShowing = false;
    gameState.isWaiting = true;
    board.classList.remove('blocked');
}

async function showSequence() {
    for (let i = 0; i < gameState.sequence.length; i++) {
        if (!gameState.isPlaying) return;

        const colorIndex = gameState.sequence[i];
        flashButton(colorIndex);
        
        await delay(SHOW_DELAY); 
    }
}

async function handlePlayerClick(index) {
    if (!gameState.isWaiting || gameState.isShowing || !gameState.isPlaying) {
        return;
    }

    flashButton(index);
    gameState.playerSequence.push(index);

    const currentStep = gameState.playerSequence.length - 1;
    
    if (gameState.playerSequence[currentStep] !== gameState.sequence[currentStep]) {
        gameOver();
        return;
    }

    if (gameState.playerSequence.length === gameState.sequence.length) {
        gameState.isWaiting = false;
        await delay(900);
        nextRound();
    }
}

function gameOver() {
    gameState.isPlaying = false;
    gameState.isWaiting = false;
    gameState.isShowing = false;
    
    board.classList.add('blocked');
    
    messageDisplay.textContent = `GAME OVER — LEVEL ${gameState.level}`;
    messageDisplay.style.color = '#ff0055';
    messageDisplay.style.textShadow = '0 0 10px #ff0055, 0 0 30px #ff0055, 0 0 60px #ff0055';
}

// --- Слушатели ---
startBtn.addEventListener('click', () => {
    messageDisplay.style.textShadow = '0 0 10px #00ffff, 0 0 20px #00ffff';
    startGame();
});

board.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('btn')) {
        const index = parseInt(target.dataset.id);
        handlePlayerClick(index);
    }
});