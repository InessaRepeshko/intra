export enum SerialisationGroupKey {
    BASIC = 'BASIC',
    CONFIDENTIAL = 'CONFIDENTIAL',
    SYSTEMIC = 'SYSTEMIC',
    PRIVATE = 'PRIVATE',
}

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
 * Constructor for "serialization sets" for a specific model.
 * - VALUES: allowed group-values for @Expose on fields of the model
 * - GROUPS: sets of active groups for @SerializeOptions (in controllers)
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
 * Type-safe runtime "pick" (analogue of TS Pick<...>, but at the level of values).
 * Returns an object only with the specified keys, preserving types.
 * @param obj - Object from which we take the values
 * @param keys - Keys from the object
 * @returns Object with the specified keys
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
