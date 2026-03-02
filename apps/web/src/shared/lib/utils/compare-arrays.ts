export const compareNumberArrays = (arrA: number[], arrB: number[]): number => {
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
    const maxLength = Math.max(arrA.length, arrB.length);

    for (let i = 0; i < maxLength; i++) {
        const valA = arrA[i] ?? '';
        const valB = arrB[i] ?? '';

        if (valA !== valB) {
            return valA.localeCompare(valB);
        }
    }

    return 0;
};
