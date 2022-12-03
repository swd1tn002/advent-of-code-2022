import { test, describe } from '@jest/globals';
import { strict as assert } from 'assert';
import { applyStrategy, getCounterMove, getOutcome, getScoreForRound, Outcome, parseGameMoves, parseGameStrategies, parseShape, Shape } from './rockPaperScissors';

describe('Rock paper scissors', () => {
    test('Parse game moves for part 1', () => {
        /* "In the first round, your opponent will choose Rock (A), and you should choose Paper (Y). This ends in a win for you with a score of 8 (2 because you chose Paper + 6 because you won).
         * In the second round, your opponent will choose Paper (B), and you should choose Rock (X). This ends in a loss for you with a score of 1 (1 + 0).
         * The third round is a draw with both players choosing Scissors, giving you a score of 3 + 3 = 6." */
        let rounds = parseGameMoves(`A Y\nB X\nC Z`);

        assert.deepEqual(rounds[0], [Shape.ROCK, Shape.PAPER]);
        assert.deepEqual(rounds[1], [Shape.PAPER, Shape.ROCK]);
        assert.deepEqual(rounds[2], [Shape.SCISSORS, Shape.SCISSORS]);
    });

    test('Parse game strategies for part 2', () => {
        let rounds = parseGameStrategies(`A Y\nB X\nC Z`);

        // In the first round, your opponent will choose Rock (A), and you need the round to end in a draw (Y), so you also choose Rock.
        assert.deepEqual(rounds[0], [Shape.ROCK, Shape.ROCK]);

        // In the second round, your opponent will choose Paper (B), and you choose Rock
        assert.deepEqual(rounds[1], [Shape.PAPER, Shape.ROCK]);

        // In the third round, you will defeat your opponent's Scissors with Rock
        assert.deepEqual(rounds[2], [Shape.SCISSORS, Shape.ROCK]);
    });

    test('Rock defeats Scissors, Scissors defeats Paper and Paper defeats Rock.', () => {
        assert.equal(getOutcome(Shape.ROCK, Shape.SCISSORS), Outcome.WIN);
        assert.equal(getOutcome(Shape.SCISSORS, Shape.ROCK), Outcome.LOSE);

        assert.equal(getOutcome(Shape.SCISSORS, Shape.PAPER), Outcome.WIN);
        assert.equal(getOutcome(Shape.PAPER, Shape.SCISSORS), Outcome.LOSE);

        assert.equal(getOutcome(Shape.PAPER, Shape.ROCK), Outcome.WIN);
        assert.equal(getOutcome(Shape.ROCK, Shape.PAPER), Outcome.LOSE);

        assert.equal(getOutcome(Shape.ROCK, Shape.ROCK), Outcome.DRAW);
        assert.equal(getOutcome(Shape.PAPER, Shape.PAPER), Outcome.DRAW);
        assert.equal(getOutcome(Shape.SCISSORS, Shape.SCISSORS), Outcome.DRAW);
    });

    test('Apply strategy returns the elf move and your move based on required outcome', () => {

        // In the first round, your opponent will choose Rock(A), and you should choose Paper(Y).This ends in a win for you with a score of 8(2 because you chose Paper + 6 because you won).
        assert.deepEqual(applyStrategy(Shape.ROCK, Outcome.WIN), [Shape.ROCK, Shape.PAPER]);

        // In the second round, your opponent will choose Paper(B), and you should choose Rock(X).This ends in a loss for you with a score of 1(1 + 0).
        assert.deepEqual(applyStrategy(Shape.PAPER, Outcome.LOSE), [Shape.PAPER, Shape.ROCK]);

        // The third round is a draw with both players choosing Scissors, giving you a score of 3 + 3 = 6.
        assert.deepEqual(applyStrategy(Shape.SCISSORS, Outcome.DRAW), [Shape.SCISSORS, Shape.SCISSORS]);
    });

    test('ParseShape parses characters into Rock, Paper and Scissors', () => {
        assert.equal(parseShape('A'), Shape.ROCK);
        assert.equal(parseShape('B'), Shape.PAPER);
        assert.equal(parseShape('C'), Shape.SCISSORS);

        assert.equal(parseShape('X'), Shape.ROCK);
        assert.equal(parseShape('Y'), Shape.PAPER);
        assert.equal(parseShape('Z'), Shape.SCISSORS);
    });

    test('Score is calculated for each round', () => {
        // Draw with scissors = 6
        assert.equal(getScoreForRound([Shape.SCISSORS, Shape.SCISSORS]), 6);

        // Loss with paper = 2
        assert.equal(getScoreForRound([Shape.SCISSORS, Shape.PAPER]), 2);

        // Win with rock = 7
        assert.equal(getScoreForRound([Shape.SCISSORS, Shape.ROCK]), 7);
    });
});
