import path from 'path';
import { readFileSync } from 'fs';
import { splitLines, splitStringMatrix, splitNumberMatrix, extractNumber, extractNumbers } from '../utils/strings';
import { sum, first, last, max, min, reverseRows, sortNumbers, splitToChunks, transpose, empty } from '../utils/arrays';
import Circle from '../utils/Circle';


const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

type Direction = '^' | 'v' | '<' | '>';
type TimeAndLocation = [number, Coord];

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
    coords: Circle<Coord>;

    constructor(
        readonly char: Direction,
        start: Coord,
        map: Map) {

        let all = [start];
        let [dY, dX] = moves[char];
        let next = start;

        while (true) {
            let y = (dY + next.y + map.height) % map.height;
            let x = (dX + next.x + map.width) % map.width;

            next = new Coord(y, x);
            if (next.eq(start)) {
                break;
            }

            if (map.grid[y][x] !== '#') {
                all.push(next);
            }
        }

        this.coords = new Circle(all);
    }

    position(time: number) {
        return this.coords.get(time);
    }
}

class Map {
    walls: Set<string> = new Set();
    readonly start: Coord;
    readonly end: Coord;
    readonly blizzards: Blizzard[] = [];
    readonly height: number;
    readonly width: number;

    constructor(readonly grid: string[][]) {

        this.start = new Coord(0, first(grid).indexOf('.'));
        this.end = new Coord(grid.length - 1, last(grid).indexOf('.'));

        this.height = grid.length;
        this.width = grid[0].length;

        grid.forEach((row, y) => {
            row.forEach((char, x) => {
                let coord = new Coord(y, x);
                switch (char) {
                    case '#':
                        this.walls.add(coord.str);
                        break;
                    case '<':
                    case '>':
                    case '^':
                    case 'v':
                        this.blizzards.push(new Blizzard(char, coord, this));
                        break;
                    case '.':
                        break; // empty
                    default:
                        throw new Error(`Unknown character ${char}`);
                }
            });
        });
        Object.freeze(this.blizzards);
        Object.freeze(this.walls);
    }
}



function findWayToEnd(map: Map, time: number, from: Coord, to: Coord): number {
    // initially just the starting location
    let queue: TimeAndLocation[] = [[time, from]];
    let visited = new Set<string>();
    let lastTime = time;

    while (!empty(queue)) {
        let next = queue.reduce((min, current) => min[0] < current[0] ? min : current, first(queue));
        queue.splice(queue.indexOf(next), 1);

        let [time, location] = next;
        let key = `${location.str},${time}`;

        if (time !== lastTime) {
            console.log({ time, location });
        }
        lastTime = time;

        if (visited.has(key)) {
            continue;
        }
        visited.add(key);

        if (location.eq(to)) {
            return time;
        }
        // hit wall?
        if (map.walls.has(location.str)) {
            continue;
        }

        // hit blizzard?
        let blizzard = map.blizzards.some(blizzard => blizzard.position(time).eq(location));
        if (blizzard) {
            continue;
        }

        if (location.y < map.height) {
            queue.push([time + 1, location.down]); // down
        }

        if (location.x < map.width - 2) {
            queue.push([time + 1, location.right]); // right
        }

        if (location.x > 1) {
            queue.push([time + 1, location.left]); // left
        }

        queue.push([time + 1, location]); // still

        if (location.y > 0) {
            queue.push([time + 1, location.up]); // up
        }
    }
    return -1;
}

function main() {
    let grid = splitStringMatrix(puzzleInput, '\n', '');
    let map = new Map(grid);

    let part1 = findWayToEnd(map, 0, map.start, map.end); // 292
    let part2a = findWayToEnd(map, part1, map.end, map.start); // 533
    let part2b = findWayToEnd(map, part2a, map.start, map.end); // 816
    console.log({ part1, part2a, part2b });
}

main();
