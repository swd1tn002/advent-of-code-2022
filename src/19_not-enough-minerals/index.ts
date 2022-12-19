import path from 'path';
import { readFileSync } from 'fs';
import { last, max, min, reverseRows, sortNumbers, splitToChunks, transpose } from '../utils/arrays';

console.time('⏱');

const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

class BestWallet {
    private _best: Wallet;

    constructor(initial: Wallet) {
        this._best = initial;
    }

    get best(): Wallet {
        return this._best;
    }

    update(other: Wallet) {
        if (other.gte(this.best)) {
            this._best = other;
        }
        return this._best;
    }

    canImprove(other: Wallet, time: number, robots: Robots) {
        let max = other.geode;
        for (let i = 0; i < time; i++) {
            // assume that each time step there is one more robot creating geodes
            max += i + robots.geodeRobots;
        }
        return max >= this.best.geode;
    }
}

class Wallet {
    constructor(
        readonly ore: number,
        readonly clay: number,
        readonly obsidian: number,
        readonly geode: number
    ) {
    }

    plus(other: Wallet): Wallet {
        return new Wallet(this.ore + other.ore, this.clay + other.clay, this.obsidian + other.obsidian, this.geode + other.geode);
    }

    minus(other: Wallet): Wallet {
        return new Wallet(this.ore - other.ore, this.clay - other.clay, this.obsidian - other.obsidian, this.geode - other.geode);
    }

    gte(other: Wallet): boolean {
        return this.ore >= other.ore &&
            this.clay >= other.clay &&
            this.obsidian >= other.obsidian &&
            this.geode >= other.geode;
    }

