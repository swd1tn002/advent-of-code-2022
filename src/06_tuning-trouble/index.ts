import { readFileSync } from "fs";
import path from "path";

const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

function allDifferent(chars: string): boolean {
    return new Set(chars).size === chars.length;
}

function findFirstSequenceOfDifferentChars(input: string, seqLength: number): number {
    for (let start = 0; start + seqLength <= input.length; start++) {
        let characters = input.substring(start, start + seqLength);

        if (allDifferent(characters)) {
            return start + seqLength;
        }
    }

    throw new Error(`Could not find a sequence of ${seqLength} different chars in message ${input}`);
}

function findEndOfMessageMarker(message: string): number {
    return findFirstSequenceOfDifferentChars(message, 4);
}

function findStartOfMessageMarker(message: string): number {
    return findFirstSequenceOfDifferentChars(message, 14);
}

console.log('Part 1, end of message:', findEndOfMessageMarker(puzzleInput));
console.log('Part 2, start of message:', findStartOfMessageMarker(puzzleInput));
