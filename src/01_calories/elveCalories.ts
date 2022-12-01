import { readFileSync } from 'fs';
import { sum, max, sortNumbers } from '../utils/arrays';

let puzzleInput = readFileSync(__dirname + '/input.txt', 'utf-8');
let elves = puzzleInput.split('\n\n');


function countCalories(elve: string): number {
    return sum(elve.split('\n').map(Number));
}

/* Find the Elf carrying the most Calories. How many
 * total Calories is that Elf carrying? */
let elveCalories: number[] = elves.map(countCalories);
console.log('Max calories', max(elveCalories));

/* Find the top three Elves carrying the most Calories.
 * How many Calories are those Elves carrying in total? */
let sorted = sortNumbers(elveCalories);
console.log('Top three calories', sum(sorted.slice(-3)));