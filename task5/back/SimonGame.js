export class SimonGame {
    constructor() {
        this.sequence = [];
        this.playerSequence = [];
        this.level = 0;
        this.isPlaying = false;
        this.isShowing = false;
        this.isWaiting = false;
        this.colors = [0, 1, 2, 3];
    }

    start() {
        this.sequence = [];
        this.playerSequence = [];
        this.level = 0;
        this.isPlaying = true;
        this.isShowing = false;
        this.isWaiting = false;
    }

    nextRound() {
        this.level++;
        this.playerSequence = [];
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.sequence.push(randomColor);
        return this.level;
    }

    /**
     * Проверяет ход игрока.
     * @returns {'wrong' | 'continue' | 'round_complete'}
     */
    
    checkPlayerMove(index) {
        this.playerSequence.push(index);
        const currentStep = this.playerSequence.length - 1;

        if (this.playerSequence[currentStep] !== this.sequence[currentStep]) {
            return 'wrong';
        }

        if (this.playerSequence.length === this.sequence.length) {
            return 'round_complete';
        }

        return 'continue';
    }

    end() {
        this.isPlaying = false;
        this.isWaiting = false;
        this.isShowing = false;
    }

    getSequence() { return this.sequence; }
    getLevel()    { return this.level; }
}