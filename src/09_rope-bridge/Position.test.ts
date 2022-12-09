import { test, describe } from '@jest/globals';
import { strict as assert } from 'assert';
import { Position } from './Position';

describe('Position utility class', () => {
    test('Position has neigbors in all directions', () => {
        let y = 10, x = 5;
        let p1 = new Position(y, x);

        assert.equal(p1.up().y, y + 1);
        assert.equal(p1.down().y, y - 1);

        assert.equal(p1.left().x, x - 1);
        assert.equal(p1.right().x, x + 1);
    });

    test('Positions can apply U, D, L and R to get neighbors in each directions', () => {
        let y = 10, x = 5;
        let p1 = new Position(y, x);

        assert.deepEqual(p1.applyDirection('U'), p1.up());
        assert.deepEqual(p1.applyDirection('D'), p1.down());
        assert.deepEqual(p1.applyDirection('L'), p1.left());
        assert.deepEqual(p1.applyDirection('R'), p1.right());
    });
});