/**
 * SnakeGame — модель игры «Змейка».
 * Хранит состояние и правила. Не знает про Canvas и DOM.
 */
export class SnakeGame {
    constructor(config = {}) {
        this.cellSize = config.cellSize ?? 20;      
        this.cols = config.cols ?? 20;              
        this.rows = config.rows ?? 20;              
        this.moveInterval = config.moveInterval ?? 150; 

        this.snake = [];
        this.direction = { x: 1, y: 0 }; 
        this.nextDirection = { x: 1, y: 0 }; 
        this.apple = { x: 0, y: 0 };
        this.score = 0;
        this.gameOver = false;
        this.isPaused = false;
    }

    start() {
        const centerY = Math.floor(this.rows / 2);
        this.snake = [
            { x: 3, y: centerY },  
            { x: 2, y: centerY },
            { x: 1, y: centerY }   
        ];

        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.score = 0;
        this.gameOver = false;
        this.isPaused = false;

        this.spawnApple();
    }

    setDirection(newDir) {
        const isOpposite =
            this.direction.x + newDir.x === 0 &&
            this.direction.y + newDir.y === 0;

        if (isOpposite) return; 

        const isSameAsNext =
            this.nextDirection.x === newDir.x &&
            this.nextDirection.y === newDir.y;

        if (isSameAsNext) return;

        this.nextDirection = newDir;
    }

    moveSnake() {
        if (this.gameOver) return;

        this.direction = { ...this.nextDirection };

        const head = this.snake[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };

        if (
            newHead.x < 0 || newHead.x >= this.cols ||
            newHead.y < 0 || newHead.y >= this.rows
        ) {
            this.gameOver = true;
            return;
        }

        for (let i = 0; i < this.snake.length - 1; i++) {
            if (this.snake[i].x === newHead.x && this.snake[i].y === newHead.y) {
                this.gameOver = true;
                return;
            }
        }

        this.snake.unshift(newHead);

        if (newHead.x === this.apple.x && newHead.y === this.apple.y) {
            this.score++;
            this.spawnApple();
        } else {
            this.snake.pop();
        }
    }

    spawnApple() {
        const freeCells = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const occupied = this.snake.some(s => s.x === x && s.y === y);
                if (!occupied) freeCells.push({ x, y });
            }
        }

        if (freeCells.length === 0) {
            this.gameOver = true;
            return;
        }

        const randomIndex = Math.floor(Math.random() * freeCells.length);
        this.apple = freeCells[randomIndex];
    }

    getScore()     { return this.score; }
    getSnake()     { return this.snake; }
    getApple()     { return this.apple; }
    isGameOver()   { return this.gameOver; }
    getCols()      { return this.cols; }
    getRows()      { return this.rows; }
    getCellSize()  { return this.cellSize; }
    getMoveInterval() { return this.moveInterval; }
}