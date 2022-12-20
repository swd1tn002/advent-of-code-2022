import Circle from '../utils/Circle';

/** Numbers are wrapped in "Num" so they get passed as reference, not value. */
export class Num {
    constructor(readonly value: number) { }
}

/**
 * "To mix the file, move each number forward or backward in the file a number of positions equal to the value of the number being moved. The
 * list is circular, so moving a number off one end of the list wraps back around to the other end as if the ends were connected."
 */
export function shift(num: Num, numbers: Num[]): Num[] {
    let i = numbers.indexOf(num);
    numbers.splice(i, 1); // remove from the list

    let i2 = (i + num.value);

    if (i2 < 0) {
        i2 = (i2 % numbers.length) + numbers.length;
    }

    if (i2 > numbers.length) {
        i2 = i2 % numbers.length;
    }

    numbers.splice(i2, 0, num);
    return numbers;
}

/**
 * "To mix the file, move each number forward or backward in the file a number of positions equal to the
 * value of the number being moved. The list is circular, so moving a number off one end of the list
 * wraps back around to the other end as if the ends were connected."
 */
export function mix(original: Num[], times: number): Num[] {
    let mixed = [...original];

    for (let i = 0; i < times; i++) {
        for (let n of original) {
            shift(n, mixed);
        }
    }
    return mixed;
}

/**
 * "The grove coordinates can be found by looking at the 1000th, 2000th, and 3000th numbers after the value 0,
 * wrapping around the list as necessary."
 */
export function getCoordinates(mixed: Num[]) {
    let zero: Num = mixed.find(n => n.value === 0) as Num;
    let i0 = mixed.indexOf(zero);

    let wrapped = new Circle(mixed);
    let a = wrapped.get(i0 + 1_000).value;
    let b = wrapped.get(i0 + 2_000).value;
    let c = wrapped.get(i0 + 3_000).value;
    return [a, b, c];
}
