import path from 'path';
import { readFileSync } from 'fs';
import { splitLines } from '../utils/strings';
import { sum } from '../utils/arrays';

const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');


/**
 * "Okay, our Special Numeral-Analogue Fuel Units - SNAFU for short - are sort of like normal numbers.
 * You know how starting on the right, normal numbers have a ones place, a tens place, a hundreds place,
 * and so on, where the digit in each place tells you how many of that value you have?"
*
* "SNAFU works the same way, except it uses powers of five instead of ten. Starting from the right,
* you have a ones place, a fives place, a twenty-fives place, a one-hundred-and-twenty-fives place,
* and so on. It's that easy!"
*/
function parseSnafu(num: string): number {
    /**
     * "You know, I never did ask the engineers why they did that. Instead of using digits four through
     * zero, the digits are 2, 1, 0, minus (written -), and double-minus (written =).
     * Minus is worth -1, and double-minus is worth -2."
     */
    let digits = num.split('').map(x => '=-012'.indexOf(x) - 2);

    // multiply each digit with the corresponding power of 5 and sum them together
    return sum(digits.reverse().map((val, i) => val * Math.pow(5, i)));
}

function toSnafu(num: number): string {
    let overflow = Math.trunc((num + 2) / 5);
    let current = (num + 2) % 5;
    let snafu = '=-012'[current];

    if (overflow !== 0) {
        return toSnafu(overflow) + snafu;
    }
    return snafu;

}

function main() {
    let decimalSum = sum(splitLines(puzzleInput).map(parseSnafu));

    console.log('The sum of numbers in decimal is', decimalSum); // 28115957264952
    console.log('The sum of numbers in SNAFU is', toSnafu(decimalSum)); // 122-12==0-01=00-0=02
}

main();
