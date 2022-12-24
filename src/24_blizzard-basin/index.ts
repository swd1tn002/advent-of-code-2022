import path from 'path';
import { readFileSync } from 'fs';
import { splitLines, splitStringMatrix, splitNumberMatrix, extractNumber, extractNumbers } from '../utils/strings';
import { sum, first, last, max, min, reverseRows, sortNumbers, splitToChunks, transpose } from '../utils/arrays';
import Circle from '../utils/Circle';


const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

type Direction = '^' | 'v' | '<' | '>';

const moves = Object.freeze({
    '<': [0, -1],
    '>': [0, 1],
    '^': [- 1, 0],
    'v': [1, 0]
});

class Coord {
    constructor(readonly y: number, readonly x: number) { }

    eq(o: Coord): boolean {
        return this.x === o.x && this.y === o.y;
    }
}

class Blizzard {
    coords: Circle<Coord>;

    constructor(
        readonly char: Direction,
        start: Coord,
        grid: string[][]) {

        let height = grid.length;
        let width = grid[0].length;

        let all = [start];
        let [dY, dX] = moves[char];
        let next = start;

        while (true) {
            let y = (dY + next.y + height) % height;
            let x = (dX + next.x + width) % width;

            next = new Coord(y, x);
            if (next.eq(start)) {
                break;
            }

            if (grid[y][x] !== '#') {
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
    walls: Set<Coord> = new Set();
    start: Coord;
    end: Coord;
    blizzards: Blizzard[] = [];

    constructor(grid: string[][]) {
        this.start = new Coord(0, first(grid).indexOf('.'));
        this.end = new Coord(grid.length - 1, last(grid).indexOf('.'));

        grid.forEach((row, y) => {
            row.forEach((char, x) => {
                let coord = new Coord(y, x);
                switch (char) {
                    case '#':
                        this.walls.add(coord);
                        break;
                    case '<':
                    case '>':
                    case '^':
                    case 'v':
                        this.blizzards.push(new Blizzard(char, coord, grid));
                        break;
                    case '.':
                        break; // empty
                    default:
                        throw new Error(`Unknown character ${char}`);
                }
            });
        });
    }
}

let grid = splitStringMatrix(puzzleInput, '\n', '');
let map = new Map(grid);

console.log(first(map.blizzards).coords);