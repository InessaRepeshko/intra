export const compareArrays = (arrA: number[], arrB: number[]): number => {
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
