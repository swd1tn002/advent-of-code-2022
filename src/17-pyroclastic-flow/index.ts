import path from 'path';
import { readFileSync } from 'fs';
import { splitLines, splitStringMatrix, splitNumberMatrix, extractNumber, extractNumbers } from '../utils/strings';
import { sum, last, max, min, reverseRows, sortNumbers, splitToChunks, transpose, equal } from '../utils/arrays';
import Circle from '../utils/Circle';
import { getSystemErrorMap } from 'util';

class Rock {
    public readonly parts = new Array<string>();
    public readonly width: number = 0;
    public readonly height: number = 0;
    public readonly maxY: number = 0;

    constructor(public minY: number, public minX: number, public shape: string) {
        let lines = shape.split('\n').reverse();
        this.maxY = this.minY + lines.length - 1;

        for (let y = 0; y < lines.length; y++) {
            for (let x = 0; x < lines[y].length; x++) {
                if (lines[y][x] === '#') {
                    this.parts.push(`${y + minY},${x + minX}`);
                }
                this.width = lines[y].length;
            }
        }
    }

    /**
     * "In jet patterns, < means a push to the left, while > means a push to the right"
     */
    push(pattern: string): Rock {
        switch (pattern) {
            case '<':
                return new Rock(this.minY, this.minX - 1, this.shape);
            case '>':
                return new Rock(this.minY, this.minX + 1, this.shape);
            default:
                throw new Error(`Invalid jet pattern ${pattern}`);
        }
    }

    drop(): Rock {
        return new Rock(this.minY - 1, this.minX, this.shape);
    }
}

const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8').trim();
let jetPattern = new Circle(puzzleInput.split(''));
const rockShapes = new Circle(readFileSync(path.join(__dirname, 'rocks.txt'), 'utf-8').split('\n\n'));

console.log(jetPattern.get(0));
console.log(jetPattern.get(10_000_000));
console.log(rockShapes);

/* "The tall, vertical chamber is exactly seven units wide." */
let width = 7;

function ok(rock: Rock, parts: Array<string>, width: number): boolean {
    //console.log({ rock, width });
    if (rock.minX < 0 || width < rock.width + rock.minX || rock.minY <= 0) {
        return false;
    }
    return rock.parts.every(p => !parts.includes(p));
}



function findLoop(positions: number[], minLoop: number): number | null {
    // we need at least two full cycles
    let maxMultiplier = Math.floor(positions.length / minLoop / 2);

    for (let multiplier = 1; multiplier <= maxMultiplier; multiplier++) {
        let loopSize = minLoop * multiplier;

        let round1 = positions.slice(-2 * loopSize, -1 * loopSize);
        let round2 = positions.slice(-1 * loopSize);

        if (equal(round1, round2)) {
            return loopSize;
        }
    }
    return null;
}


function main() {

    let parts = new Array<string>();
    let height = 0;

    // part 2
    let heights = new Array<number>();
    let positions = new Array<number>();
    let pieces = new Array<number>();

    let loopLength = jetPattern.length * rockShapes.length;
    let pieceCount = 1_000_000_000_000; // 2022 or 1000000000000

    console.log({ loopLength });


    let rockIndex = 0;
    let jetIndex = 0;

    for (let i = 0; i < pieceCount; i++, rockIndex++) {
        /* "Each rock appears so that its left edge is two units away from the left wall and its bottom
        * edge is three units above the highest rock in the room (or the floor, if there isn't one)." */
        let shape = rockShapes.get(rockIndex);
        let y = height + 4;
        let x = 2;
        let rock = new Rock(y, x, shape);

        for (let moving = true; moving; jetIndex++) {
            /* "After a rock appears, it alternates between being pushed by a jet of hot gas one unit (in the
             * direction indicated by the next symbol in the jet pattern) and then falling one unit down." */
            let jet = jetPattern.get(jetIndex);

            // try pushing, if it succeeds, update the rock state:
            let pushed = rock.push(jet);
            if (ok(pushed, parts, width)) {
                rock = pushed;
            }

            // try dropping: if it succeeds, update the rock state:
            let dropped = rock.drop();
            if (ok(dropped, parts, width)) {
                rock = dropped; // continue to next loop
            } else {

                // the rock hit an object below, so store its parts in the part collection:
                rock.parts.forEach(p => parts.push(p));

                // limit to max n parts
                parts = parts.slice(-100);

                // update the height of the current game area:
                height = max([height, rock.maxY]);
                moving = false;
            }

            // part 2: store state for identifying loops
            heights.push(height);
            positions.push(rock.minX);
            pieces.push(i);
        }

        // try finding a loop
        let loopSize = findLoop(positions, loopLength);

        if (typeof loopSize === 'number') {
            console.log('Found a loop!', { loopSize });

            let startHeight = heights[heights.length - 1 - loopSize];
            let endHeight = heights[heights.length - 1];
            let heightOfLoop = endHeight - startHeight;
            let piecesInLoop = pieces[pieces.length - 1] - pieces[pieces.length - 1 - loopSize];

            let fullLoopsLeft = Math.floor((pieceCount - i + 1) / piecesInLoop);

            console.table({ fullLoopsLeft, positions: positions.length, heights: heights.length, loopHeight: heightOfLoop, loopSize, height, piecesInLoop });

            // increment the height and piece count with the sizes and amounts of loops left:
            let addHeight = heightOfLoop * fullLoopsLeft;
            height += addHeight;
            i += fullLoopsLeft * piecesInLoop;

            // increment the y coordinates of the pieces
            parts = parts.map(p => {
                let [y, x] = p.split(',').map(n => Number(n))
                return `${y + addHeight},${x}`;
            })

            // reset state collectors
            pieces = [];
            positions = [];
        }

    }
    console.log(height);
}

main();
