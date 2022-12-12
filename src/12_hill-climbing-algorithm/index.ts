import path from 'path';
import { readFileSync } from 'fs';
import { splitStringMatrix } from '../utils/strings';
import { min } from '../utils/arrays';

const puzzleInput = readFileSync(path.join(__dirname, '/input.txt'), 'utf-8');
let heightMap: string[][] = splitStringMatrix(puzzleInput, '\n', '');

class Square {
    x: number;
    y: number;
    elevation: number;
    isStart: boolean = false;
    isEnd: boolean = false;
    distance = Infinity;

    constructor(y: number, x: number, char: string) {
        this.y = y;
        this.x = x;

        // Your current position (S) has elevation a, and the location that
        // should get the best signal(E) has elevation z.
        switch (char) {
            case 'S':
                char = 'a';
                this.isStart = true;
                break;
            case 'E':
                char = 'z'
                this.isEnd = true;
                break;
        }
        this.elevation = char.charCodeAt(0) - 'a'.charCodeAt(0);
    }
}

/**
 * "During each step, you can move exactly one square up, down, left, or right.
 * To avoid needing to get out your climbing gear, the elevation of the destination
 * square can be at most one higher than the elevation of your current square."
 *
 * In this implementation we find the path from the end to all possible starting
 * squares, so the accessibility from given square is checked *DOWNHILL* instead
 * of uphill.
 */
function getAccessibleNeighbors(grid: Square[][], square: Square): Square[] {
    let neighbors: Square[] = [
        grid[square.y - 1]?.[square.x], // top
        grid[square.y + 1]?.[square.x], // bottom
        grid[square.y][square.x - 1], // left
        grid[square.y][square.x + 1] // right
    ];
    return neighbors.filter(n => n && n.elevation >= square.elevation - 1);
}

/**
 * Used Dijkstra's algorithm to find the distances to all other squares on the grid
 * from the given starting square.
 */
function updateDistancesFrom(grid: Square[][], square: Square) {
    let queue = grid.flat();
    queue.forEach(s => s.distance = Infinity);
    square.distance = 0;

    while (queue.length > 0) {
        let next = queue.reduce((s1, s2) => s1.distance < s2.distance ? s1 : s2, queue[0]);
        queue = queue.filter(s => s !== next);

        for (let neighbor of getAccessibleNeighbors(grid, next).filter(n => queue.includes(n))) {
            let newDistance = next.distance + 1;
            if (newDistance < neighbor.distance) {
                neighbor.distance = newDistance;
            }
        }
    }
}

function main() {

    let grid = heightMap.map((row, y) => row.map((char, x) => new Square(y, x, char)));
    let squares = grid.flat();

    let start = squares.find(s => s.isStart) as Square;
    let end = squares.find(s => s.isEnd) as Square;

    /* In this implementation we find the path from the end to all possible starting
    * squares. This way we don't have to repeat path finding for part 2. */
    updateDistancesFrom(grid, end);

    /* "What is the fewest steps required to move from your current position to the
     * location that should get the best signal?" */
    console.log('Part 1: the distance is', start.distance);

    /* "What is the fewest steps required to move starting from any square with
     * elevation a (0) to the location that should get the best signal? */
    let startCandidates = squares.filter(s => s.elevation === 0).map(s => s.distance);

    console.log('Part 2: the minimum distance is', min(startCandidates));
}

main();
