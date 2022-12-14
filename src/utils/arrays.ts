export const sum = (arr: number[]): number => arr.reduce((acc, curr) => acc + curr, 0);

export const max = (arr: number[]): number => arr.reduce((maximum, curr) => maximum > curr ? maximum : curr, arr[0]);

export const min = (arr: number[]): number => arr.reduce((minimum, curr) => minimum < curr ? minimum : curr, arr[0]);

export function last<T>(arr: T[]): T {
    return arr[arr.length - 1];
}

/**
 * Sorts the given numbers in ascending order in a new array.
 *
 * @param arr array of numbers
 * @returns a copy of the given array in ascending order
 */
export function sortNumbers(arr: number[]): number[] {
    return [...arr].sort((a, b) => a - b);
}

// https://stackoverflow.com/a/55435856
function* chunks<T>(arr: T[], chunkSize: number): Generator<T[], void> {
    for (let i = 0; i < arr.length; i += chunkSize) {
        yield arr.slice(i, i + chunkSize);
    }
}

export function splitToChunks<T>(arr: T[], chunkSize: number): T[][] {
    return [...chunks(arr, chunkSize)];
}

/**
 * Transposes the given 2 dimensional array so that rows become columns and columns become rows.
 */
export function transpose<T>(matrix: T[][]): T[][] {
    let rotated = matrix[0].map(col => new Array<T>());
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            rotated[x][y] = value;
        });
    })
    return rotated;
}

/**
 * Returns a deep copy of the given matrix with each row reversed.
 */
export function reverseRows<T>(matrix: T[][]): T[][] {
    return matrix.map(row => [...row].reverse());
}

/**
 * Returns an array that contains pairs from arr1 and arr2 as tuples.
 */
export function zip<T, U>(arr1: T[], arr2: U[]): [T, U][] {
    return arr1.map((v, i) => [v, arr2[i]]);
}
