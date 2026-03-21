import { Container, Text, TextStyle } from "pixi.js";

export class ScoreDisplay extends Container {
    private scoreText: Text;
    private score: number = 0;

    constructor() {
        super();

        // TextStyle — описуємо як виглядає текст
        const style = new TextStyle({
            fontFamily: "monospace",
            fontSize: 16,
            fill: 0xffffff,
            fontWeight: 'bold'
        });

        this.scoreText = new Text({
            text: "SCORE: 0",
            style
        });

        // Відступ від лівого верхнього кута
        this.scoreText.x = 10;
        this.scoreText.y = 10;

        this.addChild(this.scoreText);
    }

    // Викликається з GameScene кожного разу коли змійка їсть
    setScore(score: number): void {
        this.score = score;

        // Оновлюємо текст — PixiJS автоматично перемалює
        this.scoreText.text = `SCORE: ${score}`;
    }

    getScore(): number {
        return this.score;
    }
}