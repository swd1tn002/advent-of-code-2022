import Circle from '../utils/Circle';
import { splitStringMatrix } from '../utils/strings';

export enum Shape {
    ROCK = 1, PAPER = 2, SCISSORS = 3
}

export enum Outcome {
    LOSE = 0, DRAW = 3, WIN = 6
}

/**
 * The first column is what your opponent is going to play...
 * The second column, you reason, must be what you should play in response.
 */
export function parseGameMoves(puzzleInput: string): [Shape, Shape][] {
    const matrix = splitStringMatrix(puzzleInput);
    return matrix.map(([s1, s2]) => [parseShape(s1), parseShape(s2)]);
}

/**
 * The first column is what your opponent is going to play...
 * The second column says how the round needs to end.
 */
export function parseGameStrategies(puzzleInput: string): [Shape, Shape][] {
    const matrix = splitStringMatrix(puzzleInput);
    return matrix.map(([shape, outcome]) => applyStrategy(parseShape(shape), parseOutcome(outcome)));
}

/**
 * "Anyway, the second column says how the round needs to end: X means you need to lose,
 * Y means you need to end the round in a draw, and Z means you need to win. Good luck!"
 * 
 * @param elfMove
 * @param outcome required outcome 
 * @returns the move required to outcome
 */
export function applyStrategy(elfMove: Shape, outcome: Outcome): [Shape, Shape] {
    let myMove = getCounterMove(elfMove, outcome);
    return [elfMove, myMove];
}

/**
 * @param char A/X for Rock, B/Y for Paper, and C/Z for Scissors
 * @returns Shape for the given character
 */
export function parseShape(char: string): Shape {
    switch (char) {
        case 'A':
        case 'X':
            return Shape.ROCK;
        case 'B':
        case 'Y':
            return Shape.PAPER;
        case 'C':
        case 'Z':
            return Shape.SCISSORS;
        default:
            throw new Error(`invalid shape ${char}`);
    }
}

/**
 * "X means you need to lose, Y means you need to end the round in a draw,
 * and Z means you need to win."
 */
function parseOutcome(text: string): Outcome {
    switch (text) {
        case 'X': return Outcome.LOSE;
        case 'Y': return Outcome.DRAW;
        case 'Z': return Outcome.WIN;
        default: throw new Error(`invalid outcome ${text}`);
    }
}

/**
 * "The second column says how the round needs to end: X means you need to lose,
 * Y means you need to end the round in a draw, and Z means you need to win"
 */
export function getCounterMove(elf: Shape, outcome: Outcome): Shape {
    let rockPaperScissors = new Circle([Shape.ROCK, Shape.PAPER, Shape.SCISSORS]);

    switch (outcome) {
        case Outcome.DRAW:
            return elf;
        case Outcome.WIN:
            return rockPaperScissors.next(elf);
        case Outcome.LOSE:
            return rockPaperScissors.previous(elf);
        default:
            throw `Could not get countermove for ${elf} and ${outcome}`;
    }
}

/**
 * "The score for a single round is the score for the shape you selected plus the 
 * score for the outcome of the round."
 */
export function getScoreForRound(round: [Shape, Shape]): number {
    let [elfMove, myMove] = round;
    let outcome = getOutcome(myMove, elfMove);
    return outcome + myMove;
}

/**
 * "Rock defeats Scissors, Scissors defeats Paper, and Paper defeats Rock."
 */
export function getOutcome(myMove: Shape, elfMove: Shape): Outcome {
    let rockPaperScissors = new Circle([Shape.ROCK, Shape.PAPER, Shape.SCISSORS]);

    if (myMove === elfMove) {
        return Outcome.DRAW;
    }
    if (rockPaperScissors.next(elfMove) === myMove) {
        return Outcome.WIN;
    }
    return Outcome.LOSE;
}
