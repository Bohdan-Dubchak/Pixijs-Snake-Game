import { Container, Graphics } from "pixi.js";
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
    // Зберігаємо у клітинках бо так легше рахувати колізії
    private segments: Cell[] = [
        { col: 12, row: 10 }, // голова
        { col: 11, row: 10 }, // тіло
        { col: 10, row: 10 }, // хвіст
    ];

    private direction: Direction = Direction.RIGHT;
    // nextDirection — окремо від direction щоб не втратити поворот
    // між тіками якщо гравець натиснув клавішу
    private nextDirection: Direction = Direction.RIGHT;

    // true — наступний крок не видаляти хвіст, змійка росте
    private shouldGrow: boolean = false;

    // Graphics об'єкти — по одному на кожен сегмент
    // індекс тут = індекс в segments[]
    private segmentViews: Graphics[] = [];

    constructor() {
        super();

        // Створюємо Graphics для кожного початкового сегмента
        for (const _ of this.segments) {
            const g = this.createSegmentView();
            this.segmentViews.push(g); // зберігаємо щоб переміщати
            this.addChild(g); // додаємо щоб малювалось
        }

        // Ставимо на початкові позиції
        this.redraw();
    }

    // Викликається з GameScene по таймеру — не щокадру
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
            const g = this.createSegmentView();
            this.segmentViews.push(g);
            this.addChild(g);
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
            const view = this.segmentViews[i];
            view.x = x;
            view.y = y;

            // Голова біліша — легше бачити напрямок
            view.tint = i === 0 ? 0xffffff : 0x44ff88;
        });
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

    private createSegmentView(): Graphics {
        const g = new Graphics();
        // Відступ 2px — щоб між сегментами був зазор і сітка просвічувала
        g.roundRect(2, 2, GRID_SIZE - 4, GRID_SIZE - 4, 4);
        g.fill({ color: 0x44ff88 });
        return g;
    }
}