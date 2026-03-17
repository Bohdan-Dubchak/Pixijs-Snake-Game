import { Application } from "pixi.js";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./constants";
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

console.log('PixiJS ready!');