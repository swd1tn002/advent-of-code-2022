import { readFileSync } from 'fs';
import { splitStringMatrix } from '../utils/strings';
import { last, max } from '../utils/arrays';

const puzzleInput = readFileSync(__dirname + '/input.txt', 'utf-8');
const instructions: string[][] = splitStringMatrix(puzzleInput);

let cycleValues: number[] = [1];

for (let [op, val] of instructions) {
    let current = last(cycleValues);

    switch (op) {
        case 'noop':
            cycleValues.push(current);
            break;
        case 'addx':
            cycleValues.push(current, current + Number(val));
    }
}

let cycles = [20, 60, 100, 140, 180, 220];

let result = 0;
for (let c of cycles) {
    // Cycles are one-based but the value listing starts from index 0...
    result += c * cycleValues[c - 1];
}

console.log('The sum of these signal strengths is:', result);


// You count the pixels on the CRT: 40 wide and 6 high. The left-most pixel
// in each row is in position 0, and the right - most pixel in each row is in position 39

console.log();
console.log('Text on CRT screen:');

cycleValues.forEach((x, i) => {
    if (i % 40 === 0) {
        console.log();
    }

    let sprite = [x - 1, x, x + 1];
    let pixel = i % 40;
    if (sprite.includes(pixel)) {
        process.stdout.write('#');
    } else {
        process.stdout.write('.');
    }
});
