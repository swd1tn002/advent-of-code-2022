import path from 'path';
import { readFileSync } from 'fs';
import { splitLines, extractNumbers } from '../utils/strings';
import { Range } from '../utils/Range';
import { last, max, min, sum } from '../utils/arrays';


class Point {
    constructor(readonly x: number, readonly y: number) {
    }

    getDistance(p: Point): number {
        return Math.abs(p.x - this.x) + Math.abs(p.y - this.y);
    }

    /**
     * "Tuning frequency, [which] can be found by multiplying [its] x coordinate
     * by 4 000 000 and then adding its y coordinate."
     */
    getTuningFrequency(): number {
        return this.x * 4_000_000 + this.y;
    }
}

/**
 * "Each sensor knows its own position and can determine the position of a beacon precisely" */
class Sensor {
    constructor(readonly location: Point, readonly closestBeacon: Point) {
    }

    /** Sensors can only lock on to the one beacon closest to the sensor as measured by the Manhattan distance. */
    get distance() {
        return this.location.getDistance(this.closestBeacon);
    }

    /** Is the given point in the sensor's reading area? */
    inArea(p: Point): boolean {
        return this.location.getDistance(p) <= this.distance;
    }

    /**
     * Returns the range of X coordinates covered by this sensor on the given line on Y-axis.
     */
    rangeOnLine(y: number): Range {
        let distY = Math.abs(this.location.y - y);
        if (this.distance >= distY) {
            let dX = Math.abs(this.distance - distY); // remaining manhattan distance for X
            return new Range(this.location.x - dX, this.location.x + dX);
        }
        return new Range(0, -1);
    }

    /**
     * Calculates the coordinates that are directly adjacent to the area observed by
     * this sensor and yields them one by one.
    */
    *surroundingPoints(): Generator<Point> {
        let aroundDistance = this.distance + 1;

        for (let dY = -aroundDistance; dY <= aroundDistance; dY++) {
            let y = this.location.y + dY;
            let dX = aroundDistance - dY;
            let [x0, x1] = [this.location.x - dX, this.location.x + dX];

            yield new Point(x0, y);
            yield new Point(x1, y);
        }
    }
}

/**
 * "Sensor at x=2, y=18: closest beacon is at x=-2, y=15" => new Sensor(Point(2, 18), new Point(-2, 15))
 */
function parseSensor(line: string): Sensor {
    let [sensorX, sensorY, beaconX, beaconY] = extractNumbers(line);
    return new Sensor(new Point(sensorX, sensorY), new Point(beaconX, beaconY));
}

const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
const sensors = splitLines(puzzleInput).map(parseSensor);

function main() {
    /*
     * Part 1:
     *
     * "Because each sensor only identifies its closest beacon, if a sensor detects a beacon, you know there
     * are no other beacons that close or closer to that sensor.There could still be beacons that just happen
     * to not be the closest beacon to any sensor."
     * "In the row where y=2000000, how many positions cannot contain a beacon?"
     */
    let line = 2_000_000;
    let rangesNotContainingBeacons: Range[] = sensors.map(s => s.rangeOnLine(line)).filter(r => !r.isEmpty());

    // The ranges of sensors overlap, so we merge the overlapping ones together:
    let nonOverlappingRanges = Range.joinRanges(rangesNotContainingBeacons);

    // How many (unique) spots on the line are already occupied by sensors and beacons?
    let sensorsOnLine = new Set(sensors.filter(s => s.location.y === line).map(s => s.location.x)).size;
    let beaconsOnLine = new Set(sensors.filter(s => s.closestBeacon.y === line).map(s => s.closestBeacon.x)).size;

    let coveredPositions = sum(nonOverlappingRanges.map(r => r.size));
    console.log('Part 1: number of positions that cannot contain a beacon is', (coveredPositions - sensorsOnLine - beaconsOnLine)); // 4502208

    function inBounds(p: Point, spaceSize: number): boolean {
        let { x, y } = p;
        return 0 <= min([x, y]) && max([x, y]) <= spaceSize;
    }

    /**
     * "The distress beacon is not detected by any sensor, but the distress beacon must have x and
     * y coordinates each no lower than 0 and no larger than 4000000."
     */
    let coordinateRange = new Range(0, 4_000_000);

    // "Find the only possible position for the distress beacon. What is its tuning frequency?"
    for (let sensor of sensors) {
        for (let point of sensor.surroundingPoints()) {
            if (coordinateRange.contains(point.x) &&
                coordinateRange.contains(point.y) &&
                sensors.every(sensor => !sensor.inArea(point))
            ) {
                console.log(`Part 2: the distress signal is coming from ${point.x},${point.y}`);
                console.log(`Part 2: the distress signal frequency is ${point.getTuningFrequency()}`); // 13784551204480
                return;
            }
        }
    }
}

main();
