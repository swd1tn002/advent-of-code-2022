import { test, describe } from '@jest/globals';
import { getCoordinates, mix, Num, shift } from './mixer';
import { strict as assert } from 'assert';


describe('Mixing an array of numbers', () => {
    let _0 = new Num(0);
    let _1 = new Num(1);
    let _2 = new Num(2);
    let __1minus = new Num(-1);
    let __2minus = new Num(-2);

    test('Zero never shifts', () => {
        assert.deepEqual(shift(_0, [_0, _1, _2]), [_0, _1, _2]);
        assert.deepEqual(shift(_0, [_1, _0, _2]), [_1, _0, _2]);
        assert.deepEqual(shift(_0, [_1, _2, _0]), [_1, _2, _0]);
    });

    test('Moving right inside the list', () => {
        assert.deepEqual(shift(_1, [_0, _1, _2]), [_0, _2, _1]);
    });

    test('Moving left inside the list', () => {
        assert.deepEqual(shift(__1minus, [_0, _1, __1minus]), [_0, __1minus, _1]);
    });

    test('Moving forward from last position wraps around to start', () => {
        assert.deepEqual(shift(_1, [_0, _2, _1]), [_0, _1, _2]);
    });

    test('Moving two steps forward around the end', () => {
        assert.deepEqual(shift(_2, [_0, _0, _2, _1]), [_0, _2, _0, _1]);
    });

    test('Moving backwards from first position wraps around to end', () => {
        assert.deepEqual(shift(__1minus, [__1minus, _2, _1]), [_2, __1minus, _1]);
    });

    test('Moving backwards from first keeps moving left from the end', () => {
        assert.deepEqual(shift(__2minus, [_0, __2minus, _1, _2]), [_0, _1, __2minus, _2]);
    });


    test('Moving forward around the list twice', () => {
        let _5 = new Num(5);
        let arr = [_0, _1, _5, _2];

        assert.deepEqual(shift(_5, arr), [_0, _5, _1, _2]);
    });

    test('Moving backwards around the list twice', () => {
        let _5minus = new Num(-5);
        let arr = [_0, _1, _5minus, _2];

        assert.deepEqual(shift(_5minus, arr), [_0, _1, _2, _5minus]);
    });

    test('Mix the given example input and get coordinates', () => {
        let original = [1, 2, -3, 3, -2, 0, 4].map(i => new Num(i));
        let mixed = mix(original, 1);

        let [a, b, c] = getCoordinates(mixed);

        assert.equal(a, 4);
        assert.equal(b, -3);
        assert.equal(c, 2);
    });


    test('Multiply input and mix 10 times as per part 2 instructions', () => {
        let decryptionKey = 811589153;
        let original = [1, 2, -3, 3, -2, 0, 4].map(i => new Num(i * decryptionKey));

        let mixed = mix(original, 10);

        let [a, b, c] = getCoordinates(mixed);

        assert.equal(a, 811589153);
        assert.equal(b, 2434767459);
        assert.equal(c, -1623178306);
    });
});