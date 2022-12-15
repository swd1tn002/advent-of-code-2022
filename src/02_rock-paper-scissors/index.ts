import { readFileSync } from 'fs';
import path from 'path';
import { sum } from '../utils/arrays';
import { parseGameMoves, parseGameStrategies, getScoreForRound } from './rockPaperScissors';

// "one Elf gives you an encrypted strategy guide (your puzzle input)"
const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

// "Your total score is the sum of your scores for  each round."

let firstStrategy = parseGameMoves(puzzleInput).map(getScoreForRound);
console.log('Total score for part 1:', sum(firstStrategy)); // 12855

let secondStrategy = parseGameStrategies(puzzleInput).map(getScoreForRound);
console.log('Total score for part 2:', sum(secondStrategy)); // 13726
