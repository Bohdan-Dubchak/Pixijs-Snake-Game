import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { SCREEN_WIDTH, SCREEN_HEIGHT, UI_HEIGHT } from "../constants";

export class PauseScreen extends Container {
    constructor() {
        super();
        // Напівпрозорий фон — гра видна під ним
        const overlay = new Graphics();
        overlay.rect(0, UI_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT - UI_HEIGHT);
        overlay.fill({
            color: 0x000000,
            alpha: 0.5
        });
        this.addChild(overlay);

        // Напис PAUSED по центру
        const titleStyle = new TextStyle({
            fontFamily: 'grunge',
            fontSize: 36,
            fill: 0xffffff,
            fontWeight: 'bold'
        });

        const title = new Text({
            text: 'PAUSED',
            style: titleStyle
        });

        title.anchor.set(0.5);
        title.x = SCREEN_WIDTH / 2;
        title.y = SCREEN_HEIGHT / 2;
        this.addChild(title);

        // Підказка
        const hintStyle = new TextStyle({
            fontFamily: 'monospace',
            fontSize: 14,
            fill: 0xaaaaaa
        });

        const hint = new Text({
            text: 'PRESS P TO RESUME',
            style: hintStyle,
        });

        hint.anchor.set(0.5);
        hint.x = SCREEN_WIDTH / 2;
        hint.y = SCREEN_HEIGHT / 2 + 50;
        this.addChild(hint);
    }
}