import { Application, Container } from "pixi.js";
import { Grid } from "../entities/Grid";

export class GameScene extends Container {
    // Зберігаємо app щоб мати доступ до ticker і розміру екрану
    // private — нікому зовні не потрібен
    private app: Application;

    // onRestartCallback — функція з main.ts яку викличемо при рестарті
    // Передаємо через конструктор щоб GameScene не залежав від main.ts напряму
    private onRestartCallback: () => void;

    // Шари — gameLayer для гри, uiLayer для тексту поверх
    // Додаємо поки тільки gameLayer — uiLayer прийде з ScoreDisplay
    private gameLayer: Container;
    private grid: Grid;

    constructor(app: Application, onRestart: () => void) {
        super(); // обов'язково — ініціалізує Container

        this.app = app;
        this.onRestartCallback = onRestart;

        // Створюємо gameLayer — всі ігрові об'єкти підуть в нього
        // Не напряму в stage — щоб легше керувати шарами
        this.gameLayer = new Container();
        this.addChild(this.gameLayer);

        // Grid додаємо першим — він малюється під всіма іншими об'єктами
        this.grid = new Grid();
        this.gameLayer.addChild(this.grid);

        console.log('GameScene ready — grid visible!');
    }

    // destroy() — викликається коли сцена знищується
    // Важливо прибрати всі підписки щоб не було memory leak
    destroy(): void {
        super.destroy(); // обов'язково — PixiJS прибирає дочірні об'єкт
    }
}