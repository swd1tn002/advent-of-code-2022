import path from 'path';
import { readFileSync } from 'fs';
import { splitLines } from '../utils/strings';
import { sum } from '../utils/arrays';
import { getCoordinates, mix, Num } from './mixer';


function main() {
    const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
    let original = splitLines(puzzleInput).map(line => new Num(Number(line)));

    /*
     * "The encrypted file is a list of numbers. To mix the file, move each number forward or backward in
     * the file a number of positions equal to the value of the number being moved. The list is circular,
     * so moving a number off one end of the list wraps back around to the other end as if the ends were
     * connected."
     */
    let mixed = mix(original, 1);
    let part1 = sum(getCoordinates(mixed));
    console.log('Part 1: the sum of coordinates is', part1);


    /*
     * Part 2:
     * "First, you need to apply the decryption key, 811589153. Multiply each number by the decryption
     * key before you begin; this will produce the actual list of numbers to mix. Second, you need to
     * mix the list of numbers ten times."
     */
    let decryptionKey = 811589153;
    let multiplied = original.map(num => new Num(decryptionKey * num.value));
    let mixed10Times = mix(multiplied, 10);

    let part2 = sum(getCoordinates(mixed10Times));
    console.log('Part 2: the sum of coordinates is', part2);
}

main();
