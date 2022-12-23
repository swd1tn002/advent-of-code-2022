export class Vector {
    constructor(readonly y: number, readonly x: number) { }

    plus(o: Vector): Vector {
        return new Vector(this.y + o.y, this.x + o.x);
    }

    toString() {
        return `${this.y},${this.x}`;
    }

    static parse(str: string): Vector {
        let [y, x] = str.split(',').map(n => Number(n));
        return new Vector(y, x);
    }
}
