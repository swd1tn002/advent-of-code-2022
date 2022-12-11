import path from 'path';
import { readFileSync } from 'fs';
import { splitStringMatrix } from '../utils/strings';
import { sortNumbers } from '../utils/arrays';

const puzzleInput = readFileSync(path.join(__dirname, '/input.txt'), 'utf-8');
let monkeyChunks = splitStringMatrix(puzzleInput, '\n\n', '\n  ').filter(line => line[0].length > 0);


class Monkey {
    items: number[];
    operation: (old: number) => number;
    divider: number;
    throwTo: [number, number];
    reliefFactor: number;
    inspected = 0;

    constructor(items: number[], operation: (old: number) => number, divider: number, throwTo: [number, number], reliefFactor: number) {
        this.items = items;
        this.operation = operation;
        this.divider = divider;
        this.throwTo = throwTo;
        this.reliefFactor = reliefFactor;
    }

    static parse(inputs: string[], reliefFactor: number): Monkey {
        let [_id, items, operation, test, truthy, falsy] = inputs;

        let i = parseItems(items);
        let o = parseOperation(operation);
        let d = parseDivider(test);
        let tt = parseThrows(truthy, falsy);
        return new Monkey(i, o, d, tt, reliefFactor);
    }

    playRound(): void {
        while (this.items.length) {
            let worryLevel = this.items.shift() as number;
            //console.log('before', worryLevel);

            // inspection
            worryLevel = this.operation(worryLevel);

            // relief
            worryLevel = Math.floor(worryLevel / this.reliefFactor);

            worryLevel = worryLevel % mul(monkeys.map(m => m.divider));

            //console.log('after', worryLevel);

            if (worryLevel % this.divider === 0) {
                monkeys[this.throwTo[0]].items.push(worryLevel);
            } else {
                monkeys[this.throwTo[1]].items.push(worryLevel);
            }
            this.inspected++;
        }
    }
}

function mul(numbers: number[]): number {
    return numbers.slice(1).reduce((prev, curr) => prev * curr, numbers[0]);
}

function parseItems(line: string): number[] {
    // Starting items: 83, 96, 86, 58, 92
    return line.substring(16).replace(', ', ',').split(',').map(n => Number(n));
}

function parseOperation(line: string): (x: number) => number {
    // Operation: new = old * 13
    // Operation: new = old + 2
    let op = line.substring(17);
    return (x: number) => eval(op.replace(/old/g, `${x}`));
}

function parseDivider(input: string): number {
    // "Test: divisible by 3"
    return Number(input.substring(19));
}

function parseThrows(truthy: string, falsy: string): [number, number] {
    // "  If true: throw to monkey 7"
    // "  If false: throw to monkey 3"
    return [Number(truthy.substring(27)), Number(falsy.substring(28))];
}

let monkeys = monkeyChunks.map(c => Monkey.parse(c, 3));

// tests
let first = monkeys[0];
console.log(first.operation(100) === 1300);
console.log(first.divider === 19);

for (let round = 0; round < 20; round++) {
    monkeys.forEach(monkey => monkey.playRound());
}

let inspections = monkeys.map(m => m.inspected);
console.log({ inspections });

let largest = sortNumbers(inspections).slice(-2);

console.log('Monkey business level:', largest[0] * largest[1]);

monkeys = monkeyChunks.map(c => Monkey.parse(c, 1));

for (let round = 0; round < 10_000; round++) {
    monkeys.forEach(monkey => monkey.playRound());
}

inspections = monkeys.map(m => m.inspected);
console.log({ inspections });

largest = sortNumbers(inspections).slice(-2);

console.log('Monkey business level:', largest[0] * largest[1]);
