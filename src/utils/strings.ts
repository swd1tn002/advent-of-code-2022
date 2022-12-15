export function splitLines(text: string, delimiter: string = '\n'): string[] {
    return text.trim().split(delimiter);
}

export function splitStringMatrix(text: string, rowDelimiter: string = '\n', colDelimiter: string = ' '): string[][] {
    return splitLines(text, rowDelimiter).map(row => row.trim().split(colDelimiter));
}

export function splitNumberMatrix(text: string, rowDelimiter: string = '\n', colDelimiter: string = ' '): number[][] {
    return splitStringMatrix(text, rowDelimiter, colDelimiter).map(row => {
        return row.map(num => Number(num));
    });
}

/** Returns the digits in the given string as a number. */
export function extractNumber(text: string): number {
    return Number(text.replace(/[^(0-9\-)]/g, ''));
}

/** Returns all numbers delimited by any other characters as an array. */
export function extractNumbers(text: string): number[] {
    // Replace all but numbers and spaces, then remove extra spaces
    let cleaned = text.replace(/[^(0-9\-) ]/g, ' ').replace(/ +/g, ' ');
    return cleaned.trim().split(' ').map(x => Number(x));
}
