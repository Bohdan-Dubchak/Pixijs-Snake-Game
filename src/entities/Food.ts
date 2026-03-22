import { Container, Sprite, Texture } from "pixi.js";
import { GRID_HEIGHT, GRID_WIDTH, GRID_SIZE } from "../constants";
import { Grid } from "./Grid";

interface Cell {
    col: number,
    row: number
};

export class Food extends Container {
    private col: number = 0;
    private row: number = 0;
    private view: Sprite;

    // Приймаємо текстуру через конструктор —
    // Food не знає звідки вона, просто використовує
    constructor(appleTexture: Texture) {
        super();

        this.view = new Sprite(appleTexture);
        // Масштабуємо під розмір клітинки
        this.view.width = GRID_SIZE;
        this.view.height = GRID_SIZE;

        this.addChild(this.view);
    }

    // Головний метод — знаходимо всі вільні клітинки
    // і спавнимось на випадковій з них
    // occupied — масив клітинок зайнятих змійкою
    spawn(occupied: Cell[]): void {
        const free: Cell[] = [];

        // Перебираємо всі клітинки поля
        for (let col = 0; col < GRID_WIDTH; col++) {
            for (let row = 0; row < GRID_HEIGHT; row++) {

                // Перевіряємо чи не зайнята ця клітинка змійкою
                const isTaken = occupied.some(c => c.col === col && c.row === row);

                // Якщо вільна — додаємо в список
                if (!isTaken) free.push({ col, row });
            }
        }

        // Якщо вільних немає — гравець заповнив все поле, переміг
        if (free.length === 0) return;

        // Випадкова вільна клітинка
        const cell = free[Math.floor(Math.random() * free.length)];
        this.col = cell.col;
        this.row = cell.row;

        // Переміщаємо Graphics на нову позицію
        const { x, y } = Grid.cellToPixel(this.col, this.row);
        this.view.x = x;
        this.view.y = y;
    }

    // Повертає поточну позицію — GameScene порівнює з головою змійки
    getPosition(): Cell {
        return { col: this.col, row: this.row };
    }
}