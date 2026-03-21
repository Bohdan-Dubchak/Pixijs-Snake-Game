import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../constants";

export class GameOverScreen extends Container {
    constructor(score: number, onRestart: () => void) {
        super();

        // Напівпрозорий чорний фон поверх замороженої гри
        // Гравець бачить де загинув — це приємна деталь
        const overlay = new Graphics();
        overlay.rect(0, 0, SCREEN_HEIGHT, SCREEN_WIDTH);
        overlay.fill({ color: 0x000000, alpha: 0.75 });
        this.addChild(overlay);

        // GAME OVER — великий червоний заголовок
        const titleStyle = new TextStyle({
            fontFamily: 'monospace',
            fontSize: 36,
            fill: 0xff4466,
            fontWeight: 'bold'
        });

        const title = new Text({
            text: "GAME OVER",
            style: titleStyle
        })

        // anchor 0.5 — точка прив'язки по центру тексту
        // Так легше центрувати — просто ставимо x/y по центру екрану
        title.anchor.set(0.5);
        title.x = SCREEN_WIDTH / 2;
        title.y = SCREEN_HEIGHT / 2 - 50;
        this.addChild(title);

        // Фінальний рахунок
        const scoreStyle = new TextStyle({
            fontFamily: 'monospace',
            fontSize: 20,
            fill: 0xffffff
        });

        const scoreText = new Text({
            text: `SCORE: ${score}`,
            style: scoreStyle,
        });

        scoreText.anchor.set(0.5);
        scoreText.position.set(scoreText.x = SCREEN_WIDTH / 2, scoreText.y = SCREEN_HEIGHT / 2 + 10);
        this.addChild(scoreText);

        // Підказка для гравця
        const hintStyle = new TextStyle({
            fontFamily: 'monospace',
            fontSize: 14,
            fill: 0xaaaaaa
        });

        const hint = new Text({
            text: "PRESS SPACE TO RESTART",
            style: hintStyle
        });

        hint.anchor.set(0.5);
        hint.position.set(hint.x = SCREEN_WIDTH / 2, hint.y = SCREEN_HEIGHT / 2 + 60);
        this.addChild(hint);

        // Слухач пробілу — одноразовий
        // Після натиску прибираємо себе щоб не викликався повторно
        const onKey = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                window.removeEventListener('keydown', onKey);
                onRestart(); // викликаємо startGame() з main.ts
            }
        };

        window.addEventListener("keydown", onKey);
    }
}