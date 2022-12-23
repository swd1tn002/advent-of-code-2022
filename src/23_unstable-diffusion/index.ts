import path from 'path';
import { readFileSync } from 'fs';
import { splitStringMatrix } from '../utils/strings';
import { last, sortNumbers } from '../utils/arrays';
import { Vector } from '../utils/Vector';

const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

/*
 * "The scan is oriented so that north is up; orthogonal directions are written N (north),
 * S (south), W (west), and E (east), while diagonal directions are written NE, NW, SE, SW."
 */
const N = new Vector(-1, 0);
const E = new Vector(0, 1);
const S = new Vector(1, 0);
const W = new Vector(0, -1);
const NE = N.plus(E);
const SE = S.plus(E);
const NW = N.plus(W);
const SW = S.plus(W);
const CENTER = new Vector(0, 0);

class Elf {
    constructor(public position: Vector) { }
}

type ElvesWithProposals = [Elf, Vector][];
type MoveProposalFunction = (elf: Elf, occupied: Set<string>) => Vector | null;

/**
 * "The scan shows Elves # and empty ground .; outside your scan, more empty ground extends a long
 * way in every direction."
 */
function parseElves(input: string): Elf[] {
    let elves = new Array<Elf>();

    let map = splitStringMatrix(input, '\n', '');
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x] === '#') {
                elves.push(new Elf(new Vector(y, x)));
            }
        }
    }
    return elves;
}

/**
 * "If there is no Elf in the given adjacent positions,
 * the Elf proposes moving to the given direction one step."
 *
 * @returns a function that can be called for all elves. The function checks whether
 *          the adjacent vectors have neighbors in them, and if not, suggests to move.
 */
function makeMoveFunction(directions: Vector[], suggestDirection: Vector): MoveProposalFunction {

    return (elf: Elf, elfPositions: Set<string>) => {

        // finds if neighbors in given directions are empty using the given set of positions
        let adjacentsEmpty = directions.every(direction => {
            return !elfPositions.has(`${elf.position.plus(direction)}`);
        });

        // return suggestion if one should be made
        if (adjacentsEmpty) {
            return elf.position.plus(suggestDirection);
        }

        // some of the directions is occupied, do not make this move
        return null;
    }
}



/**
 * "The Elves follow a time-consuming process to figure out where they should each go;
 * you can speed up this process considerably. The process consists of some number of
 * rounds during which Elves alternate between considering where to move and actually
 * moving"
 *
 * @returns the count of rounds when the elves actually moved
 */
function moveElves(elves: Elf[], rounds: number, givenRules: MoveProposalFunction[]): number {

    // make copy of the rules array, so it can be modified without side effects:
    let rules = [...givenRules];

    /* "After each Elf has had a chance to propose a move, the second half of the
     * round can begin.Simultaneously, each Elf moves to their proposed destination
     * tile if they were the only Elf to propose moving to that position. If two or
     * more Elves propose moving to the same position, none of those Elves move." */
    for (let i = 0; i < rounds; i++) {
        let proposals = proposeMoves(elves, rules);


        if (proposals.length === 0) {
            return i + 1;
        }

        proposals.forEach(([elf, position]) => {
            elf.position = position;
        });

        /* "At the end of the round, the first direction the Elves considered is moved
         * to the end of the list of directions. " */
        let first = rules.shift()!;
        rules.push(first);
    }

    return rounds;
}

/**
 * "Each Elf considers the eight positions adjacent to themself. If no other Elves are
 * in one of those eight positions, the Elf does not do anything during this round.
 * Otherwise, the Elf looks in each of four directions in the following order and
 * proposes moving one step in the first valid direction."
 */
function proposeMoves(elves: Elf[], rules: MoveProposalFunction[]): ElvesWithProposals {
    const noNeighborsNoMove = makeMoveFunction([N, E, S, W, NE, SE, NW, SW], CENTER);

    let currentPositions = new Set(elves.map(e => e.position.toString()));

    // `null` means that there are more than one elf that wishes to enter the tile
    let proposals: { [tile: string]: Elf | null } = {};

    elves.forEach((elf) => {
        /* "If no other Elves are in one of those eight positions,
         * the Elf does not do anything during this round." */
        let noNeighbors = noNeighborsNoMove(elf, currentPositions);
        if (noNeighbors) {
            return;
        }

        /* "Otherwise, the Elf looks in each of four directions in the following
         * order and proposes moving one step in the first valid direction" */
        for (let rule of rules) {
            let destination = rule(elf, currentPositions);

            /* "Each Elf moves to their proposed destination
            * tile if they were the only Elf to propose moving to that position. If two or
            * more Elves propose moving to the same position, none of those Elves move."*/
            if (destination) {
                let v = destination.toString();

                // if proposed by another elf, store `null`, so neither elf will move there
                proposals[v] = (v in proposals) ? null : elf;

                // this elf now has a proposal, so skip the next rules and continue with the next elf
                return;
            }
        }
    });

    // build an array of tuples of elfs and their next coordinates
    let result: ElvesWithProposals = [];
    for (let [coord, elf] of Object.entries(proposals)) {
        if (elf !== null) {
            result.push([elf, Vector.parse(coord)]);
        }
    }

    return result;
}

/**
 * Part 1:
 * "Simulate the Elves' process and find the smallest rectangle that contains the
 * Elves after 10 rounds. How many empty ground tiles does that rectangle contain?"
 */
function part1() {

    let elves = parseElves(puzzleInput);

    /*
     * "If there is no Elf in the N, NE, or NW adjacent positions, the Elf proposes moving north one step.
     * If there is no Elf in the S, SE, or SW adjacent positions, the Elf proposes moving south one step.
     * If there is no Elf in the W, NW, or SW adjacent positions, the Elf proposes moving west one step.
     * If there is no Elf in the E, NE, or SE adjacent positions, the Elf proposes moving east one step."
     */
    let rules = [
        makeMoveFunction([N, NE, NW], N), makeMoveFunction([S, SE, SW], S),
        makeMoveFunction([W, NW, SW], W), makeMoveFunction([E, NE, SE], E),
    ];

    moveElves(elves, 10, rules);

    let x = sortNumbers(elves.map(e => e.position.x));
    let width = last(x) - x[0] + 1;

    let y = sortNumbers(elves.map(e => e.position.y));
    let height = last(y) - y[0] + 1;

    console.log(`Part 1: empty tiles in the rectangle:`, width * height - elves.length);
}

/**
 * Part 2:
 * "It seems you're on the right track. Finish simulating the process and figure out
 * where the Elves need to go. How many rounds did you save them?"
 */
function part2() {
    let elves = parseElves(puzzleInput);

    let rules = [
        makeMoveFunction([N, NE, NW], N), makeMoveFunction([S, SE, SW], S),
        makeMoveFunction([W, NW, SW], W), makeMoveFunction([E, NE, SE], E),
    ];

    let rounds = moveElves(elves, Infinity, rules);

    console.log(`Part 2: elves stop moving after ${rounds} rounds`);
}

part1();
part2();
