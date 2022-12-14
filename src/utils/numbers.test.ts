import { test, describe } from '@jest/globals';
import { strict as assert } from 'assert';
import { maxOne } from './numbers';

describe('Number utilities', () => {
    test('MaxOne retains the sign but limits numbers to abs(1)', () => {
        assert.equal(maxOne(100), 1);
        assert.equal(maxOne(10), 1);
        assert.equal(maxOne(1), 1);
        assert.equal(maxOne(0), 0);
        assert.equal(maxOne(-1), -1);
        assert.equal(maxOne(-10), -1);
        assert.equal(maxOne(-100), -1);
    });
});