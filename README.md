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
$ npx ts-node src/03_rucksack/

Part 1: sum of priorities is 7831
Part 2: sum of badge group priorities is 2683
```

Until day 3, working in VS Code dev container was extremely slow due to WSL2 and NTFS issues: https://github.com/microsoft/WSL/issues/4197 / https://github.com/microsoft/WSL/issues/4515. I fixed the issue temporarily by moving `node_modules` outside of the NTFS volume and adding a symbolic link.


## [Day 4: Camp Cleanup](https://adventofcode.com/2022/day/4)

* 📄 [src/04_camp-cleanup/index.ts](./src/04_camp-cleanup/index.ts)
* 📄 [src/utils/Range.ts](./src/utils/Range.ts)
* 📄 [src/utils/Range.test.ts](./src/utils/Range.test.ts)

```
$ npx ts-node src/04_camp-cleanup/

Pairs where one fully contains the other:  534
Pairs that overlap at all:  841
```
