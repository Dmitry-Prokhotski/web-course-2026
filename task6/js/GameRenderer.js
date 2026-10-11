/**
 * GameRenderer — вид игры в стиле Super Mario Bros.
 * Рисует небо, кирпичную землю, зелёную змейку-«трубку» и жёлтые монетки.
 */
export class GameRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // --- Палитра Mario ---
        this.COLORS = {
            sky:        '#5c94fc',   // голубое небо
            skyDarker:  '#4a7fd4',   // чуть темнее для градиента
            brick:      '#c84c0c',   // кирпичный оранжевый
            brickDark:  '#8b2f00',   // тёмный кирпич
            mortar:     '#000000',   // чёрные швы кирпичей
            snakeHead:  '#00b800',   // ярко-зелёный (как трубка)
            snakeBody:  '#008000',   // средний зелёный
            snakeDark:  '#004000',   // тёмно-зелёный для обводки
            apple:      '#ffde00',   // жёлтый (как монетка)
            appleDark:  '#8b6f00',   // тёмная обводка монеты
            cloud:      '#ffffff'
        };

        // Отключаем сглаживание для чётких пикселей
        this.ctx.imageSmoothingEnabled = false;
    }

    // --- Очистка и отрисовка фона (небо + облака) ---
    clear() {
        // Небо — градиент от светлого к чуть тёмному
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, this.COLORS.sky);
        gradient.addColorStop(1, this.COLORS.skyDarker);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Пиксельные облака на фоне (декорация)
        this.drawPixelCloud(50, 40);
        this.drawPixelCloud(280, 80);
        this.drawPixelCloud(180, 25);
    }

    // --- Одно пиксельное облако ---
    drawPixelCloud(x, y) {
        const p = 6; // размер "пикселя" облака
        this.ctx.fillStyle = this.COLORS.cloud;
        // Форма облака из квадратиков
        this.ctx.fillRect(x, y + p, p * 3, p);       // верхняя часть
        this.ctx.fillRect(x + p, y, p * 2, p);       // пик
        this.ctx.fillRect(x - p, y + p, p, p);       // левый выступ
        this.ctx.fillRect(x + p * 3, y + p, p, p);   // правый выступ
        this.ctx.fillRect(x, y + p * 2, p * 3, p);   // низ
    }

    // --- Главный метод ---
    draw(game) {
        this.clear();
        this.drawApple(game.getApple(), game.getCellSize());
        this.drawSnake(game.getSnake(), game.getCellSize());
    }

    // --- Змейка как зелёная трубка Mario ---
    drawSnake(snake, cellSize) {
        snake.forEach((segment, index) => {
            const x = segment.x * cellSize;
            const y = segment.y * cellSize;
            const isHead = index === 0;

            // Основной блок
            this.ctx.fillStyle = isHead ? this.COLORS.snakeHead : this.COLORS.snakeBody;
            this.ctx.fillRect(x, y, cellSize, cellSize);

            // Внутренняя светлая полоса (эффект "трубы" — блик)
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            this.ctx.fillRect(x + 2, y + 2, 3, cellSize - 4);

            // Тёмная обводка вокруг — как контур в Марио
            this.ctx.strokeStyle = this.COLORS.snakeDark;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

            // Пиксельные глазки на голове
            if (isHead) {
                this.drawEyes(x, y, cellSize);
            }
        });
    }

    // --- Глаза змейки (белые с чёрными зрачками) ---
    drawEyes(x, y, cellSize) {
        const eyeSize = 4;
        const padding = 4;

        // Белки
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(x + padding, y + padding, eyeSize, eyeSize);
        this.ctx.fillRect(x + cellSize - padding - eyeSize, y + padding, eyeSize, eyeSize);

        // Зрачки
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(x + padding + 1, y + padding + 1, 2, 2);
        this.ctx.fillRect(x + cellSize - padding - eyeSize + 1, y + padding + 1, 2, 2);
    }

    // --- Яблоко как жёлтая монетка Mario ---
    drawApple(apple, cellSize) {
        const x = apple.x * cellSize;
        const y = apple.y * cellSize;
        const cx = x + cellSize / 2;
        const cy = y + cellSize / 2;
        const r = cellSize * 0.4;

        // Круг монетки (жёлтый)
        this.ctx.fillStyle = this.COLORS.apple;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        this.ctx.fill();

        // Тёмная обводка
        this.ctx.strokeStyle = this.COLORS.appleDark;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Внутренний квадрат — "отверстие" монеты (имитация рельефа)
        this.ctx.fillStyle = this.COLORS.appleDark;
        this.ctx.fillRect(cx - 3, cy - 5, 6, 10);

        // Блик сверху (светлый пиксель)
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(cx - r + 3, cy - r + 3, 3, 3);
    }
}