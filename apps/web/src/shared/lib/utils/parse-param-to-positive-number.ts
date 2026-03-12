/**
 * Converts a URL parameter value to a positive number.
 * @param param The value from params or searchParams (can be a string or an array of strings)
 * @returns A valid positive number, or null if the value is invalid
 */
export function parseParamToPositiveNumber(
    param: string | string[] | undefined | null,
): number | null {
    if (!param) return null;

    // If it's an array (e.g., when using [...slug]), take the first element
    const value = Array.isArray(param) ? param[0] : param;
    const parsed = Number(value);

    // Check if it's a valid number and greater than zero
    if (Number.isNaN(parsed) || parsed <= 0) {
        return null;
    }

    return parsed;
}
