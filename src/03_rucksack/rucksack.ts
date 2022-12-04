import { splitToChunks, sum } from '../utils/arrays';


/**
 * "Each rucksack has two large compartments. A given rucksack always has
 * the same number of items in each of its two compartments."
 */
export function splitToCompartments(rucksack: string): [string, string] {
    let left = rucksack.substring(0, rucksack.length / 2);
    let right = rucksack.substring(rucksack.length / 2);

    return [left, right];
}

/** For safety, the Elves are divided into groups of three. */
export function splitToBadgeGroups(rucksacks: string[]): string[][] {
    return splitToChunks(rucksacks, 3);
}

/**
 * "Find the item type that appears in both compartments of each rucksack"
 */
export function findCommonType(left: string, right: string): string {
    return left.split('').find(char => right.includes(char)) ?? '';
}

/**
 * "The only way to tell which item type is the right one is by finding 
 * the one item type that is common between all three Elves in each group."
 */
export function findBadgeGroupType(bags: string[]): string {
    let [first, ...others] = bags;
    return first.split('').find(char => others.every(other => other.includes(char))) ?? '';
}

/**
 * To help prioritize item rearrangement, every item type can be converted to a priority:
 * Lowercase item types a through z have priorities 1 through 26.
 * Uppercase item types A through Z have priorities 27 through 52.
 */
export function getPriority(itemType: string): number {
    return ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(itemType);
}
