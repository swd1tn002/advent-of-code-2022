import { splitStringMatrix } from '../utils/strings';

enum Shape {
    ROCK = 1, PAPER = 2, SCISSORS = 3
}

enum Outcome {
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
    return matrix.map(([s1, s2]) => applyStrategy(parseShape(s1), parseOutcome(s2)));
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
function parseShape(char: string): Shape {
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
            throw `invalid shape ${char}`;
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
        default: throw `invalid outcome ${text}`;
    }
}

/**
 * "The second column says how the round needs to end: X means you need to lose,
 * Y means you need to end the round in a draw, and Z means you need to win"
 */
export function getCounterMove(elf: Shape, outcome: Outcome): Shape {
    let defeats = [Shape.ROCK, Shape.PAPER, Shape.SCISSORS];
    let opponentIndex = defeats.indexOf(elf);

    switch (outcome) {
        case Outcome.DRAW:
            return elf;
        case Outcome.WIN:
            let next = (opponentIndex + 1) % defeats.length
            return defeats[next];
        case Outcome.LOSE:
            let previous = (opponentIndex - 1 + defeats.length) % defeats.length
            return defeats[previous];
        default:
            throw `Could not get move for ${elf} and ${outcome}`;
    }

}
/**
 * "The score for a single round is the score for the shape you selected plus the 
 * score for the outcome of the round."
 */
export function getScoreForRound(round: [Shape, Shape]): number {
    let [elfMove, myMove] = round;
    let outcome = getOutcome(elfMove, myMove);
    return outcome + myMove;
}

/**
 * "Rock defeats Scissors, Scissors defeats Paper, and Paper defeats Rock."
 */
function getOutcome(elfMove: Shape, myMove: Shape): Outcome {
    let defeats = [Shape.ROCK, Shape.PAPER, Shape.SCISSORS, Shape.ROCK];

    if (defeats[defeats.indexOf(elfMove) + 1] === myMove) {
        return Outcome.WIN;
    }
    if (defeats[defeats.indexOf(myMove) + 1] === elfMove) {
        return Outcome.LOSE;
    }
    return Outcome.DRAW;
}
