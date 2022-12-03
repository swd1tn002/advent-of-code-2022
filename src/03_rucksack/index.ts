import { readFileSync } from 'fs';
import { sum } from '../utils/arrays';
import { splitLines } from '../utils/strings';
import { findBadgeGroupType, findCommonType, getPriority, splitToBadgeGroups, splitToCompartments } from "./rucksack";

const puzzleInput = readFileSync(__dirname + '/input.txt', 'utf-8');
let rucksacks = splitLines(puzzleInput);

// part 1
let rucksacksWithCompartments = rucksacks.map(splitToCompartments);
let commonItemsInCompartments = rucksacksWithCompartments.map(findCommonType);
let prioritiesOfCommonItems = commonItemsInCompartments.map(getPriority);
console.log('Part 1: sum of priorities is', sum(prioritiesOfCommonItems)); // 7831


// part 2
let badgeGroups = splitToBadgeGroups(rucksacks);
let badgeGroupTypes = badgeGroups.map(group => findBadgeGroupType(group));
console.log('Part 2: sum of badge group priorities is', sum(badgeGroupTypes.map(getPriority))); // 2683
