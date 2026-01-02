import { Transform } from 'class-transformer';

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

/**
 * Trim string; empty -> undefined (для optional полів).
 * Некоректні типи лишає як є (валідація має впіймати).
 */
export function ToOptionalTrimmedString(): PropertyDecorator {
  return Transform(({ value }) => {
    if (isEmpty(value)) return undefined;
    if (typeof value !== 'string') return value;
    const v = value.trim();
    return v === '' ? undefined : v;
  });
}

/**
 * Парсить ціле число з query.
 * - ''/null/undefined -> undefined
 * - '123' -> 123
 * - 'abc' -> NaN (щоб IsInt/Min звалилися і повернуло 400)
 */
export function ToOptionalInt(options?: { min?: number; max?: number }): PropertyDecorator {
  return Transform(({ value }) => {
    if (isEmpty(value)) return undefined;
    const n = typeof value === 'number' ? value : Number(String(value).trim());
    if (Number.isNaN(n)) return NaN;
    // тільки integer; десяткові залишаємо як є (IsInt впіймає)
    const int = Number.isInteger(n) ? n : n;
    if (options?.min !== undefined && typeof int === 'number' && int < options.min) return int;
    if (options?.max !== undefined && typeof int === 'number' && int > options.max) return int;
    return int;
  });
}

/**
 * Порожнє -> undefined. Інакше лишає значення (IsEnum має впіймати невалідне).
 */
export function ToOptionalEnum<TEnum extends object>(_enum: TEnum): PropertyDecorator {
  return Transform(({ value }) => {
    if (isEmpty(value)) return undefined;
    return value;
  });
}

/**
 * Парсить boolean з query.
 * - '' -> undefined
 * - 'true'/'1' -> true
 * - 'false'/'0' -> false
 * - інше лишаємо як є (IsBoolean має впіймати і повернути 400)
 */
export function ToOptionalBool(): PropertyDecorator {
  return Transform(({ value }) => {
    if (isEmpty(value)) return undefined;
    if (typeof value === 'boolean') return value;

    const v = String(value).trim().toLowerCase();
    if (v === 'true' || v === '1') return true;
    if (v === 'false' || v === '0') return false;
    return value;
  });
}

/**
 * Парсить дату з query.
 * - '' -> undefined
 * - валідний ISO/Date-string -> Date
 * - невалідний -> Invalid Date (IsDate має впіймати і повернути 400)
 */
export function ToOptionalDate(): PropertyDecorator {
  return Transform(({ value }) => {
    if (isEmpty(value)) return undefined;
    if (value instanceof Date) return value;
    return new Date(String(value).trim());
  });
}


