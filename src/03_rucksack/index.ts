import { readFileSync } from 'fs';
import path from 'path';
import { sum } from '../utils/arrays';
import { splitLines } from '../utils/strings';
import { findBadgeGroupType, findCommonType, getPriority, splitToBadgeGroups, splitToCompartments } from "./rucksack";

const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
let rucksacks = splitLines(puzzleInput);


/* part 1: Find the item type that appears in both compartments of each rucksack.
 * What is the sum of the priorities of those item types? */
let commonItemTypes = rucksacks
    .map(splitToCompartments)
    .map(([left, right]) => findCommonType(left, right));
let prioritiesOfCommonItems = commonItemTypes.map(getPriority);
console.log('Part 1: sum of priorities is', sum(prioritiesOfCommonItems)); // 7831


/* part 2 : Find the item type that corresponds to the badges of each three-Elf group.
 * What is the sum of the priorities of those item types? */
let badgeGroups = splitToBadgeGroups(rucksacks);
let badgeGroupTypes = badgeGroups.map(group => findBadgeGroupType(group));
console.log('Part 2: sum of badge group priorities is', sum(badgeGroupTypes.map(getPriority))); // 2683
