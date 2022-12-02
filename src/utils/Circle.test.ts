import { test, describe } from '@jest/globals';
import { strict as assert } from 'assert';
import Circle from './Circle';

describe('Circular list', () => {
    test('Allows getting with positive indices around circle', () => {
        let c = new Circle([10, 11, 12, 13, 14, 15]);

        assert.equal(c.get(0), 10);
        assert.equal(c.get(5), 15);
        assert.equal(c.get(6), 10); // wrap around
    });

    test('Allows getting with negative indices around circle', () => {
        let c = new Circle([10, 11, 12, 13, 14, 15]);

        assert.equal(c.get(-1), 15);
        assert.equal(c.get(-2), 14);
        assert.equal(c.get(-7), 15); // wrap around
    });

    test('Returns next from given element', () => {
        let c = new Circle([10, 11, 12, 13, 14, 15]);

        assert.equal(c.next(10), 11);
        assert.equal(c.next(12), 13);

        assert.equal(c.next(15), 10); // wrap around
    });

    test('Returns previous from given element', () => {
        let c = new Circle([10, 11, 12, 13, 14, 15]);

        assert.equal(c.previous(11), 10);
        assert.equal(c.previous(13), 12);

        assert.equal(c.previous(10), 15); // wrap around
    });
});
