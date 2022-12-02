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
