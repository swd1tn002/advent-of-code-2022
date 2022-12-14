
/**
 * Limits the given number to +/- 1 or 0.
 */
export function maxOne(num: number): number {
    if (num === 0) {
        return 0;
    }
    return num / Math.abs(num);
}
