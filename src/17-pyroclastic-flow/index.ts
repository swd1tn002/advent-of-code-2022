import path from 'path';
import { readFileSync } from 'fs';
import { splitLines, splitStringMatrix, splitNumberMatrix, extractNumber, extractNumbers } from '../utils/strings';
import { sum, last, max, min, reverseRows, sortNumbers, splitToChunks, transpose } from '../utils/arrays';
import Circle from '../utils/Circle';

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

    // overlaps(other: Rock): boolean {
    //     for (let y = this.minY; y > this.minY - this.height; y--) {
    //         for (let x = this.minX; x < this.minX + this.width; x++) {
    //             if (this.covers(y, x) && other.covers(y, x)) {
    //                 return true;
    //             }
    //         }
    //     }
    //     return false;
    // }

    covers(y: number, x: number): boolean {
        return this.parts.includes(`${y},${x}`);
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

function ok(rock: Rock, parts: Set<string>, width: number): boolean {
    //console.log({ rock, width });
    if (rock.minX < 0 || width < rock.width + rock.minX || rock.minY <= 0) {
        return false;
    }
    return rock.parts.every(p => !parts.has(p));
}

let rockIndex = 0;
let jetIndex = 0;


function getHeight(parts: Set<string>): number {
    let h = 0;
    for (let p of parts) {
        let y = Number(p.split(',')[0])
        h = max([y, h]);
    }
    return h;
}

function draw(rock: Rock, parts: Set<string>) {
    let all = new Set(parts);
    rock.parts.forEach(p => all.add(p));

    for (let y = getHeight(all); y > 0; y--) {
        process.stdout.write('|');
        for (let x = 0; x < 7; x++) {
            if (all.has(`${y},${x}`)) {
                process.stdout.write('#');
            } else {
                process.stdout.write(' ');
            }
        }
        console.log('|');
    }
    console.log('+-------+');
}

let parts = new Set<string>();
let height = 0;

for (let i = 0; i < 2022; i++) {
    /* "Each rock appears so that its left edge is two units away from the left wall and its bottom
     * edge is three units above the highest rock in the room (or the floor, if there isn't one)." */
    let shape = rockShapes.get(rockIndex++);
    let y = height + 4;
    let x = 2;
    let rock = new Rock(y, x, shape);

    let moving = true;
    while (moving) {
        //draw(rock, parts);

        /* "After a rock appears, it alternates between being pushed by a jet of hot gas one unit (in the
         * direction indicated by the next symbol in the jet pattern) and then falling one unit down." */
        let jet = jetPattern.get(jetIndex++);
        let pushed = rock.push(jet);

        //console.log(jet);

        if (ok(pushed, parts, width)) {
            //console.log('moved');
            rock = pushed;
        }

        let dropped = rock.drop();

        if (ok(dropped, parts, width)) {
            // continue with the rock that is dropped
            rock = dropped;
        } else {
            rock.parts.forEach(p => parts.add(p));
            height = max([height, rock.maxY]);
            moving = false;
        }
    }
}
console.log(height); // 3219
