import path from 'path';
import { readFileSync } from 'fs';
import Circle from '../utils/Circle';

type Direction = [number, number];
type Coord = [number, number];
const directions = new Circle<Direction>([[0, 1], [1, 0], [0, -1], [-1, 0]]);
const [RIGHT, DOWN, LEFT, UP] = directions.content;

interface Side {
    position: Coord,
    right?: Neighbor;
    down?: Neighbor;
    left?: Neighbor;
    up?: Neighbor;
}

interface Neighbor {
    id: number,
    rotation: 0 | 1 | 2 | 3;
}

/**
 * "You approach the strange input device, but it isn't quite what the monkeys drew in their notes. Instead,
 * you are met with a large cube; each of its six faces is a square of 50x50 tiles."
 *
 * "To be fair, the monkeys' map does have six 50x50 regions on it. If you were to carefully fold
 * the map, you should be able to shape it into a cube!"
 */
const sides: { [key: number]: Side } = {
    1: {
        position: [0, 50],
        left: { id: 4, rotation: 2 },
        up: { id: 5, rotation: 3 }
    },
    2: {
        position: [50, 50],
        right: { id: 6, rotation: 1 },
        left: { id: 4, rotation: 1 },
    },
    3: {
        position: [100, 50],
        right: { id: 6, rotation: 2 },
        down: { id: 5, rotation: 3 },
    },
    4: {
        position: [100, 0],
        left: { id: 1, rotation: 2 },
        up: { id: 2, rotation: 3 }
    },
    5: {
        position: [150, 0],
        right: { id: 3, rotation: 1 },
        down: { id: 6, rotation: 0 },
        left: { id: 1, rotation: 1 },
    },
    6: {
        position: [0, 100],
        right: { id: 3, rotation: 2 },
        down: { id: 2, rotation: 3 },
        up: { id: 5, rotation: 0 }
    }
};

/**
 * "You approach the strange input device, but it isn't quite what the monkeys drew in their notes. Instead,
 * you are met with a large cube; each of its six faces is a square of 50x50 tiles."
 */
class MonkeyCube {
    position: Coord;
    direction = directions.get(0); // "Initially, you are facing to the right"
    static width = 50;

    constructor(readonly map: String[]) {
        // "You begin the path in the leftmost open tile of the top row of tiles."
        this.position = [0, map[0].indexOf('.')];
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
            let [coord, dir] = this.getNextMove(this.position);
            let char = this.map[coord[0]]?.[coord[1]];

            if (char === '#') {
                // hit wall, do not move
                return;
            } else if (char === '.') {
                // empty coordinate, store the position and direction and keep looping
                this.position = coord;
                this.direction = dir;
            } else {
                throw new Error(`Cannot move from ${this.position} to ${coord} that contains '${char}'.`);
            }
        }
    }

    private getNextMove([y, x]: Coord): [Coord, Direction] {
        let [dy, dx] = this.direction;
        let [y2, x2] = [y + dy, x + dx];

        let destination = this.map[y2]?.[x2];
        if (['.', '#'].includes(destination)) {
            // can move without rotating the cube
            return [[y2, x2], this.direction];
        }

        // The coordinate is out of bounds of the
        // current side and the cube needs to be rotated.
        let currentSide = this.getSide([y, x]);

        let n: Neighbor = currentSide.right as Neighbor;
        switch (this.direction) {
            case RIGHT:
                n = currentSide.right as Neighbor;
                break;

            case DOWN:
                n = currentSide.down as Neighbor
                break;

            case LEFT:
                n = currentSide.left as Neighbor
                break;

            case UP:
                n = currentSide.up as Neighbor
                break;
        }

        return MonkeyCube.stepInAndRotate(this.direction, [y2, x2], currentSide, sides[n.id], n.rotation);
    }

    /** Returns the side where given coordinates are located. */
    getSide([y, x]: Coord): Side {
        for (let side of Object.values(sides)) {
            let [sideY, sideX] = side.position;
            if (sideX <= x && x < sideX + MonkeyCube.width && sideY <= y && y < sideY + MonkeyCube.width) {
                return side;
            }
        }
        throw new Error(`No side for ${[y, x]}`);
    }

    /**
     * "Now, if you would walk off the board, you instead proceed around the cube.
     * From the perspective of the map, this can look a little strange."
     *
     * The given coord is not within the toSide, so the coordinates fromSide and toSide need
     * to be adjusted, so that it will appear in the right coordinate of the toSide with the
     * correct direction.
     */
    private static stepInAndRotate(dir: Direction, coord: Coord, fromSide: Side, toSide: Side, rotation: number): [Coord, Direction] {
        // the coordinate relative to the starting Side
        let [y0, x0] = [(coord[0] + MonkeyCube.width) % MonkeyCube.width, (coord[1] + MonkeyCube.width) % MonkeyCube.width];

        // rotate the starting coordinate counterclockwise until it matches the toSide orientation
        for (let i = 0; i < rotation; i++) {
            dir = directions.previous(dir);
            [y0, x0] = MonkeyCube.rotateLeft([y0, x0]);
        }

        // add the absolute position of the target side to the relative coordinates calculated above
        return [[toSide.position[0] + y0, toSide.position[1] + x0], dir];
    }

    /** Rotates the given edge coordinates counterclocwise around the edge of a single cube side. */
    private static rotateLeft(coord: Coord): Coord {
        let [y, x] = coord;
        if (y === 0) {
            return [MonkeyCube.width - x - 1, 0];
        }
        if (y === MonkeyCube.width - 1) {
            return [MonkeyCube.width - x - 1, MonkeyCube.width - 1];
        }
        if (x === 0) {
            return [MonkeyCube.width - 1, y];
        }
        if (x === MonkeyCube.width - 1) {
            return [0, y];
        }
        throw new Error(`Could not rotate ${coord}`);
    }
}


/** "The final password is the sum of 1000 times the row, 4 times the column, and the facing." */
function getPassword(map: MonkeyCube): number {
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

    /* Path you must follow, for example: ['13', 'R', '45', 'L', '12', 'R', '11', 'L', '47', 'L', '32'] */
    let route: string[] = [...<RegExpMatchArray>routeInput.match(/[a-zA-Z]+|[0-9]+/g)];

    /**
     * "You approach the strange input device, but it isn't quite what the monkeys drew in their notes. Instead,
     * you are met with a large cube; each of its six faces is a square of 50x50 tiles."
     * "To be fair, the monkeys' map does have six 50x50 regions on it. If you were to carefully fold
     * the map, you should be able to shape it into a cube!"
     */
    let cube = new MonkeyCube(mapInput.split('\n'));

    for (let x of route) {
        if (['L', 'R'].includes(x)) {
            cube.turn(x);
        } else {
            let count = Number(x);
            cube.move(count);
        }
    }

    console.log(`Part 2: the password is ${getPassword(cube)}`); // 95316
}

main();
