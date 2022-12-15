import { test, describe } from '@jest/globals';
import { strict as assert } from 'assert';
import { Range } from './Range';


describe('Number range', () => {
    test('Ranges have textual representation that can be parsed', () => {
        let oneToHundred = Range.parse('1-100');

        assert.equal(oneToHundred.start, 1);
        assert.equal(oneToHundred.end, 100);
    });

    test('The start and end index are included in the range', () => {
        let zeroThroughFive = new Range(0, 5);
        let oneThroughMillion = new Range(1, 1_000_000);

        assert.equal(zeroThroughFive.size, 6);
        assert.equal(oneThroughMillion.size, 1_000_000);

        assert.ok(zeroThroughFive.contains(0));
        assert.ok(zeroThroughFive.contains(5));
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

    test('Ranges can be joined together', () => {
        let left = new Range(100, 200);
        let right = new Range(150, 250);

        // in natural order
        assert.equal(left.join(right).start, 100);
        assert.equal(left.join(right).end, 250);

        // different order but equal result
        assert.equal(right.join(left).start, 100);
        assert.equal(right.join(left).end, 250);
    });

    test('An array of ranges can be compacted', () => {
        let left = new Range(100, 200);
        let right = new Range(150, 250);
        let wayOff = new Range(1_000, 2_000);

        let joined = Range.joinRanges([wayOff, right, left]);
        assert.equal(joined.length, 2);
        assert.equal(joined[0].start, left.start);
        assert.equal(joined[0].end, right.end);

        assert.equal(joined[1], wayOff);
    })
});
