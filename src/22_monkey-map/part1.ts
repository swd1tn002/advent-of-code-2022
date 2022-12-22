import path from 'path';
import { readFileSync } from 'fs';
import Circle from '../utils/Circle';

const directions = new Circle<[number, number]>([[0, 1], [1, 0], [0, -1], [-1, 0]]);

class MonkeyMap {
    position: [number, number];
    direction = directions.get(0); // "Initially, you are facing to the right"
    readonly width: number;
    readonly height: number;

    constructor(readonly map: String[]) {
        // "You begin the path in the leftmost open tile of the top row of tiles."
        this.position = [0, map[0].indexOf('.')];
        this.height = map.length;
        this.width = map[0].length;
    }

    /**
     * "A letter indicates whether to turn 90 degrees clockwise (R) or
     * counterclockwise (L). Turning happens in-place; it does not change
     * your current tile."
     */
    turn(str: string) {
        if (str === 'R') {
            this.direction = directions.next(this.direction);
            return;
        }
        if (str === 'L') {
            this.direction = directions.previous(this.direction);
            return;
        }
        throw new Error(`Invalid direction ${str}`);
    }

    /**
     * "A number indicates the number of tiles to move in the direction you are facing.
     * If you run into a wall, you stop moving forward and continue with the next instruction."
     */
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

/** "The final password is the sum of 1000 times the row, 4 times the column, and the facing." */
function getPassword(map: MonkeyMap): number {
    let [row, col] = map.position;
    let facing = directions.content.indexOf(map.direction);

    return 1000 * (row + 1) + 4 * (col + 1) + facing;
}

function main() {
    /*
     * "The first half of the monkeys' notes is a map of the board. It is comprised of a set of open tiles
     * (on which you can move, drawn .) and solid walls (tiles which you cannot enter, drawn #)."
     *
     * "The second half is a description of the path you must follow. It consists of alternating numbers and letters."
     */
    const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
    let [mapInput, routeInput] = puzzleInput.split('\n\n');

    let map = new MonkeyMap(mapInput.split('\n'));

    /* Path you must follow, for example: ['13', 'R', '45', 'L', '12', 'R', '11', 'L', '47', 'L', '32'] */
    let route: string[] = [...<RegExpMatchArray>routeInput.match(/[a-zA-Z]+|[0-9]+/g)];

    for (let x of route) {
        if (['L', 'R'].includes(x)) {
            map.turn(x);
        } else {
            let count = Number(x);
            map.move(count);
        }
    }

    console.log(`Part 1: the password is ${getPassword(map)}`); // 165094
}

main();
