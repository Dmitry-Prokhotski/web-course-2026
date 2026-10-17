export class GameRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.COLORS = {
            sky:        '#5c94fc',   
            skyDarker:  '#4a7fd4',  
            brick:      '#c84c0c',   
            brickDark:  '#8b2f00',   
            mortar:     '#000000', 
            snakeHead:  '#00b800', 
            snakeBody:  '#008000',
            snakeDark:  '#004000',
            apple:      '#ffde00',
            appleDark:  '#8b6f00',
            cloud:      '#ffffff'
        };

        this.ctx.imageSmoothingEnabled = false;
    }

    clear() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, this.COLORS.sky);
        gradient.addColorStop(1, this.COLORS.skyDarker);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawPixelCloud(50, 40);
        this.drawPixelCloud(280, 80);
        this.drawPixelCloud(180, 25);
    }

    drawPixelCloud(x, y) {
        const p = 6; 
        this.ctx.fillStyle = this.COLORS.cloud;
        this.ctx.fillRect(x, y + p, p * 3, p);       
        this.ctx.fillRect(x + p, y, p * 2, p);  
        this.ctx.fillRect(x - p, y + p, p, p); 
        this.ctx.fillRect(x + p * 3, y + p, p, p);  
        this.ctx.fillRect(x, y + p * 2, p * 3, p);
    }

    draw(game) {
        this.clear();
        this.drawApple(game.getApple(), game.getCellSize());
        this.drawSnake(game.getSnake(), game.getCellSize());
    }

    drawSnake(snake, cellSize) {
        snake.forEach((segment, index) => {
            const x = segment.x * cellSize;
            const y = segment.y * cellSize;
            const isHead = index === 0;

            this.ctx.fillStyle = isHead ? this.COLORS.snakeHead : this.COLORS.snakeBody;
            this.ctx.fillRect(x, y, cellSize, cellSize);

            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            this.ctx.fillRect(x + 2, y + 2, 3, cellSize - 4);

            this.ctx.strokeStyle = this.COLORS.snakeDark;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

            if (isHead) {
                this.drawEyes(x, y, cellSize);
            }
        });
    }

    drawEyes(x, y, cellSize) {
        const eyeSize = 4;
        const padding = 4;

        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(x + padding, y + padding, eyeSize, eyeSize);
        this.ctx.fillRect(x + cellSize - padding - eyeSize, y + padding, eyeSize, eyeSize);

        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(x + padding + 1, y + padding + 1, 2, 2);
        this.ctx.fillRect(x + cellSize - padding - eyeSize + 1, y + padding + 1, 2, 2);
    }

    drawApple(apple, cellSize) {
        const x = apple.x * cellSize;
        const y = apple.y * cellSize;
        const cx = x + cellSize / 2;
        const cy = y + cellSize / 2;
        const r = cellSize * 0.4;

        this.ctx.fillStyle = this.COLORS.apple;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = this.COLORS.appleDark;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.fillStyle = this.COLORS.appleDark;
        this.ctx.fillRect(cx - 3, cy - 5, 6, 10);

        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(cx - r + 3, cy - r + 3, 3, 3);
    }
}