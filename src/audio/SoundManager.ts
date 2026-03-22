// SoundManager.ts
// Відповідальність: завантажити звуки і надати простий API для їх відтворення
// Інші класи не знають звідки звуки — просто викликають playEat(), playTick() і т.д.

import { sound } from "@pixi/sound";

export class SoundManager {
    // loaded — флаг щоб не завантажувати звуки двічі
    private loaded: boolean = false;

    constructor() {
        this.loadSounds();
    }

    private loadSounds(): void {
        // Додаємо всі звуки одразу — sound.add() не завантажує файл одразу,
        // тільки реєструє його під іменем
        sound.add('eat', { url: '/public/sounds/eat.mp3' });
        sound.add('gameLoop', { url: '/public/sounds/gameLoop.wav' });
        sound.add('death', { url: '/public/sounds/game-over.mp3' });

        // preload: true — завантажуємо одразу при старті гри
        // щоб не було затримки при першому відтворенні
        this.loaded = true;
    }

    // Звук з'їдання їжі
    playEat(): void {
        if (!this.loaded) return;

        // volume — гучність від 0 до 1
        sound.play('eat', { volume: 0.6 });
    }

    // Тихий тік кожного кроку змійки
    playGameLoop(): void {
        if (!this.loaded) return

        // Дуже тихо — 0.3, щоб не набридало
        sound.play('gameLoop', { volume: 0.3 });
    }

    // Звук смерті
    playDeath(): void {
        if (!this.loaded) return;

        sound.play('death', { volume: 1.0 });
    }

    // Зупинити всі звуки — наприклад при game over
    stopAll(): void {
        sound.stopAll();
    }
}