export function toDate(value: string | null | undefined): Date | null {
    if (!value) return null;
    return new Date(value);
}
