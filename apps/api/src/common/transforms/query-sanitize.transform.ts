import { Transform } from 'class-transformer';

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

export function ToOptionalTrimmedString(): PropertyDecorator {
  return Transform(({ value }) => {
    if (isEmpty(value)) return undefined;
    if (typeof value !== 'string') return value;
    const v = value.trim();
    return v === '' ? undefined : v;
  });
}

/**
 * Parse integer from query.
 * - ''/null/undefined -> undefined
 * - '123' -> 123
 * - 'abc' -> NaN (to catch IsInt/Min and return 400)
 */
export function ToOptionalInt(options?: { min?: number; max?: number }): PropertyDecorator {
  return Transform(({ value }) => {
    if (isEmpty(value)) return undefined;
    const n = typeof value === 'number' ? value : Number(String(value).trim());
    if (Number.isNaN(n)) return NaN;
    // only integer; decimal leave as is (IsInt will catch it)
    const int = Number.isInteger(n) ? n : n;
    if (options?.min !== undefined && typeof int === 'number' && int < options.min) return int;
    if (options?.max !== undefined && typeof int === 'number' && int > options.max) return int;
    return int;
  });
}

export function ToOptionalEnum<TEnum extends object>(_enum: TEnum): PropertyDecorator {
  return Transform(({ value }) => {
    if (isEmpty(value)) return undefined;
    return value;
  });
}

/**
 * Parse boolean from query.
 * - '' -> undefined
 * - 'true'/'1' -> true
 * - 'false'/'0' -> false
 * - other leave as is (IsBoolean will catch and return 400)
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
 * Parse date from query.
 * - '' -> undefined
 * - valid ISO/Date-string -> Date
 * - invalid -> Invalid Date (IsDate will catch and return 400)
 */
export function ToOptionalDate(): PropertyDecorator {
  return Transform(({ value }) => {
    if (isEmpty(value)) return undefined;
    if (value instanceof Date) return value;
    return new Date(String(value).trim());
  });
}


