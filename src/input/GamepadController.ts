// GamepadController.ts
// Відповідальність: читати стан геймпада і конвертувати
// в напрямки — так само як клавіатура
// GameScene не знає звідки прийшов напрямок — з клавіатури чи геймпада

import { Direction } from "../constants";

// Стандартні індекси кнопок геймпада (Xbox/PlayStation layout)
const BUTTONS = {
    A: 0,  // A / Cross
    B: 1,  // B / Circle
    START: 9,  // Start / Options
    DPAD_UP: 12,
    DPAD_DOWN: 13,
    DPAD_LEFT: 14,
    DPAD_RIGHT: 15,
};

// Поріг чутливості стіка — ігноруємо малі відхилення
// щоб змійка не рухалась від випадкового дотику до стіка
const STICK_THRESHOLD = 0.5;

export class GamepadController {
    // Зберігаємо стан кнопок минулого кадру —
    // щоб реагувати тільки на нове натискання, не на утримання
    private prevButtons: boolean[] = [];

    // Колбеки — GameScene передає свої методи
    private onDirection: (dir: Direction) => void;
    private onPause: () => void;

    constructor(onDirection: (dir: Direction) => void, onPause: () => void) {
        this.onDirection = onDirection;
        this.onPause = onPause;
    }

    // Викликається кожен кадр з GameScene.update()
    // Gamepad API — потрібно опитувати вручну, не через події
    update(): void {
        // getGamepads() — масив підключених геймпадів
        // Беремо перший підключений
        const gamepads = navigator.getGamepads();
        const gp = gamepads[0];

        // Якщо геймпад не підключений — нічого не робимо
        if (!gp) return;

        this.readDpad(gp);
        this.readStick(gp);
        this.readButtons(gp);

        // Зберігаємо поточний стан для наступного кадру
        this.prevButtons = gp.buttons.map(b => b.pressed);
    }

    private readDpad(gp: Gamepad): void {
        // D-pad — цифрові кнопки, просто перевіряємо pressed
        if (this.isNewPress(gp, BUTTONS.DPAD_UP)) this.onDirection(Direction.UP);
        if (this.isNewPress(gp, BUTTONS.DPAD_DOWN)) this.onDirection(Direction.DOWN);
        if (this.isNewPress(gp, BUTTONS.DPAD_LEFT)) this.onDirection(Direction.LEFT);
        if (this.isNewPress(gp, BUTTONS.DPAD_RIGHT)) this.onDirection(Direction.LEFT);
    }

    private readStick(gp: Gamepad): void {
        // Лівий стік — axes[0] горизонталь, axes[1] вертикаль
        // Значення від -1 до 1
        const x = gp.axes[0];
        const y = gp.axes[1];

        // Визначаємо напрямок тільки якщо відхилення більше порогу
        // Горизонталь має пріоритет над вертикаллю якщо обидва активні
        if (Math.abs(x) > Math.abs(y)) {
            if (x < -STICK_THRESHOLD) this.onDirection(Direction.LEFT);
            if (x > STICK_THRESHOLD) this.onDirection(Direction.RIGHT);
        } else {
            if (y < -STICK_THRESHOLD) this.onDirection(Direction.UP);
            if (y > STICK_THRESHOLD) this.onDirection(Direction.DOWN);
        }
    }

    private readButtons(gp: Gamepad): void {
        // Start — пауза, тільки при новому натисканні
        if (this.isNewPress(gp, BUTTONS.START)) this.onPause();
    }

    // Повертає true тільки якщо кнопка щойно натиснута —
    // не була натиснута в минулому кадрі але натиснута зараз
    private isNewPress(gp: Gamepad, index: number): boolean {
        const current = gp.buttons[index]?.pressed ?? false;
        const previous = this.prevButtons[index] ?? false;
        return current && !previous;

    }
}