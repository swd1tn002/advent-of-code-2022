import path from 'path';
import { readFileSync } from 'fs';
import { splitLines, splitStringMatrix, splitNumberMatrix, extractNumber, extractNumbers } from '../utils/strings';
import { sum, last, max, min, reverseRows, sortNumbers, splitToChunks, transpose } from '../utils/arrays';


const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

class Vector {
    constructor(readonly y: number, readonly x: number) { }

    plus(o: Vector): Vector {
        return new Vector(this.y + o.y, this.x + o.x);
    }

    toString() {
        return `${this.y},${this.x}`;
    }

    static parse(str: string): Vector {
        let [y, x] = str.split(',').map(n => Number(n));
        return new Vector(y, x);
    }
}

class Elf {
    constructor(public position: Vector) { }
}

function getElves(input: string): Elf[] {
    let elves = new Array<Elf>();

    let map = splitStringMatrix(input, '\n', '');
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x] === '#') {
                elves.push(new Elf(new Vector(y, x)));
            }
        }
    }
    return elves;
}

let N = new Vector(-1, 0);
let E = new Vector(0, 1);
let S = new Vector(1, 0);
let W = new Vector(0, -1);
let NE = N.plus(E);
let SE = S.plus(E);
let NW = N.plus(W);
let SW = S.plus(W);
let CENTER = new Vector(0, 0);


function makeRule(adjacents: Vector[], suggestDirection: Vector): (elf: Elf, occupied: Set<string>) => [boolean, Vector] {
    return (elf: Elf, occupied: Set<string>) => {
        let adjacentsEmpty = adjacents.every(adjacent => {
            return !occupied.has(`${elf.position.plus(adjacent)}`);
        });

        return [adjacentsEmpty, elf.position.plus(suggestDirection)];
    }
}



let firstRule = makeRule([N, E, S, W, NE, SE, NW, SW], CENTER);

/*
  If there is no Elf in the N, NE, or NW adjacent positions, the Elf proposes moving north one step.
  If there is no Elf in the S, SE, or SW adjacent positions, the Elf proposes moving south one step.
  If there is no Elf in the W, NW, or SW adjacent positions, the Elf proposes moving west one step.
  If there is no Elf in the E, NE, or SE adjacent positions, the Elf proposes moving east one step.
  */
let rules = [
    makeRule([N, NE, NW], N),
    makeRule([S, SE, SW], S),
    makeRule([W, NW, SW], W),
    makeRule([E, NE, SE], E),
];


let elves = getElves(puzzleInput);

for (let i = 0; i < 10; i++) {
    let occupied = new Set(elves.map(e => e.position.toString()));
    let proposals: { [key: string]: Elf | null } = {};

    elves.forEach((elf) => {
        /* "If no other Elves are in one of those eight positions, the Elf does not do anything during this round." */
        let [noNeighbors, noMove] = firstRule(elf, occupied);
        if (noNeighbors) {
            return;
        }

        /* "Otherwise, the Elf looks in each of four directions in the following order and proposes moving one step in the first valid direction" */
        for (let rule of rules) {
            let [ok, destination] = rule(elf, occupied);

            if (ok) {
                let v = destination.toString();
                // proposed by another elf, so neither can move there
                proposals[v] = (v in proposals) ? null : elf;
                return;
            }
        }
    });

    /* After each Elf has had a chance to propose a move, the second half of the
     * round can begin.Simultaneously, each Elf moves to their proposed destination
     * tile if they were the only Elf to propose moving to that position.If two or
     * more Elves propose moving to the same position, none of those Elves move.*/

    Object.entries(proposals)
        .filter(([vector, elf]) => elf !== null)
        .forEach(([vector, elf]) => {
            let v = Vector.parse(vector);
            elf!.position = v;
        });

    /** at the end of the round, the first direction the Elves considered is moved to the end of the list of directions. */
    let first = rules.shift()!;
    rules.push(first);
}


for (let e of elves) {
    console.log(e.position);
}

/**
 * "Simulate the Elves' process and find the smallest rectangle that contains the Elves after 10 rounds.
 * How many empty ground tiles does that rectangle contain?"
 */
let x = sortNumbers(elves.map(e => e.position.x));
let y = sortNumbers(elves.map(e => e.position.y));

let width = last(x) - x[0] + 1;
let height = last(y) - y[0] + 1;

console.log({ width, height, area: width * height, elves: elves.length });

console.log(width * height - elves.length);