import { Application, Container } from "pixi.js";

export class GameScene extends Container {
    // Зберігаємо app щоб мати доступ до ticker і розміру екрану
    // private — нікому зовні не потрібен
    private app: Application;

    // onRestartCallback — функція з main.ts яку викличемо при рестарті
    // Передаємо через конструктор щоб GameScene не залежав від main.ts напряму
    private onRestartCallback: () => void;

    constructor(app: Application, onRestart: () => void) {
        super(); // обов'язково — ініціалізує Container

        this.app = app;
        this.onRestartCallback = onRestart;

        console.log('GameScene created!');
        console.log('Screen size:', app.screen.width, 'x', app.screen.height);
    }

    // destroy() — викликається коли сцена знищується
    // Важливо прибрати всі підписки щоб не було memory leak
    destroy(): void {
        console.log('GameScene destroyed!');
        super.destroy(); // обов'язково — PixiJS прибирає дочірні об'єкт
    }
}