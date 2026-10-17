/**
 * GameController — контроллер игры «Змейка».
 * Управляет игровым циклом и вводом с клавиатуры.
 */
export class GameController {
    constructor(game, renderer, ui) {
        this.game = game;
        this.renderer = renderer;
        this.ui = ui;

        this.lastMoveTime = 0;
        this.animationId = null;

        this.boundLoop = this.gameLoop.bind(this);
        this.boundKeyHandler = this.handleKeyDown.bind(this);
    }

    start() {
        this.game.start();
        this.ui.updateScore(this.game.getScore());
        this.ui.hideGameOver();
        this.lastMoveTime = 0;

        document.addEventListener('keydown', this.boundKeyHandler);

        this.animationId = requestAnimationFrame(this.boundLoop);
    }

    stop() {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        document.removeEventListener('keydown', this.boundKeyHandler);
    }

    gameLoop(currentTime) {
        if (this.game.isGameOver()) {
            this.renderer.draw(this.game);
            this.handleGameOver();
            return;
        }

        if (this.lastMoveTime === 0) {
            this.lastMoveTime = currentTime;
        }

        const elapsed = currentTime - this.lastMoveTime;

        if (elapsed >= this.game.getMoveInterval()) {
            this.game.moveSnake();
            this.lastMoveTime = currentTime;
            this.ui.updateScore(this.game.getScore());
        }

        this.renderer.draw(this.game);

        this.animationId = requestAnimationFrame(this.boundLoop);
    }

    handleKeyDown(event) {
        const key = event.key;
        let newDir = null;

        switch (key) {
            case 'ArrowUp':    newDir = { x: 0, y: -1 }; break;
            case 'ArrowDown':  newDir = { x: 0, y: 1 };  break;
            case 'ArrowLeft':  newDir = { x: -1, y: 0 }; break;
            case 'ArrowRight': newDir = { x: 1, y: 0 };  break;
            default: return;
        }

        event.preventDefault();

        this.game.setDirection(newDir);
    }

    handleGameOver() {
        this.stop();
        this.ui.showGameOver(this.game.getScore());
    }

    restart() {
        this.stop();
        this.start();
    }
}