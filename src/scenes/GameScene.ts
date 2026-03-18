import { Application, Container } from "pixi.js";
import { Grid } from "../entities/Grid";
import { Snake } from "../entities/Snake";
import { Direction, TICK_INTERVAL } from "../constants";

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
    private snake: Snake;

    // Лічильник часу — накопичуємо deltaMS і рухаємо змійку
    // тільки коли накопичилось більше TICK_INTERVAL
    private tickTimer: number = 0;

    constructor(app: Application, onRestart: () => void) {
        super(); // обов'язково — ініціалізує Container

        this.app = app;
        this.onRestartCallback = onRestart;

        // Створюємо gameLayer — всі ігрові об'єкти підуть в нього
        // Не напряму в stage — щоб легше керувати шарами
        this.gameLayer = new Container();
        this.addChild(this.gameLayer);

        this.grid = new Grid();
        this.snake = new Snake();

        // Grid першим — малюється під змійкою
        this.gameLayer.addChild(this.grid);
        this.gameLayer.addChild(this.snake);

        // Підписуємось на ticker — update викликається щокадру
        this.app.ticker.add(this.update, this);

        // Слухаємо клавіатуру
        window.addEventListener('keydown', this.onKeyDown);
    }

    // Стрілка щоб this всередині завжди вказував на GameScene
    private update = (ticker: { deltaMS: number }): void => {
        // Накопичуємо час
        this.tickTimer += ticker.deltaMS;

        // Рухаємо змійку тільки коли пройшло TICK_INTERVAL мс
        if (this.tickTimer < TICK_INTERVAL) return;
        this.tickTimer = 0;

        this.snake.move();

        // Перевіряємо чи не вийшла за межі
        if (this.snake.isOutOfBounds()) {
            console.log('Game Over — вийшла за межі!');
            this.app.ticker.add(this.update, this);
        }
    };

    // Стрілка — щоб this працював правильно в event listener
    private onKeyDown = (e: KeyboardEvent): void => {
        const map: Record<string, Direction> = {
            ArrowUp: Direction.UP,
            ArrowDown: Direction.DOWN,
            ArrowLeft: Direction.LEFT,
            ArrowRight: Direction.RIGHT,
            KeyW: Direction.UP,
            KeyS: Direction.DOWN,
            KeyA: Direction.LEFT,
            KeyD: Direction.RIGHT,
        };

        if (map[e.code]) {
            // Забороняємо скролінг сторінки стрілками
            e.preventDefault();
            this.snake.setDirection(map[e.code]);
        }
    }

    // destroy() — викликається коли сцена знищується
    // Важливо прибрати всі підписки щоб не було memory leak
    destroy(): void {
        super.destroy(); // обов'язково — PixiJS прибирає дочірні об'єкт
    }
}