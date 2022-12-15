import path from 'path';
import { readFileSync } from 'fs';
import { splitStringMatrix } from '../utils/strings';
import { max, zip } from '../utils/arrays';
import { maxOne } from '../utils/numbers';

/* "You scan a two-dimensional vertical slice of the cave above you (your puzzle input)
 * and discover that it is mostly air with structures made of rock. */
const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
let pathInput = splitStringMatrix(puzzleInput, '\n', ' -> ');

enum Material { AIR, SAND, ROCK };

class Cave {
    private materials: { [key: string]: Material } = {};

    get(p: Point): Material {
        return this.materials[`${p}`] ?? Material.AIR;
    }

    set(p: Point, m: Material) {
        this.materials[`${p}`] = m;
    }

    countSand(): number {
        return Object.values(this.materials).filter(m => m === Material.SAND).length;
    }
}

class Point {
    constructor(public y: number, public x: number) { }

    static parse(input: string): Point {
        let [x, y] = input.split(',').map(Number);
        return new Point(y, x);
    }

    toString(): string {
        return `${this.y},${this.x}`;
    }

    down(): Point {
        return new Point(this.y + 1, this.x);
    }

    left(): Point {
        return new Point(this.y, this.x - 1);
    }

    right(): Point {
        return new Point(this.y, this.x + 1);
    }

    stepTo(target: Point): Point {
        let stepX = maxOne(target.x - this.x);
        let stepY = maxOne(target.y - this.y);
        return new Point(this.y + stepY, this.x + stepX);
    }
}

/**
 * "Your scan traces the path of each solid rock structure and reports the x,y coordinates that
 * form the shape of the path, where x represents distance to the right and y represents distance
 * down. Each path appears as a single line of text in your scan. After the first point of each
 * path, each point indicates the end of a straight horizontal or vertical line to be drawn from
 * the previous point. For example:
 *
 * 498,4 -> 498,6 -> 496,6
 * 503,4 -> 502,4 -> 502,9 -> 494,9"
 */
function buildCave(paths: Point[][]): Cave {
    let cave: Cave = new Cave();
    for (let path of paths) {
        tracePath(cave, path);
    }
    return cave;
}

/**
 * "After the first point of each path, each point indicates the end of a
 * straight horizontal or vertical line to be drawn from the previous point."
 */
function tracePath(cave: Cave, path: Point[]) {
    let pairs = zip(path.slice(0, -1), path.slice(1));

    for (let [from, to] of pairs) {
        let current = from;

        while (current.x !== to.x || current.y !== to.y) {
            cave.set(current, Material.ROCK);
            current = current.stepTo(to);
        }
        cave.set(to, Material.ROCK);
    }
}

/**
 * "A unit of sand always falls down one step if possible. If the tile immediately below is
 * blocked (by rock or sand), the unit of sand attempts to instead move diagonally one step
 * down and to the left. If that tile is blocked, the unit of sand attempts to instead move
 * diagonally one step down and to the right. Sand keeps moving as long as it is able to do so,
 * at each step trying to move down, then down-left, then down-right. If all three possible
 * destinations are blocked, the unit of sand comes to rest and no longer moves"
 *
 * @returns true if the sand was able to rest at any position
 */
function dropGrain(grid: Cave, position: Point, floor: number, passesTheFloor: boolean): boolean {
    if (grid.get(position) !== Material.AIR) {
        return false; // position is already occupied
    }

    if (passesTheFloor && position.y > floor) {
        return false; // went through floor
    }

    if (!passesTheFloor && position.y + 1 === floor) {
        grid.set(position, Material.SAND);
        return true; // sand hit the floor and rests
    }

    let [fallLeft, fallDown, fallRight] = [position.down().left(), position.down(), position.down().right()];

    if (grid.get(fallDown) === Material.AIR) {
        return dropGrain(grid, fallDown, floor, passesTheFloor);
    }
    if (grid.get(fallLeft) === Material.AIR) {
        return dropGrain(grid, fallLeft, floor, passesTheFloor);
    }
    if (grid.get(fallRight) === Material.AIR) {
        return dropGrain(grid, fallRight, floor, passesTheFloor);
    }

    // could not fall further down, so set the sand rests in the current point
    grid.set(position, Material.SAND);
    return true;

}



function main() {
    const paths = pathInput.map(row => row.map(p => Point.parse(p)));
    let height = max(paths.flat().map(p => p.y));

    const cave: Cave = buildCave(paths);

    // "The sand is pouring into the cave from point 500,0."
    const dropPoint = new Point(0, 500);

    /* "Sand is produced one unit at a time, and the next unit of sand is not
     * produced until the previous unit of sand comes to rest." */
    while (dropGrain(cave, dropPoint, height, true)) {
        // repeats until all further sand flows out the bottom, falling into the endless void
    }

    console.log('Part 1: there are', cave.countSand(), 'grains of sand.'); // 825


    // "You don't have time to scan the floor, so assume the floor is an infinite horizontal line
    // with a y coordinate equal to two plus the highest y coordinate of any point in your scan."
    let floor = height + 2;
    while (dropGrain(cave, dropPoint, floor, false)) {
        // repeats until a unit of sand comes to rest at 500,0, blocking the source entirely and
        // stopping the flow of sand into the cave.
    }

    console.log('Part 2: there are', cave.countSand(), 'grains of sand.'); // 26729
}

main();
