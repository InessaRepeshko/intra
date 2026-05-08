export const compareNumberArrays = (arrA: number[], arrB: number[]): number => {
    // First compare by array length
    const lengthDiff = arrA.length - arrB.length;

    if (lengthDiff !== 0) {
        return lengthDiff;
    }

    const maxLength = Math.max(arrA.length, arrB.length);

    for (let i = 0; i < maxLength; i++) {
        const valA = arrA[i] ?? -1;
        const valB = arrB[i] ?? -1;

        if (valA !== valB) {
            return valA - valB;
        }
    }

    return 0;
};

export const compareStringArrays = (arrA: string[], arrB: string[]): number => {
    const lengthDiff = arrA.length - arrB.length;
    if (lengthDiff !== 0) {
        return lengthDiff;
    }

    const maxLength = Math.max(arrA.length, arrB.length);

    for (let i = 0; i < maxLength; i++) {
        const valA = arrA[i];
        const valB = arrB[i];

        if (valA !== valB) {
            return valA.localeCompare(valB);
        }
    }

    return 0;
};
