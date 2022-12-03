import { readFileSync } from "fs";
import { splitToChunks, sum } from "../utils/arrays";
import { splitLines } from "../utils/strings";

const puzzleInput = readFileSync(__dirname + '/input.txt', 'utf-8');
let rucksacks = splitLines(puzzleInput);

function splitToCompartments(rucksack: string): [string[], string[]] {
    let items = rucksack.split('');
    let left = items.slice(0, items.length / 2);
    let right = items.slice(items.length / 2);

    return [left, right];
}

/** For safety, the Elves are divided into groups of three. */
function splitToBadgeGroups(rucksacks: string[]): string[][] {
    return splitToChunks(rucksacks, 3);
}

function findCommonType([left, right]: [string[], string[]]): string {
    return left.find(item => right.includes(item)) ?? ' ';
}

function findBadgeGroupType(bags: string[]): string {
    let [first, ...rest] = bags;
    return first.split('').find(character => rest.every(other => other.includes(character))) ?? ' ';
}

/* To help prioritize item rearrangement, every item type can be converted to a priority:
 * Lowercase item types a through z have priorities 1 through 26.
 * Uppercase item types A through Z have priorities 27 through 52.*/
function getPriority(itemType: string): number {
    return ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(itemType);
}

let compartments = rucksacks.map(splitToCompartments);
console.log({ compartments });

let commonItems = compartments.map(findCommonType);
console.log({ commonItems });

let priorities = commonItems.map(getPriority);
console.log('Part 1: sum of priorities is', sum(priorities)); // 7831


// part 2
let badgeGroups = splitToBadgeGroups(rucksacks);
let badgeGroupTypes = badgeGroups.map(group => findBadgeGroupType(group));
console.log({ badgeGroupTypes });
console.log('Part 2: sum of badge group priorities is', sum(badgeGroupTypes.map(getPriority))); // 2683
