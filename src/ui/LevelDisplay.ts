import { Container, Text, TextStyle } from "pixi.js";

export class LevelDisplay extends Container {
    private levelText: Text;

    constructor() {
        super();

        const style = new TextStyle({
            fontFamily: 'monospace',
            fontSize: 16,
            fill: 0xffffff,
            fontWeight: 'bold'
        });

        this.levelText = new Text({
            text: 'LVL: 1',
            style
        });

        this.addChild(this.levelText);
    }

    setLevel(level: number): void {
        this.levelText.text = `LVL: ${level}`
    }
}