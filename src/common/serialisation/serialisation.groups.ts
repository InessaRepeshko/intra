/**
 * Ключі об'єкта SERIALISATION_GROUPS
 */
export enum SerialisationGroupKey {
    BASIC = 'BASIC',
    CONFIDENTIAL = 'CONFIDENTIAL',
    SYSTEMIC = 'SYSTEMIC',
    PRIVATE = 'PRIVATE',
}

/**
 * Значення об'єкта SERIALISATION_GROUPS
 */
export enum SerialisationGroupValue {
    BASIC = 'basic',
    CONFIDENTIAL = 'confidential',
    SYSTEMIC = 'systemic',
    PRIVATE = 'private',
}

export const SERIALISATION_GROUPS = {
    BASIC: [SerialisationGroupValue.BASIC],
    CONFIDENTIAL: [SerialisationGroupValue.BASIC, SerialisationGroupValue.CONFIDENTIAL],
    SYSTEMIC: [SerialisationGroupValue.BASIC, SerialisationGroupValue.SYSTEMIC],
    PRIVATE: [SerialisationGroupValue.BASIC, SerialisationGroupValue.CONFIDENTIAL, SerialisationGroupValue.PRIVATE],
};

/**
 * Конструктор “серіалізаційних наборів” для конкретної моделі.
 * - VALUES: дозволені group-values для @Expose на полях моделі
 * - GROUPS: набори активних groups для @SerializeOptions (в контролерах)
 */
export function defineModelSerialisation<
    const K extends readonly SerialisationGroupKey[],
>(keys: K) {
    return {
        VALUES: pickGroup(SerialisationGroupValue, keys),
        GROUPS: pickGroup(SERIALISATION_GROUPS, keys),
    } as const;
}

/**
 * Type-safe runtime "pick" (аналог TS Pick<...>, але на рівні значень).
 * Повертає об'єкт лише з вказаними ключами, зберігаючи типи.
 * @param obj - Об'єкт, з якого беремо значення
 * @param keys - Ключі, які беремо з об'єкта
 * @returns Об'єкт з вказаними ключами
 */
export function pickGroup<const T extends Record<PropertyKey, unknown>, const K extends readonly (keyof T)[]>(
    obj: T,
    keys: K,
): { [P in K[number]]: T[P] } {
    const out = {} as { [P in K[number]]: T[P] };
    for (const key of keys) {
        out[key] = obj[key];
    }
    return out;
}
