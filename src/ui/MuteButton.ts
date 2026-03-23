import { Container, Graphics, Text, TextStyle } from "pixi.js";

export class MuteButton extends Container {
    private bg: Graphics;
    private muteText: Text;

    // onToggle — колбек який викликається при кліку
    // повертає новий стан muted щоб кнопка могла оновити іконку
    constructor(onToggle: () => boolean) {
        super();

        // Фон кнопки — темний квадрат
        this.bg = new Graphics();
        this.drawBg(false); // початковий стан — не замьючено
        this.addChild(this.bg);

        // Іконка — emoji через Text
        const style = new TextStyle({
            fontFamily: 'monospace',
            fontSize: 16,
            fill: 0xffffff
        });

        this.muteText = new Text({
            text: '🔊',
            style
        });

        this.muteText.x = 8;
        this.muteText.y = 6;
        this.addChild(this.muteText);

        // Робимо кнопку інтерактивною
        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.on('pointerdown', () => {
            // Викликаємо колбек — він перемикає стан і повертає новий
            const isMuted = onToggle();
            // Оновлюємо вигляд кнопки
            this.update(isMuted);
        })
    }

    // Оновлюємо іконку і фон залежно від стану
    update(isMuted: boolean): void {
        this.muteText.text = isMuted ? '🔇' : "🔊";
        this.drawBg(isMuted);
    }

    private drawBg(isMuted: boolean): void {
        this.bg.clear();

        // Червонуватий фон коли замьючено — щоб було помітно
        const color = isMuted ? 0x4a1b0c : 0x2a2a4a;
        this.bg.roundRect(0, 0, 36, 36, 8);
        this.bg.fill({ color, alpha: 0.8 });
    }
}