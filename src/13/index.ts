import path from 'path';
import { readFileSync } from 'fs';
import { splitStringMatrix } from '../utils/strings';
import { sum } from '../utils/arrays';

/* "Packet data consists of lists and integers. Each list starts with [, ends with ],
 * and contains zero or more comma-separated values (either integers or other lists).
 *Each packet is always a list and appears on its own line. */
const puzzleInput = readFileSync(path.join(__dirname, '/input.txt'), 'utf-8');
let pairs: [string, string][] = splitStringMatrix(puzzleInput, '\n\n', '\n') as [string, string][];

/**
 * This function returns a negative value if the first packet is less than the second packet,
 * zero if they're equal, and a positive value otherwise.
 */
function comparePackets(left: string, right: string): number {
    return compareArrays(JSON.parse(left), JSON.parse(right));
}

/**
 * "When comparing two values, the first value is called left and the second value is called right."
 */
function compareArrays(packet1: any[], packet2: any[]): number {
    let res: number = 0;

    while (packet1.length || packet2.length) {
        let left = packet1.shift();
        let right = packet2.shift();

        if (typeof left === 'undefined') {
            return -1; // If the left list runs out of items first, the inputs are in the right order.
        }
        if (typeof right === 'undefined') {
            return 1; // If the right list runs out of items first, the inputs are not in the right order.
        }

        if (Array.isArray(left) && Array.isArray(right)) {
            res = compareArrays(left, right);
        } else if (Number.isInteger(left) && Number.isInteger(right)) {
            res = validateNumbers(left, right);
        } else {
            res = compareArrays(toArray(left), toArray(right));
        }

        if (res !== 0) {
            break;
        }
    }

    return res;
}

/**
 * "If both values are integers, the lower integer should come first. If the left integer
 * is lower than the right integer, the inputs are in the right order. If the left integer
 * is higher than the right integer, the inputs are not in the right order. Otherwise, the
 * inputs are the same integer; continue checking the next part of the input."
 */
function validateNumbers(left: number, right: number): number {
    return left - right;
}

/** Wraps the given value in an array unless it already is an array. */
function toArray(value: any): any[] {
    return Array.isArray(value) ? value : [value];
}


function main() {
    /* "What are the indices of the pairs that are already in the right order?
     * (The first pair has index 1, the second pair has index 2, and so on.) */
    let validRows = new Array<number>();

    pairs.forEach(([left, right], index) => {
        if (comparePackets(left, right) < 0) {
            validRows.push(index + 1);
        }
    });

    console.log('Part 1: Sum of indices that are in the right order is', sum(validRows)); // 6272

    /* The distress signal protocol also requires that you include two additional divider packets: */
    let dividers = ['[[2]]', '[[6]]'];
    let allPackets = [...pairs.flat(), ...dividers];

    /* "Using the same rules as before, organize all packets - the ones in your list of received
    * packets as well as the two divider packets - into the correct order. */
    allPackets.sort((a, b) => comparePackets(a, b));

    /* "Afterward, locate the divider packets. To find the decoder key for this distress signal,
    * you need to determine the indices of the two divider packets and multiply them together. */
    let div1 = allPackets.indexOf(dividers[0]) + 1;
    let div2 = allPackets.indexOf(dividers[1]) + 1;
    console.log('Part 2: The decoder key is', div1 * div2); // 22288
}

main();
