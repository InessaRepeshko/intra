import { calculateAverageNumberForArray } from '@shared/lib/utils/calculate-average';

export const getValidAverage = (values: (number | null | undefined)[]) => {
    const validValues = values.filter(
        (val): val is number => typeof val === 'number',
    );
    if (validValues.length === 0) return 0;
    return calculateAverageNumberForArray(validValues);
};
