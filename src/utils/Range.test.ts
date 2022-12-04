import { test, describe } from '@jest/globals';
import { strict as assert } from 'assert';
import { Range } from './Range';


describe('Number range', () => {
    test('Ranges have textual representation that can be parsed', () => {
        let oneToHundred = Range.parse('1-100');

        assert.equal(oneToHundred.start, 1);
        assert.equal(oneToHundred.end, 100);
    });

    test('Ranges contain numbers that can be checked individually', () => {
        let range = new Range(5, 10);

        // contains
        assert.ok(range.contains(5));
        assert.ok(range.contains(7));
        assert.ok(range.contains(10));

        // does not contain
        assert.ok(!range.contains(0));
        assert.ok(!range.contains(11));
    });

    test('Ranges can fully overlap other ranges', () => {
        let large = new Range(100, 200);
        let smaller = new Range(100, 150);

        assert.ok(large.fullyContains(smaller));
        assert.ok(!smaller.fullyContains(large));

        // special case: exact same range
        assert.ok(large.fullyContains(large));
    });

    test('Ranges can overlap at beginning, end or middle', () => {
        let left = new Range(100, 200);
        let center = new Range(160, 190);
        let right = new Range(150, 250);

        assert.ok(left.overlaps(right));
        assert.ok(right.overlaps(left));
        assert.ok(left.overlaps(left)); // full overlap

        assert.ok(left.overlaps(center));
        assert.ok(center.overlaps(left));
    });
});
