# Advent of code 2022 [![Node.js CI](https://github.com/swd1tn002/advent-of-code-2022/actions/workflows/node.js.yml/badge.svg)](https://github.com/swd1tn002/advent-of-code-2022/actions/workflows/node.js.yml) [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/swd1tn002/advent-of-code-2022)

This repository contains my personal solutions to [Advent of Code 2022](https://adventofcode.com/2022).

All solutions are written in TypeScript. Get started with:

```
$ npm install
$ npm test
```

## [Day 1: Calorie Counting](https://adventofcode.com/2022/day/1)

* 📄 [src/01_calories/elfCalories.ts](src/01_calories/elfCalories.ts)

```
$ npx ts-node src/01_calories/elfCalories.ts

Max calories: 71502
Top three calories total: 208191
```

Added utilities for handling puzzle input:

* 📄 [arrays.ts](./src/utils/arrays.ts), [arrays.test.ts](./src/utils/arrays.test.ts)
* 📄 [strings.ts](./src/utils/strings.ts), [strings.test.ts](./src/utils/strings.test.ts)


## [Day 2: Rock Paper Scissors](https://adventofcode.com/2022/day/2)

* 📄 [src/02_rock-paper-scissors/index.ts](src/02_rock-paper-scissors/index.ts)
* 📄 [src/02_rock-paper-scissors/rockPaperScissors.ts](src/02_rock-paper-scissors/rockPaperScissors.ts)
* 📄 [src/02_rock-paper-scissors/rockPaperScissors.test.ts](src/02_rock-paper-scissors/rockPaperScissors.test.ts)

```
$ npx ts-node src/02_rock-paper-scissors

Total score for part 1: 12855
Total score for part 2: 13726
```

Used enums and quite many switch-case structures.

Added Circle class for circular lists.

* 📄 [Circle.ts](./src/utils/Circle.ts), [Circle.test.ts](./src/utils/Circle.test.ts)

## [Day 3: Rucksack Reorganization](https://adventofcode.com/2022/day/3)

* 📄 [src/03_rucksack/index.ts](./src/03_rucksack/index.ts)
* 📄 [src/03_rucksack/rucksack.ts](./src/03_rucksack/rucksack.ts)
* 📄 [src/03_rucksack/rucksack.test.ts](./src/03_rucksack/rucksack.test.ts)

```
$ npx ts-node src/03_rucksack

Part 1: sum of priorities is 7831
Part 2: sum of badge group priorities is 2683
```

Until day 3, working in VS Code dev container was extremely slow due to WSL2 and NTFS issues: https://github.com/microsoft/WSL/issues/4197 / https://github.com/microsoft/WSL/issues/4515. I fixed the issue temporarily by moving `node_modules` outside of the NTFS volume and adding a symbolic link.


## [Day 4: Camp Cleanup](https://adventofcode.com/2022/day/4)

* 📄 [src/04_camp-cleanup/index.ts](./src/04_camp-cleanup/index.ts)
* 📄 [src/utils/Range.ts](./src/utils/Range.ts)
* 📄 [src/utils/Range.test.ts](./src/utils/Range.test.ts)

```
$ npx ts-node src/04_camp-cleanup

Pairs where one fully contains the other:  534
Pairs that overlap at all:  841
```

## [Day 5: Supply Stacks](https://adventofcode.com/2022/day/5)

* 📄 [src/05_supply-stacks/index.ts](./src/05_supply-stacks/index.ts)

```
$ npx ts-node src/05_supply-stacks

Part 1: ZRLJGSCTR
Part 2: PRTTGRFPB
```

## [Day 6: Tuning Trouble](https://adventofcode.com/2022/day/6)

* 📄 [src/06_tuning-trouble/index.ts](./src/06_tuning-trouble/index.ts)

```
$ npx ts-node src/06_tuning-trouble

Part 1, end of message: 1766
Part 2, start of message: 2383
```


## [Day 7: No Space Left On Device](https://adventofcode.com/2022/day/7)

* 📄 [src/07_no-space-left-on-device/index.ts](./src/07_no-space-left-on-device/index.ts)

```
$ npx ts-node src/07_no-space-left-on-device

Part 1: the total size of small directories is 1743217
Part 2: the smallest directory to free up enough space has size 8319096
```


## [Day 8: Treetop Tree House](https://adventofcode.com/2022/day/8)

* 📄 [src/08_treetop-tree-house/index.ts](./src/08_treetop-tree-house/index.ts)

```
$ npx ts-node src/08_treetop-tree-house

Part 1: the number of visible trees is 1845
Part 2: highest scenic score possible is 230112
```


## [Day 9: Rope Bridge](https://adventofcode.com/2022/day/9)

* 📄 [src/09_rope-bridge/index.ts](./src/09_rope-bridge/index.ts)
* 📄 [src/09_rope-bridge/Position.ts](./src/09_rope-bridge/Position.ts)
* 📄 [src/09_rope-bridge/Position.test.ts](./src/09_rope-bridge/Position.test.ts)

```
$ npx ts-node src/09_rope-bridge

Part 1: 6269
Part 2: 2557
```


## [Day 10: Cathode-Ray Tube](https://adventofcode.com/2022/day/10)

* 📄 [src/10_cathode-ray-tube/index.ts](./src/10_cathode-ray-tube/index.ts)


```
$ npx ts-node src/10_cathode-ray-tube

The sum of these signal strengths is: 17840

Text on CRT screen:

####..##..#.....##..#..#.#....###...##..
#....#..#.#....#..#.#..#.#....#..#.#..#.
###..#..#.#....#....#..#.#....#..#.#....
#....####.#....#.##.#..#.#....###..#.##.
#....#..#.#....#..#.#..#.#....#....#..#.
####.#..#.####..###..##..####.#.....###.
```


## [Day 11: Monkey in the Middle](https://adventofcode.com/2022/day/11)

* 📄 [src/11_monkey-in-the-middle/index.ts](./src/11_monkey-in-the-middle/index.ts)


```
$ npx ts-node ./src/11_monkey-in-the-middle

Part 1: monkey business level after 20 rounds: 66124
Part 2: monkey business level after 10 000 rounds: 19309892877
```


## [Day 12: Hill Climbing Algorithm](https://adventofcode.com/2022/day/12)

* 📄 [src/12_hill-climbing-algorithm/index.ts](./src/12_hill-climbing-algorithm/index.ts)

```
$ npx ts-node src/12_hill-climbing-algorithm

Part 1: the distance is 352
Part 2: the minimum distance is 345
```


## [Day 13: Distress Signal](https://adventofcode.com/2022/day/13)

* 📄 [src/13_distress_signal/index.ts](./src/13_distress_signal/index.ts)

```
$ npx ts-node src/13_distress_signal

Part 1: Sum of indices that are in the right order is 6272
Part 2: The decoder key is 22288
```


## [Day 14: Regolith Reservoir](https://adventofcode.com/2022/day/14)

* 📄 [src/14_regolith_reservoir/index.ts](./src/14_regolith_reservoir/index.ts)

```
$ npx ts-node src/14_regolith_reservoir

Part 1: there are 825 grains of sand.
Part 2: there are 26729 grains of sand.
```


## [Day 15: Beacon Exclusion Zone](https://adventofcode.com/2022/day/15)

* 📄 [src/15_beacon-exclusion-zone/index.ts](./src/15_beacon-exclusion-zone/index.ts)


```
$ npx ts-node src/15_beacon-exclusion-zone

Part 1: the number of positions that cannot contain a beacon is 4502208
Part 2: the distress signal is coming from 3446137,3204480
Part 2: the distress signal frequency is 13784551204480
```

## [Day 16: Proboscidea Volcanium](https://adventofcode.com/2022/day/16)

* 📄 [src/16_proboscidea-volcanium/index.ts](./src/16_proboscidea-volcanium/index.ts)

```
$ npx ts-node src/16_proboscidea-volcanium

Part 1: you can release 2253 pressure in 30 minutes
Part 2: you and 🐘 can release 2838 pressure in 26 minutes
```

## [Day 17: Pyroclastic Flow](https://adventofcode.com/2022/day/17)


* 📄 [src/17-pyroclastic-flow/index.ts](./src/17-pyroclastic-flow/index.ts)

```
$ npx ts-node src/17-pyroclastic-flow/

Part 1: height is 3219
Part 2: height is 1582758620701
```


## [Day 18: Boiling Boulders](https://adventofcode.com/2022/day/18)

* 📄 [src/18_boiling_boulders/index.ts](./src/18_boiling_boulders/index.ts)

```
$ npx ts-node src/18_boiling_boulders

Part 1: 4192
Part 2: 2520
```

## [Day 19: Not Enough Minerals](https://adventofcode.com/2022/day/19)

* 📄 [src/19_not-enough-minerals/index.ts](./src/19_not-enough-minerals/index.ts)

```
$ npx ts-node src/19_not-enough-minerals

Part 1: the sum of quality levels is 978
Part 2: largest geodes multiplied together are 15939
```


## [Day 20: Grove Positioning System](https://adventofcode.com/2022/day/20)

* 📄 [src/20_grove-positioning-system/index.ts](./src/20_grove-positioning-system/index.ts)
* 📄 [src/20_grove-positioning-system/mixer.ts](./src/20_grove-positioning-system/mixer.ts)
* 📄 [src/20_grove-positioning-system/mixer.test.ts](./src/20_grove-positioning-system/mixer.test.ts)

```
$ npx ts-node src/20_grove-positioning-system

Part 1: the sum of coordinates is 13522
Part 2: the sum of coordinates is 17113168880158
```
