export function formatNumber(
    value: number | undefined | null,
    maximumFractionDigits: number = 2,
): string {
    if (value === undefined || value === null) {
        return '—';
    }

    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits,
    }).format(value);
}
