import { SnakeGame } from './SnakeGame.js';
import { GameRenderer } from './GameRenderer.js';
import { GameController } from './GameController.js';

/**
 * Небольшой "UI"-класс для работы с HTML-элементами вокруг канваса.
 * Не путать с рендером — тот рисует на Canvas, а этот управляет DOM.
 */
class GameUI {
    constructor() {
        this.scoreDisplay = document.getElementById('score');
        this.finalScoreDisplay = document.getElementById('final-score');
        this.gameOverOverlay = document.getElementById('game-over-overlay');
        this.restartBtn = document.getElementById('restart-btn');
        this.restartOverlayBtn = document.getElementById('restart-overlay-btn');
    }

    updateScore(score) {
        this.scoreDisplay.textContent = score;
    }

    showGameOver(finalScore) {
        this.finalScoreDisplay.textContent = finalScore;
        this.gameOverOverlay.classList.remove('hidden');
    }

    hideGameOver() {
        this.gameOverOverlay.classList.add('hidden');
    }

    onRestartClick(callback) {
        this.restartBtn.addEventListener('click', callback);
        this.restartOverlayBtn.addEventListener('click', callback);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');

    const game = new SnakeGame({
        cellSize: 20,
        cols: 20,
        rows: 20,
        moveInterval: 150
    });

    const renderer = new GameRenderer(canvas);
    const ui = new GameUI();
    const controller = new GameController(game, renderer, ui);

    ui.onRestartClick(() => controller.restart());

    controller.start();
});