    static compare(w1: Wallet, w2: Wallet): number {
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

type Cache = { [key: string]: Wallet };

class Robots {
    constructor(
        readonly oreRobots: number,
        readonly clayRobots: number,
        readonly obsidianRobots: number,
        readonly geodeRobots: number) {
    }

    /** "Each robot can collect 1 of its resource type per minute." */
    collect(): Wallet {
        return new Wallet(this.oreRobots, this.clayRobots, this.obsidianRobots, this.geodeRobots);
    }
}

const emptyWallet = new Wallet(0, 0, 0, 0);
const oneOreRobot = new Robots(1, 0, 0, 0);


class Blueprint {
    private _maxOre: number;
    private _maxClay: number;
    private _maxObsidian: number;

    constructor(readonly id: number,
        readonly oreCost: Wallet,
        readonly clayCost: Wallet,
        readonly obsidianCost: Wallet,
        readonly geodeCost: Wallet) {

        this._maxOre = max([this.oreCost, this.clayCost, this.obsidianCost, this.geodeCost].map(w => w.ore));
        this._maxClay = max([this.oreCost, this.clayCost, this.obsidianCost, this.geodeCost].map(w => w.clay));
        this._maxObsidian = max([this.oreCost, this.clayCost, this.obsidianCost, this.geodeCost].map(w => w.obsidian));
    }

    canBuildOreRobot(w: Wallet): boolean {
        return w.gte(this.oreCost);
    }

    canBuildClayRobot(w: Wallet): boolean {
        return w.gte(this.clayCost);
    }

    canBuildObsidianRobot(w: Wallet,): boolean {
        return w.gte(this.obsidianCost);
    }
    canBuildGeodeRobot(w: Wallet): boolean {
        return w.gte(this.geodeCost);
    }

    buildOreRobot(w: Wallet, robots: Robots): [Wallet, Robots] {
        return [w.minus(this.oreCost), new Robots(robots.oreRobots + 1, robots.clayRobots, robots.obsidianRobots, robots.geodeRobots)];
    }

    buildClayRobot(w: Wallet, robots: Robots): [Wallet, Robots] {
        return [w.minus(this.clayCost), new Robots(robots.oreRobots, robots.clayRobots + 1, robots.obsidianRobots, robots.geodeRobots)];
    }

    buildObsidianRobot(w: Wallet, robots: Robots): [Wallet, Robots] {
        return [w.minus(this.obsidianCost), new Robots(robots.oreRobots, robots.clayRobots, robots.obsidianRobots + 1, robots.geodeRobots)];
    }

    buildGeodeRobot(w: Wallet, robots: Robots): [Wallet, Robots] {
        return [w.minus(this.geodeCost), new Robots(robots.oreRobots, robots.clayRobots, robots.obsidianRobots, robots.geodeRobots + 1)];
    }

    /**
     * "Determine the quality level of each blueprint by multiplying that blueprint's ID number with the largest
     * number of geodes that can be opened in 24 minutes using that blueprint."
     */
    getQualityLevel(time: number): number {
        let wallet = this.maximizeGeodes(emptyWallet, time, oneOreRobot, {});
        console.log(wallet);
        return this.id * wallet.geode;
    }

    maximizeGeodes(wallet: Wallet, timeLeft: number, robots: Robots, cache: Cache): Wallet {
        let cacheKey = JSON.stringify({ wallet, timeLeft, robots });
        if (cacheKey in cache) {
            //console.log(cacheKey);
            //console.log('cache hit')
            return cache[cacheKey];
        }

        // Each robot can collect 1 of its resource type per minute.
        let income = robots.collect();

        if (timeLeft === 1) {
            // just a minute left, no need to build anything
            return wallet.plus(income);
        }

        let wallets = new Array<Wallet>();

        // It also takes one minute for the robot factory to construct any type of robot,
        // although it consumes the necessary resources available when construction begins.
        if (this.canBuildGeodeRobot(wallet)) {
            let [w, r] = this.buildGeodeRobot(wallet, robots);
            wallets.push(this.maximizeGeodes(w.plus(income), timeLeft - 1, r, cache));
        } else {

            if (this.canBuildObsidianRobot(wallet) && this.hasUseForObsidian(wallet, timeLeft)) {
                let [w, r] = this.buildObsidianRobot(wallet, robots);
                wallets.push(this.maximizeGeodes(w.plus(income), timeLeft - 1, r, cache));
            }
            if (this.canBuildClayRobot(wallet) && this.hasUseForClay(wallet, timeLeft)) {
                let [w, r] = this.buildClayRobot(wallet, robots);
                wallets.push(this.maximizeGeodes(w.plus(income), timeLeft - 1, r, cache));
            }
            if (this.canBuildOreRobot(wallet) && this.hasUseForOre(wallet, timeLeft)) {
                let [w, r] = this.buildOreRobot(wallet, robots);
                wallets.push(this.maximizeGeodes(w.plus(income), timeLeft - 1, r, cache));
            }

            // do not build any robots... instead continue with the current robots to save more minerals for other bots
            wallets.push(this.maximizeGeodes(wallet.plus(income), timeLeft - 1, robots, cache));

        }

        let best = last(wallets.sort(Wallet.compare));
        cache[cacheKey] = best;
        return best;
    }

    /** Checks if the wallet already contains resources that cannot be consumed in given time. */
    private hasUseForOre(w: Wallet, time: number): boolean {
        return w.ore < this._maxOre * time;
    }

    /** Checks if the wallet already contains resources that cannot be consumed in given time. */
    private hasUseForClay(w: Wallet, time: number): boolean {
        return w.clay < this._maxClay * time;
    }

    /** Checks if the wallet already contains resources that cannot be consumed in given time. */
    private hasUseForObsidian(w: Wallet, time: number): boolean {
        return w.obsidian < this._maxObsidian * time;
    }
}




`Blueprint 1:
  Each ore robot costs 4 ore.
  Each clay robot costs 2 ore.
  Each obsidian robot costs 3 ore and 14 clay.
  Each geode robot costs 2 ore and 7 obsidian.

  Blueprint 2:
  Each ore robot costs 2 ore.
  Each clay robot costs 3 ore.
  Each obsidian robot costs 3 ore and 8 clay.
  Each geode robot costs 3 ore and 12 obsidian.`

let b1 = new Blueprint(1,
    new Wallet(4, 0, 0, 0),
    new Wallet(2, 0, 0, 0),
    new Wallet(3, 14, 0, 0),
    new Wallet(2, 0, 7, 0)
);
let b2 = new Blueprint(2,
    new Wallet(2, 0, 0, 0),
    new Wallet(3, 0, 0, 0),
    new Wallet(3, 8, 0, 0),
    new Wallet(3, 0, 12, 0)
);


let blu1 = new Blueprint(1, new Wallet(4, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(4, 14, 0, 0), new Wallet(3, 0, 16, 0));
let blu2 = new Blueprint(2, new Wallet(4, 0, 0, 0), new Wallet(3, 0, 0, 0), new Wallet(2, 5, 0, 0), new Wallet(2, 0, 10, 0));
let blu3 = new Blueprint(3, new Wallet(3, 0, 0, 0), new Wallet(3, 0, 0, 0), new Wallet(3, 20, 0, 0), new Wallet(2, 0, 12, 0));
let blu4 = new Blueprint(4, new Wallet(3, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(4, 6, 0, 0), new Wallet(2, 0, 20, 0));
let blu5 = new Blueprint(5, new Wallet(2, 0, 0, 0), new Wallet(2, 0, 0, 0), new Wallet(2, 20, 0, 0), new Wallet(2, 0, 14, 0));
let blu6 = new Blueprint(6, new Wallet(4, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(2, 14, 0, 0), new Wallet(4, 0, 19, 0));
let blu7 = new Blueprint(7, new Wallet(3, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(3, 17, 0, 0), new Wallet(3, 0, 7, 0));
let blu8 = new Blueprint(8, new Wallet(2, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(4, 13, 0, 0), new Wallet(3, 0, 11, 0));
let blu9 = new Blueprint(9, new Wallet(2, 0, 0, 0), new Wallet(2, 0, 0, 0), new Wallet(2, 17, 0, 0), new Wallet(2, 0, 10, 0));
let blu10 = new Blueprint(10, new Wallet(2, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(3, 19, 0, 0), new Wallet(4, 0, 13, 0));
let blu11 = new Blueprint(11, new Wallet(4, 0, 0, 0), new Wallet(3, 0, 0, 0), new Wallet(2, 10, 0, 0), new Wallet(4, 0, 10, 0));
let blu12 = new Blueprint(12, new Wallet(4, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(4, 17, 0, 0), new Wallet(4, 0, 20, 0));
let blu13 = new Blueprint(13, new Wallet(4, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(2, 17, 0, 0), new Wallet(3, 0, 11, 0));
let blu14 = new Blueprint(14, new Wallet(2, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(3, 20, 0, 0), new Wallet(2, 0, 17, 0));
let blu15 = new Blueprint(15, new Wallet(4, 0, 0, 0), new Wallet(3, 0, 0, 0), new Wallet(4, 19, 0, 0), new Wallet(4, 0, 12, 0));
let blu16 = new Blueprint(16, new Wallet(3, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(3, 18, 0, 0), new Wallet(4, 0, 19, 0));
let blu17 = new Blueprint(17, new Wallet(2, 0, 0, 0), new Wallet(2, 0, 0, 0), new Wallet(2, 8, 0, 0), new Wallet(2, 0, 14, 0));
let blu18 = new Blueprint(18, new Wallet(4, 0, 0, 0), new Wallet(3, 0, 0, 0), new Wallet(2, 14, 0, 0), new Wallet(2, 0, 7, 0));
let blu19 = new Blueprint(19, new Wallet(4, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(2, 14, 0, 0), new Wallet(4, 0, 15, 0));
let blu20 = new Blueprint(20, new Wallet(3, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(4, 14, 0, 0), new Wallet(4, 0, 10, 0));
let blu21 = new Blueprint(21, new Wallet(4, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(4, 7, 0, 0), new Wallet(2, 0, 16, 0));
let blu22 = new Blueprint(22, new Wallet(3, 0, 0, 0), new Wallet(3, 0, 0, 0), new Wallet(3, 19, 0, 0), new Wallet(3, 0, 19, 0));
let blu23 = new Blueprint(23, new Wallet(2, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(3, 20, 0, 0), new Wallet(2, 0, 16, 0));
let blu24 = new Blueprint(24, new Wallet(2, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(4, 19, 0, 0), new Wallet(2, 0, 18, 0));
let blu25 = new Blueprint(25, new Wallet(3, 0, 0, 0), new Wallet(3, 0, 0, 0), new Wallet(3, 17, 0, 0), new Wallet(4, 0, 8, 0));
let blu26 = new Blueprint(26, new Wallet(3, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(4, 20, 0, 0), new Wallet(4, 0, 16, 0));
let blu27 = new Blueprint(27, new Wallet(4, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(3, 20, 0, 0), new Wallet(2, 0, 10, 0));
let blu28 = new Blueprint(28, new Wallet(4, 0, 0, 0), new Wallet(3, 0, 0, 0), new Wallet(3, 10, 0, 0), new Wallet(3, 0, 10, 0));
let blu29 = new Blueprint(29, new Wallet(4, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(2, 9, 0, 0), new Wallet(3, 0, 15, 0));
let blu30 = new Blueprint(30, new Wallet(3, 0, 0, 0), new Wallet(4, 0, 0, 0), new Wallet(3, 19, 0, 0), new Wallet(3, 0, 8, 0));


let time = 24;

let blueprints = [blu1,
    blu2,
    blu3,
    blu4,
    blu5,
    blu6,
    blu7,
    blu8,
    blu9,
    blu10,
    blu11,
    blu12,
    blu13,
    blu14,
    blu15,
    blu16,
    blu17,
    blu18,
    blu19,
    blu20,
    blu21,
    blu22,
    blu23,
    blu24,
    blu25,
    blu26,
    blu27,
    blu28,
    blu29,
    blu30];

blueprints = [b1, b2];
//console.log(b1.getQualityLevel(time));
//console.log(b2.getQualityLevel(time));
let sum = 0;
blueprints.forEach(b => {
    let quality = b.getQualityLevel(time);
    sum += quality;
    console.log(quality);
    console.timeLog('⏱');
});

console.log({ sum }); // 747 is too low, 976 is too low

console.timeEnd('⏱');
