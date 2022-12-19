import path from 'path';
import { readFileSync } from 'fs';
import { last, max } from '../utils/arrays';
import { splitLines, extractNumbers } from '../utils/strings';


class Minerals {
    constructor(
        readonly ore: number,
        readonly clay: number,
        readonly obsidian: number,
        readonly geode: number
    ) {
    }

    plus(other: Minerals): Minerals {
        return new Minerals(this.ore + other.ore, this.clay + other.clay, this.obsidian + other.obsidian, this.geode + other.geode);
    }

    minus(other: Minerals): Minerals {
        return new Minerals(this.ore - other.ore, this.clay - other.clay, this.obsidian - other.obsidian, this.geode - other.geode);
    }

    /** Returns whether this set has more or an equal amount of each miner than the other set. */
    gte(other: Minerals): boolean {
        return this.ore >= other.ore &&
            this.clay >= other.clay &&
            this.obsidian >= other.obsidian &&
            this.geode >= other.geode;
    }

    /**
     * Returns -1, 0 or 1 depending on the ordering of two sets of minerals.
     * Compares starting from the most valuable to the least valuable.
     */
    static compare(w1: Minerals, w2: Minerals): number {
        if (w1.geode !== w2.geode) {
            return w1.geode - w2.geode;
        }
        if (w1.obsidian !== w2.obsidian) {
            return w1.obsidian - w2.obsidian;
        }
        if (w1.clay !== w2.clay) {
            return w1.clay - w2.clay;
        }
        if (w1.ore !== w2.ore) {
            return w1.ore - w2.ore;
        }
        return 0;
    }
}

/**
 * "Each robot can collect 1 of its resource type per minute. It also takes one minute for the
 * robot factory (also conveniently from your pack) to construct any type of robot, although
 * it consumes the necessary resources available when construction begins."
 */
class RobotFleet {
    constructor(
        readonly oreRobots: number,
        readonly clayRobots: number,
        readonly obsidianRobots: number,
        readonly geodeRobots: number) {
    }

    /** "Each robot can collect 1 of its resource type per minute." */
    collect(): Minerals {
        return new Minerals(this.oreRobots, this.clayRobots, this.obsidianRobots, this.geodeRobots);
    }

    addOreRobot() {
        return new RobotFleet(this.oreRobots + 1, this.clayRobots, this.obsidianRobots, this.geodeRobots);
    }

    addClayRobot() {
        return new RobotFleet(this.oreRobots, this.clayRobots + 1, this.obsidianRobots, this.geodeRobots);
    }

    addObsidianRobot() {
        return new RobotFleet(this.oreRobots, this.clayRobots, this.obsidianRobots + 1, this.geodeRobots);
    }

    addGeodeRobot() {
        return new RobotFleet(this.oreRobots, this.clayRobots, this.obsidianRobots, this.geodeRobots + 1);
    }
}

/**
 * "The robot factory has many blueprints (your puzzle input) you can choose from, but once you've configured
 * it with a blueprint, you can't change it. You'll need to work out which blueprint is best."
 */
class Blueprint {
    private _maxOre: number;
    private _maxClay: number;
    private _maxObsidian: number;

    constructor(readonly id: number,
        readonly oreCost: Minerals,
        readonly clayCost: Minerals,
        readonly obsidianCost: Minerals,
        readonly geodeCost: Minerals) {

        // maximum number of each mineral is stored to prevent collecting too much of a specific mineral
        let all = [this.oreCost, this.clayCost, this.obsidianCost, this.geodeCost];
        this._maxOre = max(all.map(w => w.ore));
        this._maxClay = max(all.map(w => w.clay));
        this._maxObsidian = max(all.map(w => w.obsidian));
    }

    /**
     * Collects more minerals with the current robots until a new robot can be built or all time is consumed.
     * If building succeeds, will continue recursively building all other bots.
     */
    private buildOreRobot(w: Minerals, robots: RobotFleet, time: number): Minerals {
        if (!this.hasUseForOre(w, time)) {
            return w;
        }
        for (let t = time; t > 0; t--) {
            if (this.canBuildOreRobot(w)) {
                w = w.minus(this.oreCost).plus(robots.collect());
                robots = robots.addOreRobot();
                return this.maximizeGeodes(w, t - 1, robots);
            }
            w = w.plus(robots.collect());
        }
        return w;
    }

    /**
     * Collects more minerals with the current robots until a new robot can be built or all time is consumed.
     * If building succeeds, will continue recursively building all other bots.
     */
    private buildClayRobot(w: Minerals, robots: RobotFleet, time: number): Minerals {
        if (!this.hasUseForClay(w, time)) {
            return w;
        }
        for (let t = time; t > 0; t--) {
            if (this.canBuildClayRobot(w)) {
                w = w.minus(this.clayCost).plus(robots.collect());
                robots = robots.addClayRobot();
                return this.maximizeGeodes(w, t - 1, robots);
            }
            w = w.plus(robots.collect());
        }
        return w;
    }

    /**
     * Collects more minerals with the current robots until a new robot can be built or all time is consumed.
     * If building succeeds, will continue recursively building all other bots.
     */
    private buildObsidianRobot(w: Minerals, robots: RobotFleet, time: number): Minerals {
        if (!this.hasUseForObsidian(w, time)) {
            return w;
        }
        for (let t = time; t > 0; t--) {
            if (this.canBuildObsidianRobot(w)) {
                w = w.minus(this.obsidianCost).plus(robots.collect());
                robots = robots.addObsidianRobot();
                return this.maximizeGeodes(w, t - 1, robots);
            }
            w = w.plus(robots.collect());
        }
        return w;
    }

