import { Application, Container, Texture, Graphics } from "pixi.js";
import { Grid } from "../entities/Grid";
import { Snake } from "../entities/Snake";
import { Direction, SCREEN_WIDTH, TICK_INTERVAL, UI_HEIGHT } from "../constants";
import { Food } from "../entities/Food";
import { ScoreDisplay } from "../ui/ScoreDisplay";
import { GameOverScreen } from "../ui/GameOverScreen";
import { SoundManager } from "../audio/SoundManager";
import { MuteButton } from "../ui/MuteButton";

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
    private uiLayer: Container;

    private grid: Grid;
    private snake: Snake;
    private food: Food;
    private scoreDisplay: ScoreDisplay;
    private sound: SoundManager;
    private muteButton: MuteButton;

    // Лічильник часу — накопичуємо deltaMS і рухаємо змійку
    // тільки коли накопичилось більше TICK_INTERVAL
    private tickTimer: number = 0;
    private score: number = 0;

    constructor(app: Application, appleTexture: Texture, onRestart: () => void) {
        super(); // обов'язково — ініціалізує Container

        this.app = app;
        this.onRestartCallback = onRestart;

        // Створюємо gameLayer — всі ігрові об'єкти підуть в нього
        // Не напряму в stage — щоб легше керувати шарами
        this.gameLayer = new Container();
        this.uiLayer = new Container();

        this.addChild(this.gameLayer);
        this.addChild(this.uiLayer);

        this.grid = new Grid();
        this.snake = new Snake();
        this.food = new Food(appleTexture);
        this.sound = new SoundManager();

        // Зсуваємо весь ігровий шар вниз — звільняємо місце для панелі
        this.gameLayer.y = UI_HEIGHT;


        // Grid першим — малюється під змійкою
        this.gameLayer.addChild(this.grid);
        this.gameLayer.addChild(this.snake);
        this.gameLayer.addChild(this.food);

        // Score — лівий край панелі, вертикально по центру
        this.scoreDisplay = new ScoreDisplay();
        this.scoreDisplay.x = 10;
        this.scoreDisplay.y = UI_HEIGHT / 2 - 8; // центруємо по висоті панелі
        this.uiLayer.addChild(this.scoreDisplay);

        // MuteButton — правий верхній кут
        // SCREEN_WIDTH - 46 = 400 - 46 = 354px від лівого краю
        this.muteButton = new MuteButton(() => this.sound.toggleMute());
        this.muteButton.x = SCREEN_WIDTH - 46;
        this.muteButton.y = UI_HEIGHT / 2 - 18
        this.uiLayer.addChild(this.muteButton);

        // Тонка лінія між панеллю і полем гри
        const divider = new Graphics();
        divider.rect(0, UI_HEIGHT - 1, SCREEN_WIDTH, 1);
        divider.fill({ color: 0xffffff, alpha: 0.5 });
        this.uiLayer.addChild(divider);

        this.food.spawn(this.snake.getSegments());

        this.app.ticker.add(this.update, this);
        window.addEventListener('keydown', this.onKeyDown);

        this.sound.startGameLoop();
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
        if (this.snake.isOutOfBounds() || this.snake.isSelfCollision()) {
            this.onGameOver();
            return;
        }

        // Порівнюємо позицію голови з позицією їжі
        const head = this.snake.getHeadPosition();
        const food = this.food.getPosition();

        if (head.col === food.col && head.row === food.row) {
            // +1 очок за кожну з'їдену їжу
            this.score += 1;

            // Передаємо новий рахунок у ScoreDisplay — він оновить текст
            this.scoreDisplay.setScore(this.score);

            // Змійка з'їла їжу — ростемо і спавнимо нову їжу
            this.snake.grow();

            // Передаємо оновлені сегменти — змійка вже більша
            this.food.spawn(this.snake.getSegments());

            // Звук з'їдання — після grow() і spawn()
            this.sound.playEat();

            console.log('Eaten! Snake length:', this.snake.getSegments().length);
        }
    };

    private onGameOver(): void {
        // Зупиняємо ticker і клавіатуру — гра заморожується
        this.app.ticker.remove(this.update, this)
        window.removeEventListener('keydown', this.onKeyDown);

        // Зупиняємо gameLoop перед звуком смерті
        this.sound.stopGameLoop();
        this.sound.playDeath();

        // GameOverScreen додаємо в uiLayer — поверх замороженої гри
        // Передаємо рахунок і onRestart як колбек
        const screen = new GameOverScreen(this.score, this.onRestart);
        this.uiLayer.addChild(screen);
    }

    // При рестарті знищуємо себе і викликаємо startGame() з main.ts
    // main.ts створить свіжу GameScene — чистіше ніж скидати стан вручну
    private onRestart = (): void => {
        this.sound.stopAll(); // зупиняємо всі звуки перед рестартом
        this.destroy();
        this.onRestartCallback();
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
        this.app.ticker.remove(this.update, this);
        window.removeEventListener('keydown', this.onKeyDown);
        super.destroy();
    }
}