// SoundManager.ts
// Відповідальність: завантажити звуки і надати простий API для їх відтворення
// Інші класи не знають звідки звуки — просто викликають playEat(), playTick() і т.д.

import { sound } from "@pixi/sound";

export class SoundManager {
    // loaded — флаг щоб не завантажувати звуки двічі
    private loaded: boolean = false;

    // Зберігаємо стан — увімкнено чи вимкнено
    private muted: boolean = false;

    constructor() {
        this.loadSounds();
    }

    private loadSounds(): void {
        // Додаємо всі звуки одразу — sound.add() не завантажує файл одразу,
        // тільки реєструє його під іменем
        if (!sound.exists('eat')) {
            sound.add('eat', { url: '/sounds/eat.mp3' });
        }

        if (!sound.exists('gameLoop')) {
            sound.add('gameLoop', { url: '/sounds/gameLoop.wav' });
        }

        if (!sound.exists('death')) {
            sound.add('death', { url: 'sounds/game-over.mp3' });
        }

        // preload: true — завантажуємо одразу при старті гри
        // щоб не було затримки при першому відтворенні
        this.loaded = true;
    }
    // Викликається ОДИН РАЗ при старті гри — не кожен тік
    // loop: true — звук грає нескінченно поки не зупинимо
    startGameLoop(): void {
        if (!this.loaded || this.muted) return;
        // Зупиняємо перед запуском — щоб не накладалос
        sound.stop('gameLoop');
        sound.play('gameLoop', { volume: 0.3, loop: true });
    }

    // Зупиняємо тільки gameLoop — не всі звуки
    stopGameLoop(): void {
        sound.stop('gameLoop');
    }

    // Звук з'їдання їжі
    playEat(): void {
        if (!this.loaded || this.muted) return;

        // volume — гучність від 0 до 1
        sound.play('eat', { volume: 0.6 });
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

    // Перемикаємо стан і повертаємо новий —
    // MuteButton використає його щоб оновити іконку
    toggleMute(): boolean {
        this.muted = !this.muted;

        if (this.muted) {
            // Вимикаємо — зупиняємо все що грає
            sound.stopAll();
        } else {
            // Вмикаємо — відновлюємо тільки gameLoop
            this.startGameLoop();
        }
        return this.muted;
    }

    isMuted(): boolean {
        return this.muted;
    }

    // Ставимо музику на паузу — не зупиняємо, щоб продовжити з того місця
    pauseGameLoop(): void {
        sound.pause('gameLoop');
    };

    // Відновлюємо музику з того місця де зупинились
    resumeGameLoop(): void {
        if (!this.muted) {
            sound.remove('gameLoop')
        }
    }
}