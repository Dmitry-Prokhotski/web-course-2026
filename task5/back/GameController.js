export class GameController {
    constructor(game, ui) {
        this.game = game;
        this.ui = ui;

        // Подписываемся на события UI
        this.ui.onStartClick(() => this.handleStart());
        this.ui.onButtonClick((index) => this.handlePlayerClick(index));
    }

    handleStart() {
        this.game.start();
        this.ui.updateLevel(0);
        this.ui.showMessage('СМОТРИ ВНИМАТЕЛЬНО...', '#00ffff');
        this.runRound();
    }

    async runRound() {
        if (!this.game.isPlaying) return;

        this.ui.blockBoard();
        this.game.isShowing = true;
        this.game.isWaiting = false;

        const level = this.game.nextRound();
        this.ui.updateLevel(level);
        this.ui.showMessage('СМОТРИ ВНИМАТЕЛЬНО...', '#ffee00');

        await this.ui.showSequence(this.game.getSequence());

        if (!this.game.isPlaying) return;

        this.game.isShowing = false;
        this.game.isWaiting = true;
        this.ui.showMessage('ТВОЙ ХОД!', '#00ff88');
        this.ui.unblockBoard();
    }

    async handlePlayerClick(index) {
        if (!this.game.isWaiting || this.game.isShowing || !this.game.isPlaying) {
            return;
        }

        this.ui.flashButton(index);

        const status = this.game.checkPlayerMove(index);

        if (status === 'wrong') {
            this.handleGameOver();
            return;
        }

        if (status === 'round_complete') {
            this.game.isWaiting = false;
            await this.ui.delay(900);
            this.runRound();
        }
    }

    handleGameOver() {
        this.game.end();
        this.ui.blockBoard();
        this.ui.showMessage(
            `ИГРА ОКОНЧЕНА — УРОВЕНЬ ${this.game.getLevel()}`,
            '#ff0055'
        );
    }
}