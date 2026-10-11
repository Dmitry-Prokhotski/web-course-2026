/**
 * SnakeGame — модель игры «Змейка».
 * Хранит состояние и правила. Не знает про Canvas и DOM.
 */
export class SnakeGame {
    constructor(config = {}) {
        // --- Настройки поля ---
        this.cellSize = config.cellSize ?? 20;      // px, размер клетки
        this.cols = config.cols ?? 20;              // клеток по X
        this.rows = config.rows ?? 20;              // клеток по Y
        this.moveInterval = config.moveInterval ?? 150; // мс между ходами

        // --- Состояние игры (создаётся в start()) ---
        this.snake = [];
        this.direction = { x: 1, y: 0 };   // начальное движение — вправо
        this.nextDirection = { x: 1, y: 0 }; // буфер для нажатий клавиш
        this.apple = { x: 0, y: 0 };
        this.score = 0;
        this.gameOver = false;
        this.isPaused = false;
    }

    // --- Инициализация новой игры ---
    start() {
        // Змейка из 3 сегментов в центре, движется вправо
        const centerY = Math.floor(this.rows / 2);
        this.snake = [
            { x: 3, y: centerY },  // голова
            { x: 2, y: centerY },
            { x: 1, y: centerY }   // хвост
        ];

        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.score = 0;
        this.gameOver = false;
        this.isPaused = false;

        this.spawnApple();
    }

    // --- Изменение направления (с защитой от 180°) ---
    setDirection(newDir) {
        // Нельзя разворачиваться на 180° относительно ТЕКУЩЕГО направления
        const isOpposite =
            this.direction.x + newDir.x === 0 &&
            this.direction.y + newDir.y === 0;

        if (isOpposite) return; // игнорируем

        // Также нельзя менять направление на уже "запланированное"
        // (защита от двойного быстрого нажатия: ↑ затем ←, когда едем вправо)
        const isSameAsNext =
            this.nextDirection.x === newDir.x &&
            this.nextDirection.y === newDir.y;

        if (isSameAsNext) return;

        this.nextDirection = newDir;
    }

    // --- Один шаг змейки (вызывается по таймеру) ---
    moveSnake() {
        if (this.gameOver) return;

        // Применяем буферизованное направление
        this.direction = { ...this.nextDirection };

        // Новая голова = текущая голова + направление
        const head = this.snake[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };

        // --- Проверка столкновения со стеной ---
        if (
            newHead.x < 0 || newHead.x >= this.cols ||
            newHead.y < 0 || newHead.y >= this.rows
        ) {
            this.gameOver = true;
            return;
        }

        // --- Проверка столкновения с собственным телом ---
        // Проверяем все сегменты, кроме последнего (хвоста),
        // потому что хвост сдвинется в этом же ходу
        for (let i = 0; i < this.snake.length - 1; i++) {
            if (this.snake[i].x === newHead.x && this.snake[i].y === newHead.y) {
                this.gameOver = true;
                return;
            }
        }

        // --- Двигаем змейку: добавляем голову в начало ---
        this.snake.unshift(newHead);

        // --- Проверяем, съела ли змейка яблоко ---
        if (newHead.x === this.apple.x && newHead.y === this.apple.y) {
            // Съели: НЕ удаляем хвост (змея растёт), увеличиваем счёт
            this.score++;
            this.spawnApple();
        } else {
            // Не съели: удаляем хвост (длина сохраняется)
            this.snake.pop();
        }
    }

    // --- Спавн яблока на случайной свободной клетке ---
    spawnApple() {
        const freeCells = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const occupied = this.snake.some(s => s.x === x && s.y === y);
                if (!occupied) freeCells.push({ x, y });
            }
        }

        if (freeCells.length === 0) {
            // Победа! Змейка заняла всё поле — редкий случай
            this.gameOver = true;
            return;
        }

        const randomIndex = Math.floor(Math.random() * freeCells.length);
        this.apple = freeCells[randomIndex];
    }

    // --- Геттеры ---
    getScore()     { return this.score; }
    getSnake()     { return this.snake; }
    getApple()     { return this.apple; }
    isGameOver()   { return this.gameOver; }
    getCols()      { return this.cols; }
    getRows()      { return this.rows; }
    getCellSize()  { return this.cellSize; }
    getMoveInterval() { return this.moveInterval; }
}