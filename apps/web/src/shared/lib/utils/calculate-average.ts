import { Decimal } from 'decimal.js';

export function calculateAverageNumberForArray(numbers: number[]): number {
    const decimalNumbers = numbers.map((number) => Decimal(number));
    let sum = Decimal(0);
    for (const number of decimalNumbers) {
        sum = sum.add(number);
    }
    return sum.div(decimalNumbers.length).toNumber();
}
