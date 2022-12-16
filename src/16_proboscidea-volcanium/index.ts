import path from 'path';
import { readFileSync } from 'fs';
import { splitLines } from '../utils/strings';
import { max } from '../utils/arrays';

/**
 * "You scan the cave for other options and discover a network
 * of pipes and pressure-release valves"
 */
class Valve {
    private static readonly valvesById: { [key: string]: Valve } = {};

    readonly distances: { [key: string]: number } = {};

    constructor(readonly id: string, readonly rate: number, private readonly _neighborIds: string[]) {
        Valve.valvesById[this.id] = this;
    }

    get neighbors(): Valve[] {
        return this._neighborIds.map(id => Valve.valvesById[id]);
    }

    distanceTo(other: Valve): number {
        if (!(other.id in this.distances)) {
            throw new Error(`No distance from ${this.id} to ${other}.id`)
        }
        return this.distances[other.id];
    }

    static get(id: string) {
        return Valve.valvesById[id];
    }

    static all() {
        return Object.values(Valve.valvesById);
    }

    /**
     * "your device produces a report (your puzzle input) of each valve's flow rate if it were
     * opened (in pressure per minute) and the tunnels you could use to move between the valves."
     */
    static parse(input: string): Valve {
        /* The input may have two slightly different forms:
         * Valve HC has flow rate=24; tunnel leads to valve XH
         * or
         * Valve QI has flow rate=0; tunnels lead to valves KQ, LS */
        let [_valve, id, _has, _flow, _rate, rate, _tunnel, _leads, _to, _valves, ...to] = input
            .replace(/[=;,]/g, ' ').split(/\s+/g); // replace special characters and split on whitespace

        return new Valve(id, Number(rate), to);
    }
}


/** Using Dijkstra's algorithm to update the distances from each valve to all others. */
function updateDistances(from: Valve) {
    let distances = { [from.id]: 0 };
    let queue = Valve.all();

    // if the distance is not yet unknown, let's say it's infinite
    const distance = (to: Valve) => distances[to.id] ?? Infinity;

    while (queue.length > 0) {
        // get the valve that has the shortest known distance to
        let next = queue.reduce((closest, current) => distance(current) < distance(closest) ? current : closest, queue[0]);

        // update the shortest paths to the neibors
        next.neighbors
            .filter(neighbor => queue.includes(neighbor))
            .forEach(unvisited => distances[unvisited.id] = distances[next.id] + 1);

        queue = queue.filter(v => v !== next); // remove the valve from queue
    }
    Object.assign(from.distances, distances);
}

/**
 * "Making your way through the tunnels like this, you could probably open many or all of the valves by
 * the time (30/26 minutes) have elapsed. However, you need to release as much pressure as possible,
 * so you'll need to be methodical."
 */
function openAndMove(current: Valve, unopened: Valve[], timeRemaining: number): number {
    if (timeRemaining <= 0) {
        throw new Error('No time remaining');
    }

    // "its flow rate is 0, so there's no point in opening it..."
    if (current.rate > 0) {
        // "You estimate it will take you one minute to open a single valve
        // and one minute to follow any tunnel from one valve to another."
        timeRemaining--;
    }

    // Opening the valve will release pressure during the remaining X minutes at a flow rate of Y.
    let pressureFromCurrent = current.rate * timeRemaining;

    // Try all possible valves as the next one and recursively find the one that has the best outcome.
    let paths = unopened.map(next => {
        // moving to next takes `dist` minutes
        let distance = current.distanceTo(next);
        let remainingTime = timeRemaining - distance;

        if (remainingTime >= 1) {
            // still time to move and open another one!
            let remainingValves = unopened.filter(v => v !== next);
            return openAndMove(next, remainingValves, remainingTime);
        } else {
            // no time to move
            return 0;
        }
    });

    return pressureFromCurrent + max(paths);
}

/**
 * "Would having two of you working together be better, even if it means having less time?"
 * This function tries to split the input between the two players in all possible ways to
 * find the best total outcome.
 *
 * @param start starting point for both players
 * @param valves valves remaining to be shared across players
 * @param p1Valves valves for player 1 to open
 * @param p2Valves valves for player 2 to open
 * @param time how much time the players have to open their valves
 * @returns the maximum amount two players can release pressure in given time
 */
function tryAllCombinations(start: Valve, valves: Valve[], p1Valves: Valve[], p2Valves: Valve[], time: number): number {
    if (valves.length > 0) {
        let [first, ...rest] = [...valves];

        // try both combinations: player 1 takes the next valve or player 2 takes the next valve:
        let p1 = tryAllCombinations(start, rest, [first, ...p1Valves], p2Valves, time);
        let p2 = tryAllCombinations(start, rest, p1Valves, [first, ...p2Valves], time);

        // return the better result from the attempts:
        return max([p1, p2]);
    }
    return openAndMove(start, p1Valves, time) + openAndMove(start, p2Valves, time);
}

function main() {
    const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
    let valves = splitLines(puzzleInput).map(Valve.parse);

    // To optimize the solution, distances are pre-calculated from each valve to another.
    // This way we can exclude stuck valves and navigate directly to the next closed useful valve.
    valves.forEach(updateDistances);

    // "All of the valves begin closed. You start at valve AA."
    let start = Valve.get('AA');
    let goodValves = [start, ...valves.filter(v => v.rate > 0)];

    let part1 = openAndMove(start, goodValves, 30);

    console.log(`Part 1: you can release ${part1} pressure in 30 minutes`); // 2253

    /* "It would take you 4 minutes to teach an elephant how to open the right valves in the
     * right order, leaving you with only 26 minutes to actually execute your plan." */
    let part2 = tryAllCombinations(start, goodValves, [start], [start], 26);

    // "With you and an elephant working together for 26 minutes, what is the most pressure you could release?"
    console.log(`Part 2: you and 🐘 can release ${part2} pressure in 26 minutes`); // 2838
}

main();
