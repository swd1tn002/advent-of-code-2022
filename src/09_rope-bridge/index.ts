import { readFileSync } from 'fs';
import { splitStringMatrix } from '../utils/strings';
import { last, max } from '../utils/arrays';
import { maxOne } from '../utils/numbers';
import { Position } from './Position';
import path from 'path';

const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
const seriesOfMotions: string[][] = splitStringMatrix(puzzleInput);


/**
 * "If the head is ever two steps directly up, down, left, or right from the tail,
 * the tail must also move one step in that direction so it remains close enough"
 *
 * "Otherwise, if the head and tail aren't touching and aren't in the same row or
 * column, the tail always moves one step diagonally to keep up"
 */
function updateFollowersPosition(first: Position, second: Position): Position {
    let distY = first.y - second.y;
    let distX = first.x - second.x;

    let isAdjacent = max([Math.abs(distY), Math.abs(distX)]) <= 1;

    if (isAdjacent) {
        // no need to move
        return second;
    }

    // move from current position towards the head by maximum of one step each axis
    return new Position(second.y + maxOne(distY), second.x + maxOne(distX));
}


/**
 * "Consider a rope with a knot at each end; these knots mark the head and the tail of the
 * rope. If the head moves far enough away from the tail, the tail is pulled toward the head."
 *
 * @param motions "by following a hypothetical series of motions for the head, you can determine how the tail will move."
 * @param rope "Each knot further down the rope follows the knot in front of it using the same rules as before."
 * @returns "how the tail will move"
 */
function getTailPositions(motions: string[][], rope: Position[]): Position[] {
    let tailPath = new Array<Position>();
    let newRope = [...rope];

    for (let [direction, distance] of motions) {
        let count = Number(distance);
        for (let i = 0; i < count; i++) {
            let [head, ...followers] = newRope;

            let newHead = head.applyDirection(direction);
            newRope = [newHead];

            for (let knot of followers) {
                let newKnowt = updateFollowersPosition(last(newRope), knot);
                newRope.push(newKnowt);
            }

            tailPath.push(last(newRope));
        }
    }
    return tailPath;
}

/**
 * Creates a new rope with the given number of knots (all in zero position).
 */
function createRope(length: number): Position[] {
    return new Array<Position>(length).fill(new Position(0, 0));
}

// part 1
let shortRope = createRope(2);
let firstTailPath = getTailPositions(seriesOfMotions, shortRope);
console.log('Part 1:', new Set(firstTailPath.map(pos => `${pos.y}:${pos.x}`)).size); // 6269


// part 2
let longRope = createRope(10);
let secondTailPath = getTailPositions(seriesOfMotions, longRope);
console.log('Part 2:', new Set(secondTailPath.map(pos => `${pos.y}:${pos.x}`)).size); // 2557
