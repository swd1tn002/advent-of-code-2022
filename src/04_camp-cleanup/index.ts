import { readFileSync } from 'fs';
import { Range } from '../utils/Range';
import { splitStringMatrix } from '../utils/strings';

/**
 * "The Elves pair up and make a big list of the section assignments for each pair (your puzzle input)."
 */
function parsePuzzleInput(puzzleInput: string): [Range, Range][] {
    let inputMatrix: string[][] = splitStringMatrix(puzzleInput, '\n', ',');

    return inputMatrix.map(row => {
        return [Range.parse(row[0]), Range.parse(row[1])];
    });
}

const puzzleInput = readFileSync(__dirname + '/input.txt', 'utf-8');
const pairs: [Range, Range][] = parsePuzzleInput(puzzleInput);

/* Part 1: Some of the pairs have noticed that one of their assignments fully contains the other. 
 * For example, 2-8 fully contains 3-7, and 6-6 is fully contained by 4-6. */
let containsCount = 0;

for (let [r1, r2] of pairs) {
    if (r1.fullyContains(r2) || r2.fullyContains(r1)) {
        containsCount++;
    }
}

console.log('Pairs where one fully contains the other: ', containsCount); // 534


/* Part 2: It seems like there is still quite a bit of duplicate work planned. Instead,
 * the Elves would like to know the number of pairs that overlap at all. */
let overlapCount = 0;

for (let [r1, r2] of pairs) {
    if (r1.overlaps(r2)) {
        overlapCount++;
    }
}
console.log('Pairs that overlap at all: ', overlapCount); // 841
