/**
 * GameController — контроллер игры «Змейка».
 * Управляет игровым циклом и вводом с клавиатуры.
 */
export class GameController {
    constructor(game, renderer, ui) {
        this.game = game;
        this.renderer = renderer;
        this.ui = ui;

        // --- Игровой цикл ---
        this.lastMoveTime = 0;
        this.animationId = null;

        // --- Привязка колбэка к экземпляру ---
        // (чтобы можно было отписаться в stop())
        this.boundLoop = this.gameLoop.bind(this);
        this.boundKeyHandler = this.handleKeyDown.bind(this);
    }

    // --- Запуск игрового цикла и слушателей ---
    start() {
        this.game.start();
        this.ui.updateScore(this.game.getScore());
        this.ui.hideGameOver();
        this.lastMoveTime = 0;

        // Клавиатура
        document.addEventListener('keydown', this.boundKeyHandler);

        // Первый кадр
        this.animationId = requestAnimationFrame(this.boundLoop);
    }

    // --- Остановка цикла и отписка ---
    stop() {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        document.removeEventListener('keydown', this.boundKeyHandler);
    }

    // --- Главный игровой цикл ---
    gameLoop(currentTime) {
        // Если игра окончена — рисуем финальный кадр и выходим
        if (this.game.isGameOver()) {
            this.renderer.draw(this.game);
            this.handleGameOver();
            return;
        }

        // --- Расчёт времени: двигаем змейку не чаще moveInterval ---
        if (this.lastMoveTime === 0) {
            // Первый кадр — инициализируем время
            this.lastMoveTime = currentTime;
        }

        const elapsed = currentTime - this.lastMoveTime;

        if (elapsed >= this.game.getMoveInterval()) {
            // Обновляем состояние
            this.game.moveSnake();
            this.lastMoveTime = currentTime;
            this.ui.updateScore(this.game.getScore());
        }

        // --- Отрисовка каждый кадр (независимо от логики) ---
        this.renderer.draw(this.game);

        // Планируем следующий кадр
        this.animationId = requestAnimationFrame(this.boundLoop);
    }

    // --- Обработка клавиатуры ---
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

        // Предотвращаем прокрутку страницы стрелками
        event.preventDefault();

        // Передаём направление в модель
        this.game.setDirection(newDir);
    }

    // --- Обработка конца игры ---
    handleGameOver() {
        this.stop();
        this.ui.showGameOver(this.game.getScore());
    }

    // --- Перезапуск ---
    restart() {
        this.stop();
        this.start();
    }
}