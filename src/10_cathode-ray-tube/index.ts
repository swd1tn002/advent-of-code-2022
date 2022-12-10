import { readFileSync } from 'fs';
import { splitStringMatrix } from '../utils/strings';
import { last, max, sum } from '../utils/arrays';

const puzzleInput = readFileSync(__dirname + '/input.txt', 'utf-8');
const instructions: string[][] = splitStringMatrix(puzzleInput);

/* Part 1: "Start by figuring out the signal being sent by the CPU.
 * The CPU has a single register, X, which starts with the value 1.
 * It supports only two instructions: addx and noop." */
let cycles: number[] = [1];

for (let [op, val] of instructions) {
    let current = last(cycles);

    switch (op) {
        case 'noop':
            /* "noop takes one cycle to complete. It has no other effect." */
            cycles.push(current);
            break;
        case 'addx':
            /* "addx V takes two cycles to complete. After two cycles,
             * the X register is increased by the value V" */
            cycles.push(current, current + Number(val));
            break;
    }
}

/* "For now, consider the signal strength (the cycle number multiplied by the
 * value of the X register) during the 20th cycle and every 40 cycles after
 * that (that is, during the 20th, 60th, 100th, 140th, 180th, and 220th cycles)."
 */
let sampleCycles = [20, 60, 100, 140, 180, 220];

// Cycles are one-based but the value listing starts from index 0...
let strengthSum = sum(sampleCycles.map(c => cycles[c - 1] * c));

console.log('The sum of these signal strengths is:', strengthSum); // 17840


/* Part 2: "You count the pixels on the CRT: 40 wide and 6 high. The left-most pixel
 * in each row is in position 0, and the right - most pixel in each row is in position 39" */
console.log('\nText on CRT screen:'); // EALGULPG

/* "It seems like the X register controls the horizontal position of a sprite. Specifically,
 * the sprite is 3 pixels wide, and the X register sets the horizontal position of the middle
 * of that sprite. (In this system, there is no such thing as "vertical position": if the
 * sprite's horizontal position puts its pixels where the CRT is currently drawing, then those
 * pixels will be drawn.)" */
cycles.forEach((x, i) => {
    if (i % 40 === 0) {
        console.log(); // newline
    }

    let pixel = i % 40;
    let sprite = [x - 1, x, x + 1];

    let output = sprite.includes(pixel) ? '#' : '.';
    process.stdout.write(output);
});
