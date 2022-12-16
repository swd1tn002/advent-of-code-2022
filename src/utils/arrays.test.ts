import { test, describe } from '@jest/globals';
import { strict as assert } from 'assert';
import { last, max, min, reverseRows, sortNumbers, splitToChunks, sum, transpose, zip } from './arrays';

describe('Array utilities', () => {
    test('Max returns largest item in array', () => {
        assert.equal(max([1, -1, 100, 3, 2]), 100);
        assert.equal(max([4, 1]), 4);
        assert.equal(max([1, 4]), 4);
    });

    test('Min return smallest item in array', () => {
        assert.equal(min([1, -1, 100, 3, 2]), -1);
    });

    test('Min and max return 0 when there are no elements', () => {
        assert.equal(min([]), 0);
        assert.equal(max([]), 0);
    });

    test('Sort numbers returns a sorted copy', () => {
        let arr = [3, 1, 2];

        assert.deepEqual(sortNumbers(arr), [1, 2, 3]);

        // original may not change
        assert.deepEqual(arr, [3, 1, 2]);
    });

    test('Sum counts all numbers together', () => {
        let arr = [3, 1, 2];

        assert.deepEqual(sum(arr), 6);
    });

    test('SplitToChunks splits given array into even sized chunks', () => {
        let chunks = splitToChunks([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
        assert.deepEqual(chunks, [[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
    });

    test('Last returns the last item of an array', () => {
        assert.equal(last([1, 2, 3, 4, 5, 6]), 6);
        assert.equal(last(['foo', 'bar']), 'bar');
    });

    test('Last throws an exception when called to an ampty array', () => {
        assert.throws(() => { last([]) });
    });

    test('Transpose transforms rows into columns and vice versa', () => {
        let original = [[1, 2, 3], [4, 5, 6]];

        let result = transpose(original);
        assert.deepEqual(result, [[1, 4], [2, 5], [3, 6]]);
    });

    test('ReverseRows creates a copy of a matrix with each row reversed', () => {
        let original = [[1, 2, 3], [4, 5, 6]];

        let result = reverseRows(original);
        assert.deepEqual(result, [[3, 2, 1], [6, 5, 4]]);
    });

    test('Zip combines two arrays into an array of pairs', () => {
        let arr1 = [1, 2];
        let arr2 = ['a', 'b'];

        assert.deepEqual(zip(arr1, arr2), [[1, 'a'], [2, 'b']]);
    });
});
