import { Container, Graphics } from 'pixi.js';
import { GRID_SIZE, GRID_WIDTH, GRID_HEIGHT } from '../constants';

export class Grid extends Container {
    constructor() {
        super();
        this.drawGrid();
    }

    // static — викликається без створення екземпляру Grid
    // Використовують Snake і Food щоб знати де малюватись на екрані
    // Приклад: col=3, row=5 → x=60px, y=100px
    static cellToPixel(col: number, row: number): { x: number; y: number } {
        return {
            x: col * GRID_SIZE,
            y: row * GRID_SIZE
        };
    }

    private drawGrid(): void {
        const g = new Graphics();

        // Малюємо лінії через rect висотою 1px — це точно працює в будь-якій версії
        for (let col = 0; col <= GRID_WIDTH; col++) {
            g.rect(col * GRID_SIZE, 0, 1, GRID_HEIGHT * GRID_SIZE);
            g.fill({ color: 0xffffff, alpha: 0.1 });
        }

        for (let row = 0; row <= GRID_HEIGHT; row++) {
            g.rect(0, row * GRID_SIZE, GRID_WIDTH * GRID_SIZE, 1);
            g.fill({ color: 0xffffff, alpha: 0.1 });
        }

        this.addChild(g);
    }
}