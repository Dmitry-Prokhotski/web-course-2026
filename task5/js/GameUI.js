export class GameUI {
    constructor() {
        this.board = document.getElementById('board');
        this.btns = document.querySelectorAll('.btn');
        this.startBtn = document.getElementById('start-btn');
        this.levelDisplay = document.getElementById('level');
        this.messageDisplay = document.getElementById('message');

        this.SHOW_DELAY = 650;
        this.ACTIVE_TIME = 450;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    flashButton(index) {
        const btn = this.btns[index];
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), this.ACTIVE_TIME);
    }

    updateLevel(level) {
        this.levelDisplay.textContent = level;
    }

    showMessage(text, color = '#00ffff') {
        this.messageDisplay.textContent = text;
        this.messageDisplay.style.color = color;
        this.messageDisplay.style.textShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
    }

    blockBoard() {
        this.board.classList.add('blocked');
    }

    unblockBoard() {
        this.board.classList.remove('blocked');
    }

    async showSequence(sequence) {
        for (let i = 0; i < sequence.length; i++) {
            this.flashButton(sequence[i]);
            await this.delay(this.SHOW_DELAY);
        }
    }

    onStartClick(callback) {
        this.startBtn.addEventListener('click', callback);
    }

    onButtonClick(callback) {
        this.board.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('btn')) {
                const index = parseInt(target.dataset.id);
                callback(index);
            }
        });
    }
}