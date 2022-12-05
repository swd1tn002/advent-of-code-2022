import { readFileSync } from 'fs';
import { splitLines, notEmpty } from '../utils/strings';
import { last } from '../utils/arrays';

interface Move {
    from: number,
    to: number,
    count: number
}

/**
 * Turns puzzle input such as:
 *
 * [A2] [B2]
 * [A1] [B1]
 *  1    2
 *
 * into a matrix, where each stack is listed bottom to top:
 *
 * [['A1', 'A2'], ['B1', 'B2']]
 */
function parseStacks(stackInput: string): string[][] {
    // empty slots need to be truncated before splitting:
    let cleaned = stackInput.replace(/    /g, ' ');

    let reversedRows = cleaned.split('\n').map(row => row.split(' ')).reverse();
    let [_ids, ...rows] = reversedRows;

    // rotate to get each stack in a single list: [['A1', 'B1'], ['A2', 'B2']] => [['A1', 'A2'], ['B1', 'B2']]
    return rotate(rows);
}

/**
 * Transforms rows into columns and columns into rows:
 * [['A1', 'B1'], ['A2', 'B2']] => [['A1', 'A2'], ['B1', 'B2']]
 */
function rotate<T>(rows: T[][]): T[][] {
    let rotated = rows[0].map(n => [] as T[]);

    for (let row of rows) {
        for (let index in row) {
            if (row[index]) {
                rotated[index].push(row[index]);
            }
        }
    }
    return rotated;
}

/** Reads all input moves and transforms them into an array of Move objects. */
function readMoves(moveInput: string): Move[] {
    return splitLines(moveInput).map(parseMove);
}

/**
 * Returns the count, from and to values for a given move in input.
 * @param moveStr 'move 1 from 2 to 3'
 */
function parseMove(moveStr: string): Move {
    let [_m, count, _f, from, _t, to] = moveStr.split(' ').map(Number);
    return { count, from, to };
}

/** Manipulates the given stacks by moving crates one by one following given moves. */
function moveCratesOneByOne(stacks: string[][], moves: Move[]): string[][] {
    let newStacks = [...stacks.map(row => [...row])];

    for (let move of moves) {
        let from = newStacks[move.from - 1];
        let to = newStacks[move.to - 1];

        for (let i = 0; i < move.count; i++) {
            let crate = from.pop() as string;
            to.push(crate);
        }
    }
    return newStacks;
}

/** Manipulates the given stacks by moving crates as stacks by one following given moves. */
function moveCratesAsStacks(stacks: string[][], moves: Move[]): string[][] {
    let newStacks = [...stacks.map(stack => [...stack])];

    for (let move of moves) {
        let from = newStacks[move.from - 1];
        let to = newStacks[move.to - 1];

        let crates = from.splice(from.length - move.count, move.count);
        to.push(...crates);
    }
    return newStacks;
}

/** Joins given crate names together and removes brackets. */
function formatOutput(crates: string[]): string {
    return crates.join('').replace(/\[/g, '').replace(/\]/g, '');
}

const puzzleInput = readFileSync(__dirname + '/input.txt', 'utf-8');
const [stackInput, moveInput] = puzzleInput.split('\n\n');

let stacks = parseStacks(stackInput);
let moves: Move[] = readMoves(moveInput);


let part1 = moveCratesOneByOne(stacks, moves);
console.log('Part 1:', formatOutput(part1.map(last))); // ZRLJGSCTR

let part2 = moveCratesAsStacks(stacks, moves);
console.log('Part 2:', formatOutput(part2.map(last))); // PRTTGRFPB
