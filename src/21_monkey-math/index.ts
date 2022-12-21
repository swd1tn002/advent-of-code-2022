import path from 'path';
import { readFileSync } from 'fs';
import { splitStringMatrix } from '../utils/strings';

/*
 * For example:
 *
 * root: pppw + sjmn
 * dbpl: 5
 * cczh: sllz + lgvd
 */
const puzzleInput = readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

const monkeys = new Map<string, string>();
const monkeysAndEquations = splitStringMatrix(puzzleInput, '\n', ': ');
monkeysAndEquations.forEach(([id, equation]) => monkeys.set(id, equation));

/**
 * Recursively solves the given equation which may be the id of a single monkey,
 * an addition, subtraction, multiplication or division between two monkey id's
 * or a constant number value.
 */
function resolve(operation: string): string {
    // if operation is an equation, solve both sides recursively:
    if (operation.includes(' ')) {
        let [left, operand, right] = operation.split(' ') as [string, string, string];
        return `(${resolve(left)} ${operand} ${resolve(right)})`;
    }

    // if operation is the id of a monkey, solve its equation recursively:
    if (monkeys.has(operation)) {
        return resolve(monkeys.get(operation) as string);
    }

    // must be a constant or unknown monkey
    return operation;
}


/**
 * Solves the monkey's equations recursively starting from the given monkey,
 * so that the provided answer always applies. When the 'humn' monkey is alone
 * in the equation, then that answer is returned.
 */
function solveHuman(monkeyId: string, answer: number = 0): number {
    if (monkeyId === 'humn') {
        return answer;
    }

    let equation = monkeys.get(monkeyId) as string;
    let [left, op, right] = equation.split(' ') as [string, string, string];

    // try solving both sides of the equation individually:
    let leftEquation = resolve(left);
    let rightEquation = resolve(right);

    // If the left side of equation contains the "humn" variable, the right side must
    // have a constant value. Use the constant and known answer to recursively solve "humn".
    if (leftEquation.includes('humn')) {
        let rightValue = eval(rightEquation);
        switch (op) {
            case '=':
                return solveHuman(left, rightValue);
            case '+':
                return solveHuman(left, answer - rightValue);
            case '-':
                return solveHuman(left, answer + rightValue);
            case '*':
                return solveHuman(left, answer / rightValue);
            case '/':
                return solveHuman(left, answer * rightValue);
            default:
                throw new Error(monkeyId);
        }
    }

    // The right side of equation contains the "humn" variable and the left side
    // has a constant value. Use the left value and known answer to recursively solve "humn".
    let leftValue = eval(leftEquation);
    switch (op) {
        case '=':
            return solveHuman(right, leftValue);
        case '+':
            return solveHuman(right, answer - leftValue);
        case '-':
            return solveHuman(right, leftValue - answer);
        case '*':
            return solveHuman(right, answer / leftValue);
        case '/':
            return solveHuman(right, leftValue / answer);
        default:
            throw new Error(monkeyId);
    }
}

function main() {
    console.log('Part 1: the monkey named root will yell', eval(resolve('root')));

    /*
     * Part 2:
     *
     * "First, you got the wrong job for the monkey named root; specifically,
     * you got the wrong math operation. The correct operation for monkey root
     * should be =, which means that it still listens for two numbers
     * (from the same two monkeys as before), but now checks that the two
     * numbers match."
     */
    monkeys.set('root', (monkeys.get('root') as string).replace(/[\+\-\*\/]/, '='));

    /*
     * "Second, you got the wrong monkey for the job starting with humn:. It isn't
     * a monkey - it's you. Actually, you got the job wrong, too: you need to figure
     * out what number you need to yell so that root's equality check passes.
     * (The number that appears after humn: in your input is now irrelevant.)"
     */
    monkeys.delete('humn');

    let humn = solveHuman('root');

    console.log('Part 2: the number to yell to pass root\'s equality test is', humn);
}

main();
