export const sum = (arr: number[]): number => arr.reduce((acc, curr) => acc + curr, 0);

export const max = (arr: number[]): number => arr.reduce((maximum, curr) => maximum > curr ? maximum : curr, arr[0]);

export const min = (arr: number[]): number => arr.reduce((minimum, curr) => minimum < curr ? minimum : curr, arr[0]);

/**
 * Sorts the given numbers in ascending order in a new array.
 *
 * @param arr array of numbers
 * @returns a copy of the given array in ascending order
 */
export function sortNumbers(arr: number[]): number[] {
    return [...arr].sort((a, b) => a - b);
}
