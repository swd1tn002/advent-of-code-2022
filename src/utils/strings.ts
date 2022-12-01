export function splitLines(text: string, delimiter: string = '\n'): string[] {
    return text.split(delimiter);
}

export function splitStringMatrix(text: string, rowDelimiter: string = '\n', colDelimiter: string = ' '): string[][] {
    return text.split(rowDelimiter).map(row => row.trim().split(colDelimiter));
}

export function splitNumberMatrix(text: string, rowDelimiter: string = '\n', colDelimiter: string = ' '): number[][] {
    return splitStringMatrix(text, rowDelimiter, colDelimiter).map(row => {
        return row.map(num => Number(num));
    });
}
