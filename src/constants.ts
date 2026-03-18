// Розмір однієї клітинки в пікселях
// Все поле складається з клітинок — змійка, їжа живуть у клітинках
export const GRID_SIZE = 20;

// Кількість клітинок по горизонталі і вертикалі
export const GRID_WIDTH = 20;
export const GRID_HEIGHT = 20;

// Розмір canvas в пікселях
// Рахуємо автоматично — щоб canvas точно вміщував сітку
export const SCREEN_WIDTH = GRID_SIZE * GRID_WIDTH;  // 20 * 20 = 400px
export const SCREEN_HEIGHT = GRID_SIZE * GRID_HEIGHT; // 20 * 20 = 400px

// Час між кроками змійки у мілісекундах
// 150мс = приблизно 6 кроків на секунду — не надто швидко і не надто повільно
export const TICK_INTERVAL = 150;

// Enum — набір іменованих констант для напрямків
// Краще ніж рядки 'up'/'down' бо TypeScript перевірить помилки
export const Direction = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT"
} as const;

export type Direction = typeof Direction[keyof typeof Direction];