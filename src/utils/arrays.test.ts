import { test, describe } from '@jest/globals';
import { strict as assert } from 'assert';
import { last, max, min, sortNumbers, splitToChunks, sum } from './arrays';

describe('Array utilities', () => {
    test('Max returns largest item in array', () => {
        assert.equal(max([1, -1, 100, 3, 2]), 100);
    });

    test('Min return smallest item in array', () => {
        assert.equal(min([1, -1, 100, 3, 2]), -1);
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

    test('splitToChunks splits given array into even sized chunks', () => {
        let chunks = splitToChunks([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
        assert.deepEqual(chunks, [[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
    });

    test('last returns the last item of an array', () => {
        assert.equal(last([1, 2, 3, 4, 5, 6]), 6);
        assert.equal(last(['foo', 'bar']), 'bar');
    });
});
