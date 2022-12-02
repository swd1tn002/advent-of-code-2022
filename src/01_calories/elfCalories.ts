import { readFileSync } from 'fs';
import { sum, max, sortNumbers } from '../utils/arrays';
import { splitNumberMatrix } from '../utils/strings';

/* The Elves take turns writing down the number of Calories contained by the
 * various meals, snacks, rations, etc. that they've brought with them, one
 * item per line. Each Elf separates their own inventory from the previous Elf's
 * inventory (if any) by a blank line. 
 * 
 * https://adventofcode.com/2022/day/1
 */
let puzzleInput = readFileSync(__dirname + '/input.txt', 'utf-8');
let mealsPerElf: number[][] = splitNumberMatrix(puzzleInput, '\n\n', '\n');

/* Find the Elf carrying the most Calories. How many
 * total Calories is that Elf carrying? */
let calorieSums: number[] = mealsPerElf.map(meals => sum(meals));
console.log('Max calories:', max(calorieSums));

/* Find the top three Elves carrying the most Calories.
 * How many Calories are those Elves carrying in total? */
let topThree = sortNumbers(calorieSums).slice(-3);
console.log('Top three calories total:', sum(topThree));
