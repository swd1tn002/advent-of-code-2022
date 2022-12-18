import path from 'path';
import { readFileSync } from 'fs';
import { splitLines } from '../utils/strings';
import { max, min } from '../utils/arrays';
import { Range } from '../utils/Range';

class Point3D {
    constructor(readonly x: number, readonly y: number, readonly z: number) { }

    neighbors(): Point3D[] {
        let { x, y, z } = this;
        return [
            new Point3D(x + 1, y, z), new Point3D(x - 1, y, z),
            new Point3D(x, y + 1, z), new Point3D(x, y - 1, z),
            new Point3D(x, y, z + 1), new Point3D(x, y, z - 1)
        ];
    }

    static parse(xyz: string): Point3D {
        let [x, y, z] = xyz.split(',').map(n => Number(n));
        return new Point3D(x, y, z);
    }

    toString(): string {
        return `${this.x},${this.y},${this.z}`;
    }
}

class Box3D {
    constructor(readonly x: Range, readonly y: Range, readonly z: Range) {
    }

    contains(point: Point3D): boolean {
        return this.x.contains(point.x) && this.y.contains(point.y) && this.z.contains(point.z);
    }

    *[Symbol.iterator]() {
        for (let x = this.x.start; x <= this.x.end; x++) {
            for (let y = this.y.start; y <= this.y.end; y++) {
                for (let z = this.z.start; z <= this.z.end; z++) {
                    yield new Point3D(x, y, z);
                }
            }
        }
    }
}

/**
 * "To approximate the surface area, count the number of sides of each cube that are not immediately connected to another
 * cube. So, if your scan were only two adjacent cubes like 1,1,1 and 2,1,1, each cube would have a single side covered
 * and five sides exposed, a total surface area of 10 sides."
 */
function getSurfaceArea(boulderSet: Set<string>): number {
    let cubes = Array.from(boulderSet).map(Point3D.parse);

    // Count the total number of sides in the cubes, that do not have another cube as a neighbor
    return cubes
        .flatMap(cube => cube.neighbors())
        .filter(neighbor => {
            return !boulderSet.has(neighbor.toString())
        }).length;
}

/**  Returns a box that surrounds all given points. */
function getSurroundingBox(boulders: Set<string>): Box3D {
    let coords = Array.from(boulders).map(xyz => xyz.split(',').map(n => Number(n)));
    let x = coords.map(c => c[0]);
    let y = coords.map(c => c[1]);
    let z = coords.map(c => c[2]);

    return new Box3D(
        new Range(min(x) - 1, max(x) + 1),
        new Range(min(y) - 1, max(y) + 1),
        new Range(min(z) - 1, max(z) + 1)
    );
}

function main() {
    /* "Because of how quickly the lava is moving, the scan isn't very good; its resolution is quite low and, as a result,
     * it approximates the shape of the lava droplet with 1x1x1 cubes on a 3D grid, each given as its x,y,z position. */
    const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

    // A set of 1x1x1 cubes in the shape, such as "1,1,1" or "2,2,5"
    let boulderSet = new Set(splitLines(puzzleInput));

    console.log('Part 1:', getSurfaceArea(boulderSet));

    /* "Something seems off about your calculation. The cooling rate depends on exterior surface area, but your calculation
     * also included the surface area of air pockets trapped in the lava droplet."
     *
     * "Instead, consider only cube sides that could be reached by the water and steam as the lava droplet tumbles into the
     * pond. The steam will expand to reach as much as possible, completely displacing any air on the outside of the lava
     * droplet but never expanding diagonally."
     */

    let bounds = getSurroundingBox(boulderSet);

    /* Visit all air positions that can be accessed from the starting point outside the shape.
    * All air positions other than these are air pockets inside the given shape. */
    let unvisited = [new Point3D(bounds.x.start, bounds.y.start, bounds.z.start).toString()];

    let surroundingAir = new Set<string>();
    while (unvisited.length > 0) {
        let next = unvisited.pop() as string;
        surroundingAir.add(next);

        Point3D.parse(next).neighbors().forEach(neighbor => {
            if (!bounds.contains(neighbor)) {
                return; // no air pockets can exist outside the bounds of the shape
            }

            let xyz = neighbor.toString();
            if (surroundingAir.has(xyz) || boulderSet.has(xyz)) {
                return; // the neighbor is already known, so no need to visit it
            }

            // add to queue to expand to later
            unvisited.push(neighbor.toString());
        });
    }

    // Iterate through all points in the surrounding box to find all points that are
    // not found in the air around the boulder nor the boulder itself. Then fill those points.
    let solidBoulder = new Set(boulderSet);

    for (let point of bounds) {
        let xyz = point.toString();

        if (!solidBoulder.has(xyz) && !surroundingAir.has(xyz)) {
            solidBoulder.add(xyz); // when an air pocket is found, fill it to make the shape solid!
        }
    }

    let exteriorArea = getSurfaceArea(solidBoulder);
    console.log('Part 2:', exteriorArea); // 2520
}

main();
