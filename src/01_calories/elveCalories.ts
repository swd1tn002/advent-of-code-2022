import { readFileSync } from 'fs';
import { sum, max, sortNumbers } from '../utils/arrays';


/* The Elves take turns writing down the number of Calories contained by the
 * various meals, snacks, rations, etc. that they've brought with them, one
 * item per line. Each Elf separates their own inventory from the previous Elf's
 * inventory (if any) by a blank line. 
 * 
 * https://adventofcode.com/2022/day/1
 */
let puzzleInput = readFileSync(__dirname + '/input.txt', 'utf-8');
let elves = puzzleInput.split('\n\n');


function countCalories(elve: string): number {
    let linesAsNumbers: number[] = elve.split('\n').map(Number);
    return sum(linesAsNumbers);
}

/* Find the Elf carrying the most Calories. How many
 * total Calories is that Elf carrying? */
let elveCalories: number[] = elves.map(countCalories);
console.log('Max calories', max(elveCalories));

/* Find the top three Elves carrying the most Calories.
 * How many Calories are those Elves carrying in total? */
let sorted = sortNumbers(elveCalories);
console.log('Top three calories', sum(sorted.slice(-3)));