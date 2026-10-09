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
const SHOW_DELAY = 600;
const ACTIVE_TIME = 400;

// --- АУДИО (Web Audio API) ---
// Создаем контекст один раз
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Частоты для каждого цвета (чтобы звучало приятно)
const FREQUENCIES = [261.63, 329.63, 392.00, 523.25]; // До, Ми, Соль, До (октава выше)

function playSound(index) {
    if (!audioCtx) return;
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = FREQUENCIES[index];
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // Плавное затухание, чтобы не было щелчков
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
}

// --- Вспомогательная функция задержки ---
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- Подсветка и звук ---
function flashButton(index) {
    const btn = btns[index];
    btn.classList.add('active');
    playSound(index); // Играем звук
    
    setTimeout(() => {
        btn.classList.remove('active');
    }, ACTIVE_TIME);
}

// --- Логика игры ---

function startGame() {
    initAudio(); // Инициализируем звук по клику пользователя (требование браузеров)
    
    gameState.sequence = [];
    gameState.playerSequence = [];
    gameState.level = 0;
    gameState.isPlaying = true;
    gameState.isShowing = false;
    gameState.isWaiting = false;
    
    levelDisplay.textContent = '0';
    messageDisplay.textContent = 'Игра началась!';
    messageDisplay.style.color = '#a29bfe';
    
    nextRound();
}

async function nextRound() {
    if (!gameState.isPlaying) return;

    board.classList.add('blocked');
    gameState.isShowing = true;
    gameState.isWaiting = false;

    gameState.level++;
    levelDisplay.textContent = gameState.level;

    // Добавляем новый цвет
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    gameState.sequence.push(randomColor);
    gameState.playerSequence = [];

    messageDisplay.textContent = 'Смотри внимательно...';
    messageDisplay.style.color = '#f1c40f';

    await showSequence();
    
    messageDisplay.textContent = 'Твой ход!';
    messageDisplay.style.color = '#2ecc71';
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
        await delay(1000);
        nextRound();
    }
}

function gameOver() {
    gameState.isPlaying = false;
    gameState.isWaiting = false;
    gameState.isShowing = false;
    
    board.classList.add('blocked');
    
    messageDisplay.textContent = `Игра окончена! Ваш уровень: ${gameState.level}`;
    messageDisplay.style.color = '#e74c3c';
    
    // Звук ошибки
    if (audioCtx) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    }
}

// --- Слушатели ---
startBtn.addEventListener('click', () => {
    startGame();
});

board.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('btn')) {
        const index = parseInt(target.dataset.id);
        handlePlayerClick(index);
    }
});