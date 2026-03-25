import { Application, Assets, Texture } from "pixi.js";
import { GameScene } from "./scenes/GameScene";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./constants";
import { MenuScene } from "./scenes/MenuScene";
import './style.css';

// Створюємо PixiJS додаток — він керує canvas і рендерером
const app = new Application();

// init() асинхронний бо PixiJS v8 спочатку ініціалізує WebGL
// antialias: false — змійці не потрібне згладжування країв,
// вимикаємо щоб рендер був швидшим
await app.init({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    background: '#1a1a2e',
    antialias: false
});

// app.canvas — звичайний HTML <canvas> елемент
// Вставляємо його в body щоб він з'явився на сторінці
document.body.appendChild(app.canvas);

// Завантажуємо тільки яблуко — одна текстура, просто і чисто
const appleTexture = await Assets.load<Texture>('/images/apple.png');

// Показуємо меню
function showMenu(): void {
    app.stage.removeChildren();
    const menu = new MenuScene(startGame);
    app.stage.addChild(menu);
}



// Виносимо в функцію — щоб викликати і при старті і при рестарті
function startGame(): void {
    // Прибираємо стару сцену зі stage якщо є
    // Це чистіше ніж скидати стан вручну всередині GameScene
    app.stage.removeChildren();

    // Створюємо нову сцену і передаємо startGame як колбек рестарт
    const scene = new GameScene(app, appleTexture, showMenu);

    // Додаємо сцену на stage — тепер вона відображається на екрані
    app.stage.addChild(scene);
}

startGame();