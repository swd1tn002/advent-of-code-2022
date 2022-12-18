import path from 'path';
import { readFileSync } from 'fs';
import { splitLines, splitNumberMatrix } from '../utils/strings';
import { max } from '../utils/arrays';


const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
let boulderSet = new Set(splitLines(puzzleInput));
let boulders = splitNumberMatrix(puzzleInput, '\n', ',');

function countExteriorArea(boulders: number[][]) {
    let count = 0;
    for (let [x, y, z] of boulders) {
        //console.log({ x, y, z });

        let p1 = [x + 1, y, z].join(',')
        let p2 = [x - 1, y, z].join(',')
        let p3 = [x, y + 1, z].join(',')
        let p4 = [x, y - 1, z].join(',')
        let p5 = [x, y, z + 1].join(',')
        let p6 = [x, y, z - 1].join(',')

        Array.from([p1, p2, p3, p4, p5, p6]).forEach(element => {
            if (!boulderSet.has(element)) {
                count++;
            }
        });
    }
    return count;
}

function main() {
    console.log('Part 1:', countExteriorArea(boulders));


    let maxX = max(boulders.map(b => b[0]));
    let maxY = max(boulders.map(b => b[1]));
    let maxZ = max(boulders.map(b => b[2]));

    let airSet = new Set<string>();
    let outFacing = new Set<string>();

    let unvisited = ['0,0,0'];

    while (unvisited.length > 0) {
        let xyz = unvisited.pop() as string;
        airSet.add(xyz);

        let [x, y, z] = xyz.split(',').map(i => Number(i));

        let p1 = [x + 1, y, z].join(',');
        let p2 = [x - 1, y, z].join(',');
        let p3 = [x, y + 1, z].join(',');
        let p4 = [x, y - 1, z].join(',');
        let p5 = [x, y, z + 1].join(',');
        let p6 = [x, y, z - 1].join(',');

        Array.from([p1, p2, p3, p4, p5, p6]).forEach(element => {
            if (x > maxX + 1 || y > maxY + 1 || z > maxZ + 1 || x < -1 || y < -1 || z < -1) {
                return;
            }
            if (airSet.has(element)) {
                // already visited
                return;
            }
            if (boulderSet.has(element)) {
                outFacing.add(element);
                return;
            }
            // continue from that element later
            unvisited.push(element);
        });
    }

    // fill air pockets
    for (let x = 0; x <= maxX; x++) {
        for (let y = 0; y <= maxY; y++) {
            for (let z = 0; z <= maxZ; z++) {
                let xyz = [x, y, z].join(',');

                if (!boulderSet.has(xyz) && !airSet.has(xyz)) {
                    // Air pocket!
                    console.log('air pocket at', xyz);

                    // fill it:
                    boulderSet.add(xyz);
                    boulders.push([x, y, z]);
                }
            }
        }
    }


    let part2 = countExteriorArea(boulders);
    console.log({ count2: part2 }); // 2520
}

main();