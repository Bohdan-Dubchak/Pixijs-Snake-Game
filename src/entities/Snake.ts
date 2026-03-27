import {Container, Sprite, Texture} from "pixi.js";
import { GRID_SIZE, GRID_HEIGHT, GRID_WIDTH, Direction } from "../constants";
import { Grid } from "./Grid";

// Тип для позиції на полі — у клітинках, не пікселях
// Використовуємо скрізь: segments[], Food, GameScene
interface Cell {
    col: number;
    row: number;
}

export class Snake extends Container {
    // Масив всіх сегментів — [0] голова, останній — хвіст
    // Зберігаємо у клітинках, бо так легше рахувати колізії
    private segments: Cell[] = [
        { col: 12, row: 10 }, // голова
        { col: 11, row: 10 }, // тіло
        { col: 10, row: 10 }, // хвіст
    ];

    private direction: Direction = Direction.RIGHT;
    // nextDirection — окремо від direction щоб не втратити поворот
    // між тітками якщо гравець натиснув клавішу
    private nextDirection: Direction = Direction.RIGHT;

    // true — наступний крок не видаляти хвіст, змійка росте
    private shouldGrow: boolean = false;

    // Graphics об'єкти — по одному на кожен сегмент
    // індекс тут = індекс в segments[]
    private segmentViews: Sprite[] = [];

    private headTexture: Texture;
    private bodyTexture: Texture;

    // Тепер приймає дві текстури замість нуля аргументі
    constructor(headTexture: Texture, bodyTexture: Texture) {
        super();

        this.headTexture = headTexture;
        this.bodyTexture = bodyTexture;

        // Створюємо Graphics для кожного початкового сегмента
        for (let i = 0; i < this.segments.length; i++) {
            const sprite = this.createSprite(i === 0);
            this.segmentViews.push(sprite); // зберігаємо, щоб переміщати
            this.addChild(sprite); // додаємо, щоб малювалось
        }

        // Ставимо на початкові позиції
        this.redraw();
    }

    // Викликається з GameScene по таймеру — не що кадру
    move(): void {
        // Фіксуємо напрямок тільки тут —
        // не можна змінити напрямок двічі за один тік
        this.direction = this.nextDirection;

        const head = this.segments[0];

        // Розраховуємо позицію нової голови
        const newHead: Cell = {
            col: head.col + this.getDeltaCol(),
            row: head.row + this.getDeltaRow(),
        };

        // unshift — додаємо нову голову на початок масиву
        this.segments.unshift(newHead);

        if (this.shouldGrow) {
            // Ріст — хвіст не видаляємо, додаємо новий Graphics
            this.shouldGrow = false;
            const sprite = this.createSprite(false);
            this.segmentViews.push(sprite);
            this.addChild(sprite);
        } else {
            // Звичайний рух — видаляємо хвіст
            // Змійка "переміщується" а не росте
            this.segments.pop();
        }

        this.redraw();
    }

    // Викликається з GameScene коли змійка з'їла їжу
    // Не ростемо одразу — чекаємо до наступного move()
    // Так хвіст росте ззаду що виглядає природно
    grow(): void {
        this.shouldGrow = true;
    }

    setDirection(dir: Direction): void {
        const opposite: Record<Direction, Direction> = {
            [Direction.UP]: Direction.DOWN,
            [Direction.DOWN]: Direction.UP,
            [Direction.LEFT]: Direction.RIGHT,
            [Direction.RIGHT]: Direction.LEFT
        };

        // Ігноруємо розворот на 180° — це завжди помилковий натиск
        if (dir !== opposite[this.direction]) {
            this.nextDirection = dir;
        }
    }

    // Чи голова вийшла за межі поля
    isOutOfBounds(): boolean {
        const { col, row } = this.segments[0];
        return (
            col < 0 ||
            col >= GRID_WIDTH ||
            row < 0 ||
            row >= GRID_HEIGHT
        );
    }

    // Чи голова співпала з будь-яким сегментом тіла
    isSelfCollision(): Boolean {
        const head = this.segments[0];
        return this.segments
            .slice(1) // всі крім голови
            .some(s => s.col === head.col && s.row === head.row);
    }

    // Копія позиції голови — копія щоб ніхто не змінив оригінал
    getHeadPosition(): Cell {
        return { ...this.segments[0] };
    }

    // Копія всього масиву — для Food.spawn() щоб їжа не спавнилась під змійкою
    getSegments(): Cell[] {
        return this.segments.map(s => ({ ...s }));
    }

    // Оновлюємо піксельні позиції всіх Graphics по даних з segments[]
    private redraw(): void {
        this.segments.forEach((seg, i) => {
            const { x, y } = Grid.cellToPixel(seg.col, seg.row);
            const sprite = this.segmentViews[i];

            // anchor 0.5 — обертаємо навколо центру
            sprite.anchor.set(0.5);
            sprite.x = x + GRID_SIZE / 2;
            sprite.y = y + GRID_SIZE / 2;

            sprite.rotation = i === 0 ? this.getHeadRotation() : 0;
        });
    }

    // Кут повороту в радіанах для кожного напрямку
    // Спрайт голови дивиться вправо за замовчуванням —
    // тому RIGHT = 0, інші відносно нього
    private getHeadRotation(): number {
        switch (this.direction) {
            case Direction.UP: return 0;
            case  Direction.RIGHT: return  Math.PI / 2;
            case  Direction.DOWN: return  Math.PI;
            case  Direction.LEFT: return  -Math.PI / 2;
        }
    }

    private getDeltaCol(): number {
        if (this.direction === Direction.LEFT) return -1;
        if (this.direction === Direction.RIGHT) return 1;
        return 0;
    }

    private getDeltaRow(): number {
        if (this.direction === Direction.UP) return -1;
        if (this.direction === Direction.DOWN) return 1;
        return 0;
    }

    private createSprite(isHead: boolean): Sprite {
        const sprite = new Sprite(isHead ? this.headTexture : this.bodyTexture);
        sprite.width  = GRID_SIZE;
        sprite.height = GRID_SIZE;
        return sprite;
    }
}