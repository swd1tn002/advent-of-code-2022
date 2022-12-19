import { test, describe } from '@jest/globals';
import {
    splitLines,
    splitNumberMatrix,
    splitStringMatrix,
    extractNumber,
    extractNumbers
} from './strings';
import { strict as assert } from 'assert';


describe('String utilities', () => {
    test('Split multiline string into separate lines', () => {
        let input = 'a\nb\n\nc';

        assert.deepEqual(splitLines(input), ['a', 'b', '', 'c']);
    });

    test('Split string with custom separator', () => {
        let input = 'a\nb\n\nc';

        assert.deepEqual(splitLines(input, '\n\n'), ['a\nb', 'c']);
    });

    test('Split text matrix', () => {
        let input = `a b c
                     d e f
                     g h i`;

        assert.deepEqual(splitStringMatrix(input, '\n', ' '), [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']]);
    });

    test('Split number matrix', () => {
        let input = `1 2 3
                     4 5 6
                     7 8 9`;

        assert.deepEqual(splitNumberMatrix(input, '\n', ' '), [[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
    });

    test('Split number matrix delimited by empty lines (day 1 input)', () => {
        let input = `1000
                     2000
                     3000

                     4000

                     5000
                     6000`;

        assert.deepEqual(splitNumberMatrix(input, '\n\n', '\n'), [[1000, 2000, 3000], [4000], [5000, 6000]]);
    });

    test('Extract number from a string', () => {
        assert.equal(extractNumber('The secret number is 42, of course.'), 42);
    });

    test('Extract negative number from a string', () => {
        assert.equal(extractNumber('The secret number is -42, of course.'), -42);
    });

    test('Extract numbers from a string', () => {
        let numbers = extractNumbers('The numbers are 1, 2, 3, 4 and 42.');
        assert.deepEqual(numbers, [1, 2, 3, 4, 42]);
    });

    test('Extract negative numbers from a string', () => {
        let numbers = extractNumbers('The numbers are -1, -2, -3, -4 and -42.');
        assert.deepEqual(numbers, [-1, -2, -3, -4, -42]);
    });

    test('Extract numbers from day 19 input', () => {
        let input = 'Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 14 clay. Each geode robot costs 3 ore and 16 obsidian.'.replace(/\./g, '');

        assert.deepEqual(extractNumbers(input), [1, 4, 4, 4, 14, 3, 16]);
    })
});