    /**
     * Collects more minerals with the current robots until a new robot can be built or all time is consumed.
     * If building succeeds, will continue recursively building all other bots.
     */
    private buildGeodeRobot(w: Minerals, robots: RobotFleet, time: number): Minerals {
        for (let t = time; t > 0; t--) {
            if (this.canBuildGeodeRobot(w)) {
                w = w.minus(this.geodeCost).plus(robots.collect());
                robots = robots.addGeodeRobot();
                return this.maximizeGeodes(w, t - 1, robots);
            }
            w = w.plus(robots.collect());
        }
        return w;
    }

    /** Consumes the remaining time collecting the harvest from existing robots, without creating new ones. */
    private buildNothing(w: Minerals, robots: RobotFleet, time: number): Minerals {
        for (let t = time; t > 0; t--) {
            w = w.plus(robots.collect());
        }
        return w;
    }

    private canBuildOreRobot(w: Minerals): boolean {
        return w.gte(this.oreCost);
    }

    private canBuildClayRobot(w: Minerals): boolean {
        return w.gte(this.clayCost);
    }

    private canBuildObsidianRobot(w: Minerals,): boolean {
        return w.gte(this.obsidianCost);
    }

    private canBuildGeodeRobot(w: Minerals): boolean {
        return w.gte(this.geodeCost);
    }

    /**
     * "You need to figure out which blueprint would maximize the number of opened geodes after X
     * minutes by figuring out which robots to build and when to build them."
     */
    public maximizeGeodes(minerals: Minerals, timeLeft: number, robots: RobotFleet): Minerals {
        if (timeLeft === 0) {
            return minerals;
        }

        if (this.canBuildGeodeRobot(minerals)) {
            // If it's possible to build a geode robot, it's always the best thing to do
            return this.buildGeodeRobot(minerals, robots, timeLeft);
        }

        // Iterate all possible next states where a new robot is built:
        let geodeRobot = this.buildGeodeRobot(minerals, robots, timeLeft);
        let obsidianRobot = this.buildObsidianRobot(minerals, robots, timeLeft);
        let clayRobot = this.buildClayRobot(minerals, robots, timeLeft);
        let oreRobot = this.buildOreRobot(minerals, robots, timeLeft);

        // Also consider the scenario where no robots are built:
        let buildNothing = this.buildNothing(minerals, robots, timeLeft);

        return last([geodeRobot, obsidianRobot, clayRobot, oreRobot, buildNothing].sort(Minerals.compare));
    }

    /** Checks if there is any use for more of the same mineral type. */
    private hasUseForOre(w: Minerals, time: number): boolean {
        return w.ore < this._maxOre * time;
    }

    /** Checks if there is any use for more of the same mineral type. */
    private hasUseForClay(w: Minerals, time: number): boolean {
        return w.clay < this._maxClay * time;
    }

    /** Checks if there is any use for more of the same mineral type. */
    private hasUseForObsidian(w: Minerals, time: number): boolean {
        return w.obsidian < this._maxObsidian * time;
    }

    /**
     * @param input Example: "Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 14 clay. Each geode robot costs 3 ore and 16 obsidian."
     */
    static parse(input: string): Blueprint {
        let [id, ore, clay, obs1, obs2, geo1, geo2] = extractNumbers(input.replace(/\./g, ''));
        return new Blueprint(id,
            new Minerals(ore, 0, 0, 0),
            new Minerals(clay, 0, 0, 0),
            new Minerals(obs1, obs2, 0, 0),
            new Minerals(geo1, 0, geo2, 0)
        );
    }
}

function main() {
    /* "Fortunately, you have exactly one ore-collecting robot in your pack that you can use to kickstart the whole operation." */
    const initialRobots = new RobotFleet(1, 0, 0, 0);
    const initialMinerals = new Minerals(0, 0, 0, 0);

    const puzzleInput = splitLines(readFileSync(path.join(__dirname, 'input.txt'), 'utf-8'));
    let blueprints = puzzleInput.map(Blueprint.parse);

    /**
     * Part 1:
     * "Determine the quality level of each blueprint by multiplying that blueprint's ID number with the largest
     * number of geodes that can be opened in 24 minutes using that blueprint."
     */
    let sum = 0;
    let timePart1 = 24;

    blueprints.forEach(b => {
        let quality = b.maximizeGeodes(initialMinerals, timePart1, initialRobots).geode * b.id;
        sum += quality;
    });

    console.log('Part 1: the sum of quality levels is', sum); // Part 1: 978


    /**
     * Part 2:
     *
     * "While you were choosing the best blueprint, the elephants found some food on their own, so you're not
     * in as much of a hurry; you figure you probably have 32 minutes before the wind changes direction again
     * and you'll need to get out of range of the erupting volcano."
     */
    let timePart2 = 32;

    /* "for each of the first three blueprints, determine the largest number of geodes you could open;
     * then, multiply these three values together." */
    let part2 = blueprints
        .slice(0, 3)
        .map(b => b.maximizeGeodes(initialMinerals, timePart2, initialRobots))
        .reduce((acc, result) => acc * result.geode, 1);

    console.log('Part 2: largest geodes multiplied together are', part2); // 15939
}

main();
