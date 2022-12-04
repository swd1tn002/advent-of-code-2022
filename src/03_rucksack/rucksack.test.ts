import { test, describe } from '@jest/globals';
import { strict as assert } from 'assert';
import { findBadgeGroupType, findCommonType, getPriority, splitToBadgeGroups, splitToCompartments } from './rucksack';


describe('Rucksack reorganization', () => {
    test('A rucksack always has the same number of items in each of its two compartments', () => {
        let [left, right] = splitToCompartments('vJrwpWtwJgWrhcsFMMfFFhFp');

        assert.deepEqual(left, 'vJrwpWtwJgWr');
        assert.deepEqual(right, 'hcsFMMfFFhFp');
    });

    test('Split elves into groups of three', () => {
        let groups = splitToBadgeGroups(['a', 'b', 'c', 'd', 'e', 'f']);

        assert.deepEqual(groups, [['a', 'b', 'c'], ['d', 'e', 'f']]);
    });

    test('Both compartments have one item in common', () => {
        let common = findCommonType('PmmdzqPrV', 'vPwwTWBwg');

        assert.equal(common, 'P');
    });

    test('Groups of elves always have a common type', () => {
        let badgeType = findBadgeGroupType(['vJrwpWtwJgWrhcsFMMfFFhFp', 'jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL', 'PmmdzqPrVvPwwTWBwg']);

        assert.equal(badgeType, 'r');
    });

    test('Each item type has a priority', () => {
        assert.equal(getPriority('a'), 1);
        assert.equal(getPriority('Z'), 52);
    });
});
