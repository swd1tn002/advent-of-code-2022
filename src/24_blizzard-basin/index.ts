import path from 'path';
import { readFileSync } from 'fs';
import { splitStringMatrix, } from '../utils/strings';
import { first, last } from '../utils/arrays';
import Circle from '../utils/Circle';


const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

type Direction = '^' | 'v' | '<' | '>';
type TimeAndLocation = [number, Coord];

/**
 * "blizzards are drawn with an arrow indicating their direction of motion:
 * up (^), down (v), left (<), or right (>)."
 */
const moves = Object.freeze({
    '<': [0, -1],
    '>': [0, 1],
    '^': [- 1, 0],
    'v': [1, 0]
});

class Coord {
    readonly str: string;

    constructor(
        readonly y: number,
        readonly x: number) {
        this.str = `${this.y},${this.x}`;
    }

    eq(o: Coord): boolean {
        return this.x === o.x && this.y === o.y;
    }
    get up() {
        return new Coord(this.y - 1, this.x);
    }
    get down() {
        return new Coord(this.y + 1, this.x);
    }
    get left() {
        return new Coord(this.y, this.x - 1);
    }
    get right() {
        return new Coord(this.y, this.x + 1);
    }
}

class Blizzard {
    readonly path: Circle<Coord>;

    constructor(readonly char: Direction, readonly start: Coord, readonly map: Map) {
        this.path = this.buildPath();
    }

    /** Returns the position of this blizzard at the given time. */
    position(time: number) {
        return this.path.get(time);
    }

    /** Builds a circular array of positions which this blizzard loops through. */
    private buildPath() {
        let [dY, dX] = moves[this.char];
        let path = new Array<Coord>();

        /* "Due to conservation of blizzard energy, as a blizzard reaches
        * the wall of the valley, a new blizzard forms on the opposite side
        * of the valley moving in the same direction. " */
        let next = this.start;
        do {
            if (!this.map.hasWall(next)) {
                path.push(next);
            }

            let y = (dY + next.y + this.map.height) % this.map.height;
            let x = (dX + next.x + this.map.width) % this.map.width;

            next = new Coord(y, x);
        } while (!next.eq(this.start));

        return new Circle(path);
    }
}

/**
 * "As the expedition reaches a valley that must be traversed to reach the extraction
 * site, you find that strong, turbulent winds are pushing small blizzards of snow and
 * sharp ice around the valley."
 */
class Map {
    readonly start: Coord;
    readonly end: Coord;
    readonly blizzards: Blizzard[];
    readonly height: number;
    readonly width: number;

    constructor(readonly grid: string[][]) {
        this.height = grid.length;
        this.width = grid[0].length;

        /* "Your expedition begins in the only non-wall position in the top row
         * and needs to reach the only non-wall position in the bottom row." */
        this.start = new Coord(0, first(grid).indexOf('.'));
        this.end = new Coord(this.height - 1, last(grid).indexOf('.'));

        this.blizzards = this.createBlizzards(grid);
    }

    has(coord: Coord): boolean {
        return (0 <= coord.x && coord.x < this.width && 0 <= coord.y && coord.y < this.height);
    }

    /** "The walls of the valley are drawn as #; everything else is ground." */
    hasWall(c: Coord): boolean {
        return this.grid[c.y][c.x] === '#';
    }

    /**
     * "Blizzards are drawn with an arrow indicating their direction of motion:
     * up (^), down (v), left (<), or right (>)."
     */
    private createBlizzards(grid: string[][]): Blizzard[] {
        let blizzards = new Array<Blizzard>();

        grid.forEach((row, y) => {
            row.forEach((char, x) => {
                let coord = new Coord(y, x);
                switch (char) {
                    case '<':
                    case '>':
                    case '^':
                    case 'v':
                        blizzards.push(new Blizzard(char, coord, this));
                        break;
                    case '#':
                    case '.':
                        // walls and empty spots
                        break;
                    default:
                        throw new Error(`Unknown character ${char}`);
                }
            });
        });
        return blizzards;
    }
}

class TimeAndLocationQueue {
    readonly visited: Set<string> = new Set();
    readonly queue: TimeAndLocation[] = [];
    private readonly keysInQueue: Set<string> = new Set();

    /** Returns and removes the next TimeAndLocation from the queue. */
    pop() {
        let n = this.queue.reduce((min, current) => min[0] < current[0] ? min : current, first(this.queue));
        this.queue.splice(this.queue.indexOf(n), 1);

        let key = this.key(n);
        this.keysInQueue.delete(key);
        this.visited.add(key);
        return n;
    }

    add(timeAndLoc: TimeAndLocation) {
        let key = this.key(timeAndLoc);

        // add to queue only if the time and location is not visited nor queued
        if (!this.visited.has(key) && !this.keysInQueue.has(key)) {
            this.queue.push(timeAndLoc);
            this.keysInQueue.add(key);
        }
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }

    private key(timeAndLoc: TimeAndLocation) {
        return `${timeAndLoc[1].str},${timeAndLoc[0]}`;

    }
}

function findWayAndAvoidBlizzards(map: Map, time: number, from: Coord, to: Coord): number {
    let queue = new TimeAndLocationQueue();
    queue.add([time, from]);

    while (!queue.isEmpty()) {
        let [time, location] = queue.pop();

        if (location.eq(to)) {
            return time;
        }

        if (map.hasWall(location)) {
            continue;
        }

        if (map.blizzards.some(blizzard => blizzard.position(time).eq(location))) {
            continue;
        }

        // Get all adjacent positions (and the current position) that are on the map.
        let directions = [
            location.down, location.up, location.left, location.right, location
        ].filter(c => map.has(c));

        // Continue expanding to all directions (and standing still) with the next timestamp
        directions.forEach(coord => queue.add([time + 1, coord]));
    }

    throw new Error(`Could not find route from ${from} to ${to}.`);
}

function main() {
    let grid = splitStringMatrix(puzzleInput, '\n', '');
    let map = new Map(grid);

    let part1 = findWayAndAvoidBlizzards(map, 0, map.start, map.end); // 292
    console.log(`Part 1: the fewest number of minutes required is ${part1}.`);

    let part2a = findWayAndAvoidBlizzards(map, part1, map.end, map.start); // 533
    let part2b = findWayAndAvoidBlizzards(map, part2a, map.start, map.end); // 816
    console.log(`Part 2: the fewest number of minutes required is ${part2b}.`)
}

main();
