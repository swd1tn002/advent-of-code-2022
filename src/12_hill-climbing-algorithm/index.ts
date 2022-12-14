import path from 'path';
import { readFileSync } from 'fs';
import { splitStringMatrix } from '../utils/strings';
import { min } from '../utils/arrays';

class Square {
    readonly elevation: number;
    public distanceToEnd = Infinity;

    constructor(readonly y: number, readonly x: number, char: string) {

        this.elevation = this.getElevation(char);
    }

    private getElevation(char: string): number {
        // Starting position (S) has elevation a, and the location that
        // should get the best signal (E) has elevation z.
        return char.replace('S', 'a').replace('E', 'z').charCodeAt(0) - 'a'.charCodeAt(0);
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
    let { y, x } = square;
    let neighbors: Square[] = [
        grid[y - 1]?.[x], grid[y + 1]?.[x],
        grid[y][x - 1], grid[y][x + 1]
    ].filter(n => n !== undefined);

    return neighbors.filter(n => n.elevation >= square.elevation - 1);
}

/**
 * This function uses Dijkstra's algorithm to find the distances to all
 * other squares on the grid from the given square.
 */
function updateDistancesFrom(grid: Square[][], from: Square) {
    let queue = grid.flat();
    from.distanceToEnd = 0;

    while (queue.length > 0) {
        let closest = queue.reduce((s1, s2) => s1.distanceToEnd < s2.distanceToEnd ? s1 : s2, queue[0]);
        queue = queue.filter(s => s !== closest);

        // update `current distance + 1` to neighbors that are still unvisited
        getAccessibleNeighbors(grid, closest)
            .filter(n => queue.includes(n))
            .forEach(neighbor => neighbor.distanceToEnd = closest.distanceToEnd + 1);
    }
}

function main() {
    const puzzleInput = readFileSync(path.join(__dirname, '/input.txt'), 'utf-8');
    let heightMap: string[][] = splitStringMatrix(puzzleInput, '\n', '');
    let chars = heightMap.flat();

    let grid = heightMap.map((row, y) => row.map((char, x) => new Square(y, x, char)));
    let squares = grid.flat();

    let start = squares[chars.indexOf('S')];
    let end = squares[chars.indexOf('E')];

    /* In this implementation we find the path from the end to all possible starting
    * squares. This way we don't have to repeat path finding for part 2. */
    updateDistancesFrom(grid, end);

    /* "What is the fewest steps required to move from your current position to the
     * location that should get the best signal?" */
    console.log('Part 1: the distance is', start.distanceToEnd);

    /* "What is the fewest steps required to move starting from any square with
     * elevation a (0) to the location that should get the best signal?" */
    let startCandidates = squares.filter(s => s.elevation === 0).map(s => s.distanceToEnd);

    console.log('Part 2: the minimum distance is', min(startCandidates));
}

main();
