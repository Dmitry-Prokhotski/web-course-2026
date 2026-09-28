// --- Состояние приложения ---
let secretNumber = [];      
let attempts = 0;           
let history = [];           
let isGameOver = false;     

// --- DOM элементы ---
const guessInput = document.getElementById('guessInput');
const checkBtn = document.getElementById('checkBtn');
const newGameBtn = document.getElementById('newGameBtn');
const messageEl = document.getElementById('message');
const attemptsEl = document.getElementById('attemptsCount');
const historyList = document.getElementById('historyList');

// --- Функции логики ---

function generateSecretNumber() {
    const digits = [];
    while (digits.length < 4) {
        const randomDigit = Math.floor(Math.random() * 10);
        if (!digits.includes(randomDigit)) {
            digits.push(randomDigit);
        }
    }
    return digits;
}

function validateInput(inputValue) {
    if (inputValue.length !== 4) {
        return { isValid: false, error: 'Введите ровно 4 цифры.' };
    }
    if (!/^\d+$/.test(inputValue)) {
        return { isValid: false, error: 'Можно вводить только цифры.' };
    }
    const digits = inputValue.split('').map(Number);
    const uniqueDigits = new Set(digits);
    if (uniqueDigits.size !== 4) {
        return { isValid: false, error: 'Цифры не должны повторяться.' };
    }
    return { isValid: true, error: '', digits: digits };
}

function calculateBullsAndCows(secret, guess) {
    let bulls = 0;
    let cows = 0;

    for (let i = 0; i < 4; i++) {
        if (guess[i] === secret[i]) {
            bulls++;
        } else if (secret.includes(guess[i])) {
            cows++;
        }
    }
    return { bulls, cows };
}

function renderHistory() {
    historyList.innerHTML = ''; 
    history.forEach(record => {
        const li = document.createElement('li');
        // Немного улучшил вывод, чтобы было красивее
        li.innerHTML = `<span><strong>${record.guessStr}</strong></span> 
                        <span>🐂 ${record.bulls} | 🐄 ${record.cows}</span>`;
        historyList.appendChild(li);
    });
}

function handleWin() {
    isGameOver = true;
    guessInput.disabled = true;
    checkBtn.disabled = true;
    messageEl.textContent = `Победа! Угадано за ${attempts} попыток!`;
    messageEl.className = 'message success';
}

function startNewGame() {
    secretNumber = generateSecretNumber();
    attempts = 0;
    history = [];
    isGameOver = false;

    attemptsEl.textContent = attempts;
    guessInput.value = '';
    guessInput.disabled = false;
    checkBtn.disabled = false;
    messageEl.textContent = '';
    messageEl.className = 'message';
    
    renderHistory();
    guessInput.focus();
}

function handleCheckClick() {
    if (isGameOver) return;

    const inputValue = guessInput.value.trim();
    const validation = validateInput(inputValue);

    if (!validation.isValid) {
        messageEl.textContent = validation.error;
        messageEl.className = 'message error';
        return;
    }

    messageEl.textContent = '';
    messageEl.className = 'message';

    attempts++;
    attemptsEl.textContent = attempts;

    const guessDigits = validation.digits;
    const result = calculateBullsAndCows(secretNumber, guessDigits);

    history.push({
        guessStr: inputValue,
        bulls: result.bulls,
        cows: result.cows
    });

    renderHistory();
    guessInput.value = '';
    guessInput.focus();

    if (result.bulls === 4) {
        handleWin();
    } else {
        messageEl.textContent = `Быков: ${result.bulls}, Коров: ${result.cows}`;
        messageEl.className = 'message info';
    }
}

// --- Инициализация ---
checkBtn.addEventListener('click', handleCheckClick);
newGameBtn.addEventListener('click', startNewGame);

guessInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleCheckClick();
    }
});

startNewGame();