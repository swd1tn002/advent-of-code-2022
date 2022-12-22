import path from 'path';
import { readFileSync } from 'fs';
import { splitLines, splitStringMatrix, splitNumberMatrix, extractNumber, extractNumbers } from '../utils/strings';
import { sum, last, max, min, reverseRows, sortNumbers, splitToChunks, transpose, zip } from '../utils/arrays';
import Circle from '../utils/Circle';


const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

const directions = new Circle<[number, number]>([[0, 1], [1, 0], [0, -1], [-1, 0]]);

class Map {
    position: [number, number];
    direction = directions.get(0);
    readonly width: number;
    readonly height: number;

    constructor(readonly map: String[]) {
        // "You begin the path in the leftmost open tile of the top row of tiles."
        this.position = [0, map[0].indexOf('.')];
        this.height = map.length;
        this.width = map[0].length;
    }

    turn(str: string) {
        if (str === 'R') {
            this.direction = directions.next(this.direction);
        } else if (str === 'L') {
            this.direction = directions.previous(this.direction);
        } else {
            throw new Error(`Invalid direction ${str}`);
        }
    }

    move(count: number) {
        for (let i = 0; i < count; i++) {
            let [y2, x2] = this.nextSolid(this.position);

            let char = this.map[y2][x2];

            switch (char) {
                case '#':
                    return; // hit wall
                case '.':
                    this.position = [y2, x2];
                    break;
            }
        }
    }

    /**
     * Returns the next y,x coordinate taking into account the current position and direction
     * and wrapping around the map as necessary. The resulting coordinate will always contain
     * either an empty slot '.' or wall '#'.
     */
    nextSolid([y, x]: [number, number]): [number, number] {
        let [dy, dx] = this.direction;
        let [y2, x2] = [(y + dy + this.height) % this.height, (x + dx + this.width) % this.width];

        let char2 = this.map[y2]?.[x2];
        if ('.#'.includes(char2)) {
            return [y2, x2];
        } else {
            return this.nextSolid([y2, x2]);
        }
    }
}

let [mapInput, routeInput] = puzzleInput.split('\n\n');
console.log({ map: mapInput, route: routeInput });

let route: string[] = [...<RegExpMatchArray>routeInput.match(/[a-zA-Z]+|[0-9]+/g)];
console.log(route);

let map = new Map(mapInput.split('\n'));

for (let x of route) {
    if (['L', 'R'].includes(x)) {
        map.turn(x);
    } else {
        let count = Number(x);
        map.move(count);
    }
}

console.log(map.position, map.direction);

/** "The final password is the sum of 1000 times the row, 4 times the column, and the facing." */
function getPassword(map: Map): number {
    let [row, col] = map.position;
    let facing = directions.content.indexOf(map.direction);

    return 1000 * (row + 1) + 4 * (col + 1) + facing;
}

console.log(`Part 1: the password is ${getPassword(map)}`);