import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { SCREEN_WIDTH, SCREEN_HEIGHT, UI_HEIGHT } from "../constants";

export class MenuScene extends Container {
    constructor(onStart: () => void) {
        super();

        // Темний фон
        const bg = new Graphics();
        bg.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT + UI_HEIGHT);
        bg.fill({ color: 0x1a1a2e });
        this.addChild(bg);

        // Назва гри
        const titleStyle = new TextStyle({
            fontFamily: 'monospace',
            fontSize: 42,
            fill: 0x44ff88,
            fontWeight: 'bold'
        });

        const title = new Text({
            text: 'SNAKE',
            style: titleStyle,
        });

        title.anchor.set(0.5);
        title.x = SCREEN_WIDTH / 2;
        title.y = SCREEN_HEIGHT / 2 - 80;
        this.addChild(title);

        // Рекорд з localStorage
        const bestScore = localStorage.getItem('snake-best-score') ?? '0';
        const bestStyle = new TextStyle({
            fontFamily: 'monospace',
            fontSize: 16,
            fill: 0xaaaaaa
        });

        const best = new Text({
            text: `BEST SCORE: ${bestScore}`,
            style: bestStyle
        });

        best.anchor.set(0.5);
        best.x = SCREEN_WIDTH / 2;
        best.y = SCREEN_HEIGHT / 2 - 20;
        this.addChild(best);

        // Кнопка PLAY — інтерактивний контейнер
        const playBtn = new Container();
        playBtn.eventMode = 'static';
        playBtn.cursor = 'pointer';

        // Фон кнопки
        const btnBg = new Graphics();
        btnBg.roundRect(0, 0, 160, 50, 10);
        btnBg.fill({ color: 0x44ff88, alpha: 0.2 });
        btnBg.stroke({ width: 1, color: 0x44ff88 });
        playBtn.addChild(btnBg);

        // Текст кнопки
        const btnStyle = new TextStyle({
            fontFamily: 'monospace',
            fontSize: 22,
            fill: 0x44ff88,
            fontWeight: 'bold'
        });

        const btnText = new Text({
            text: 'PLAY',
            style: btnStyle,
        });

        btnText.anchor.set(0.5);
        btnText.x = 80;
        btnText.y = 25;
        playBtn.addChild(btnText);

        // Центруємо кнопку
        playBtn.x = SCREEN_WIDTH / 2 - 80;
        playBtn.y = SCREEN_HEIGHT / 2 + 30;
        this.addChild(playBtn);

        // Hover ефект — кнопка світлішає при наведенні
        playBtn.on('pointerover', () => {
            btnBg.clear();
            btnBg.roundRect(0, 0, 160, 50, 10);
            btnBg.fill({ color: 0x44ff88, alpha: 0.4 });
            btnBg.stroke({ width: 1, color: 0x44ff88 });
        });

        playBtn.on('pointerout', () => {
            btnBg.clear();
            btnBg.roundRect(0, 0, 160, 50, 10);
            btnBg.fill({ color: 0x44ff88, alpha: 0.2 });
            btnBg.stroke({ width: 1, color: 0x44ff88 })
        });

        // Клік — запускаємо гру
        playBtn.on('pointerdown', () => onStart());

        // Підказка клавіатури
        const hintStyle = new TextStyle({
            fontFamily: 'monospace',
            fontSize: 13,
            fill: 0x555577
        });

        const hint = new Text({
            text: 'OR PRESS SPACE',
            style: hintStyle
        });

        hint.anchor.set(0.5);
        hint.x = SCREEN_WIDTH / 2;
        hint.y = SCREEN_HEIGHT / 2 + 100;
        this.addChild(hint);

        // Пробіл теж запускає гру
        const onKey = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                window.removeEventListener('keydown', onKey);
                onStart();
            }
        };

        window.addEventListener('keydown', onKey);


        const gamepadHintStyle = new TextStyle({
            fontFamily: 'monospace',
            fontSize: 16,
            fill: 0x555577
        });

        const gamepadHint = new Text({
            text: 'GAMEPAD SUPPORTED',
            style: gamepadHintStyle
        });

        gamepadHint.anchor.set(0.5);
        gamepadHint.x = SCREEN_WIDTH / 2;
        gamepadHint.y = SCREEN_HEIGHT / 2 + 120;
        this.addChild(gamepadHint);
    }
}