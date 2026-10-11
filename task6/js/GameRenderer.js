/**
 * GameRenderer — вид игры.
 * Рисует на Canvas на основе переданного состояния.
 * Не знает про правила игры.
 */
export class GameRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    // --- Полная очистка canvas ---
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // --- Главный метод: нарисовать всё состояние ---
    draw(game) {
        this.clear();

        this.drawApple(game.getApple(), game.getCellSize());
        this.drawSnake(game.getSnake(), game.getCellSize());
    }

    // --- Рисование змейки ---
    drawSnake(snake, cellSize) {
        snake.forEach((segment, index) => {
            const isHead = index === 0;
            this.drawSegment(segment, cellSize, isHead);
        });
    }

    // --- Один сегмент змейки ---
    drawSegment(segment, cellSize, isHead) {
        const x = segment.x * cellSize;
        const y = segment.y * cellSize;
        const padding = 2;

        this.ctx.save();

        if (isHead) {
            // Голова — ярче, с сильным свечением
            this.ctx.shadowColor = '#00ffff';
            this.ctx.shadowBlur = 20;
            this.ctx.fillStyle = '#00ffff';
            this.roundRect(x + padding, y + padding, cellSize - padding * 2, cellSize - padding * 2, 6);
            this.ctx.fill();

            // Глаза на голове (декоративно)
            this.drawEyes(x, y, cellSize);
        } else {
            // Тело — с градиентом от бирюзового к зелёному
            this.ctx.shadowColor = '#00ff88';
            this.ctx.shadowBlur = 12;
            this.ctx.fillStyle = '#00ff88';
            this.roundRect(x + padding, y + padding, cellSize - padding * 2, cellSize - padding * 2, 5);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    // --- Декоративные "глаза" на голове ---
    drawEyes(x, y, cellSize) {
        const eyeRadius = cellSize * 0.1;
        const offset = cellSize * 0.3;
        this.ctx.fillStyle = '#05010f';
        this.ctx.shadowBlur = 0;

        this.ctx.beginPath();
        this.ctx.arc(x + offset, y + offset, eyeRadius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(x + cellSize - offset, y + offset, eyeRadius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // --- Рисование яблока ---
    drawApple(apple, cellSize) {
        const cx = apple.x * cellSize + cellSize / 2;
        const cy = apple.y * cellSize + cellSize / 2;
        const radius = cellSize * 0.35;

        this.ctx.save();
        this.ctx.shadowColor = '#ff0055';
        this.ctx.shadowBlur = 20;
        this.ctx.fillStyle = '#ff0055';

        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Блик на яблоке
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(cx - radius * 0.3, cy - radius * 0.3, radius * 0.25, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    // --- Утилита: скруглённый прямоугольник ---
    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }
}