# Advent of code 2022 [![Node.js CI](https://github.com/swd1tn002/advent-of-code-2022/actions/workflows/node.js.yml/badge.svg)](https://github.com/swd1tn002/advent-of-code-2022/actions/workflows/node.js.yml) [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/swd1tn002/advent-of-code-2022)

This repository contains my personal solutions to Advent of Code 2022. See https://adventofcode.com/2022.

All solutions are written in TypeScript.

## [Day 1: Calorie Counting](https://adventofcode.com/2022/day/1)

* 📄 [src/01_calories/elfCalories.ts](src/01_calories/elfCalories.ts)

```
$ npm exec ts-node src/01_calories/elfCalories.ts

Max calories: 71502
Top three calories total: 208191
```

Added utilities for handling puzzle input: 

* 📄 [arrays.ts](./src/utils/arrays.ts)
* 📄 [strings.ts](./src/utils/strings.ts)

## [Day 2: Rock Paper Scissors](https://adventofcode.com/2022/day/2)

* 📄 [src/02_rock-paper-scissors/index.ts](src/02_rock-paper-scissors/index.ts)
* 📄 [src/02_rock-paper-scissors/rockPaperScissors.ts](src/02_rock-paper-scissors/rockPaperScissors.ts)

```
$ npm exec ts-node src/02_rock-paper-scissors

Total score for part 1: 12855
Total score for part 2: 13726
```

Used enums and quite many switch-case structures.

