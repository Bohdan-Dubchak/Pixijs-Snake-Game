// Розмір однієї клітинки в пікселях
// Все поле складається з клітинок — змійка, їжа живуть у клітинках
export const GRID_SIZE = 20;

// Кількість клітинок по горизонталі і вертикалі
export const GRID_WIDTH = 20;
export const GRID_HEIGHT = 20;

// Висота панелі зверху — там будуть score і mute
export const UI_HEIGHT = 40;

// Розмір canvas в пікселях
// Рахуємо автоматично — щоб canvas точно вміщував сітку
export const SCREEN_WIDTH = GRID_SIZE * GRID_WIDTH;  // 20 * 20 = 400px
export const SCREEN_HEIGHT = GRID_SIZE * GRID_HEIGHT + UI_HEIGHT; // 20 * 20 + 40 = 404px

// Час між кроками змійки у мілісекундах
// 150мс = приблизно 6 кроків на секунду — не надто швидко і не надто повільно
export const TICK_INTERVAL = 150;

// Мінімальний інтервал — швидше не стає
// 60мс = дуже швидко, майже неможливо
export const MIN_TICK_INTERVAL = 60;

// Кожні скільки очок збільшується рівень
export const SCORE_PER_LEVEL = 5;

// На скільки мс зменшується інтервал за кожен рівень
export const SPEED_INCREASE = 10;

// Enum — набір іменованих констант для напрямків
// Краще ніж рядки 'up'/'down' бо TypeScript перевірить помилки
export const Direction = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT"
} as const;

export type Direction = typeof Direction[keyof typeof Direction];
