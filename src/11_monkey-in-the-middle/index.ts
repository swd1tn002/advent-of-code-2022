import path from 'path';
import { readFileSync } from 'fs';
import { splitStringMatrix, extractNumber, extractNumbers } from '../utils/strings';
import { sortNumbers } from '../utils/arrays';

/* "You take some notes (your puzzle input) on the items each monkey currently has, how worried you
 * are about those items, and how the monkey makes decisions based on your worry level. */
const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
let monkeyChunks = splitStringMatrix(puzzleInput, '\n\n', '\n  ').filter(line => line[0].length > 0);

type worryFunction = (x: number) => number;

class Monkey {
    private _inspected = 0;

    constructor(private items: number[],
        readonly inspect: worryFunction,
        readonly divider: number,
        readonly testFunc: worryFunction) {
    }

    /**
     * "Each monkey has several attributes: starting items,
     * operation, test, if true and if false."
     * @param lines that describe the monkey's behaviour
     */
    static parse(lines: string[]): Monkey {
        let [_id, _items, _operation, _test, _ifTrue, _ifFalse] = lines;

        let items = parseItems(_items);
        let operation = parseOperation(_operation);
        let [divider, testFunc] = parseTest(_test, _ifTrue, _ifFalse);
        return new Monkey(items, operation, divider, testFunc);
    }

    /**
     * "On a single monkey's turn, it inspects and throws all of the items it is holding
     * one at a time and in the order listed. Monkey 0 goes first, then monkey 1, and so
     * on until each monkey has had one turn. The process of each monkey taking a single
     * turn is called a round.
     */
    playRound(monkeys: Monkey[], reliefFunc: worryFunction): void {
        while (this.items.length) {
            let item = this.items.shift() as number;

            // inspection results in an increased worry level
            item = this.inspect(item);

            // relief the worry level with given functions
            item = reliefFunc(item);

            // When a monkey throws an item to another monkey, the item goes on the end
            // of the recipient monkey's list.
            let throwTo = this.testFunc(item);
            monkeys[throwTo].items.push(item);

            this._inspected++;
        }
    }

    get inspected(): number {
        return this._inspected;
    }
}

/**
 * Multiplies all given numbers together: [a, b, c] => a * b * c;
 */
function multiply(numbers: number[]): number {
    return numbers.slice(1).reduce((prev, curr) => prev * curr, numbers[0]);
}

/**
 * @param line "Starting items: 83, 96, 86, 58, 92"
 * @returns [83, 96, 86, 58, 92]
 */
function parseItems(line: string): number[] {
    return extractNumbers(line);
}

/**
 * "Operation shows how your worry level changes as that monkey inspects an item."
 * @param line "Operation: new = old * 13" or "Operation: new = old + old"
 */
function parseOperation(line: string): worryFunction {
    let op = line.substring(17);
    return (x: number) => eval(op.replace(/old/g, `${x}`));
}

/**
 * "Test" shows how the monkey uses your worry level to decide where to throw an item next.
 * @param input  "Test: divisible by 3"
 * @param truthy "  If true: throw to monkey 7"
 * @param falsy  "  If false: throw to monkey 3"
 * @return the divider used and a worry function that returns the truthy and falsy monkey numbers
 */
function parseTest(input: string, truthy: string, falsy: string): [number, worryFunction] {
    let divider = extractNumber(input);
    let [t, f] = [extractNumber(truthy), extractNumber(falsy)];

    return [divider, (x: number) => (x % divider === 0) ? t : f];
}

/**
 * "The level of monkey business can be found by multiplying the
 * inspections of the two most active monkeys together."
 */
function calculateMonkeyBusinessLevel(monkeys: Monkey[]): number {
    let inspectionCounts = monkeys.map(m => m.inspected);
    let mostActive = sortNumbers(inspectionCounts).slice(-2);

    return multiply(mostActive);
}


function part1() {
    let monkeys = monkeyChunks.map(c => Monkey.parse(c));

    /* "After each monkey inspects an item but before it tests your worry level,
     * your relief that the monkey's inspection didn't damage the item causes
     * your worry level to be divided by three and rounded down to the nearest integer. */
    let divideWorryByThree: worryFunction = (worry: number) => Math.floor(worry / 3);

    /* "You're going to have to focus on the two most active monkeys if you want any hope of getting
     * your stuff back. Count the total number of times each monkey inspects items over 20 rounds." */
    for (let round = 0; round < 20; round++) {
        monkeys.forEach(monkey => monkey.playRound(monkeys, divideWorryByThree));
    }

    console.log('Part 1: monkey business level after 20 rounds:', calculateMonkeyBusinessLevel(monkeys)); // 66124
}

function part2() {
    let monkeys = monkeyChunks.map(c => Monkey.parse(c));

    /* "You're worried you might not ever get your items back. So worried, in fact, that your
     * relief that a monkey's inspection didn't damage an item no longer causes your worry
     * level to be divided by three.
     *
     * Unfortunately, that relief was all that was keeping your worry levels from reaching
     * ridiculous levels.You'll need to find another way to keep your worry levels manageable."
     *
     * Solution: multiple the dividers of all monkeys to get a common "worry levle", which will
     * cause the worry level to roll over by a point that is common to all dividers.
     */
    let maxWorryLevel = multiply(monkeys.map(m => m.divider));
    let limitWorry: worryFunction = (worry: number) => worry % maxWorryLevel;

    for (let round = 0; round < 10_000; round++) {
        monkeys.forEach(monkey => monkey.playRound(monkeys, limitWorry));
    }

    console.log('Part 2: monkey business level after 10 000 rounds:', calculateMonkeyBusinessLevel(monkeys)); // 19309892877
}

part1();
part2();
