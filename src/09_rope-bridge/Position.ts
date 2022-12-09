export class Position {
    private _y: number;
    private _x: number;

    constructor(y: number, x: number) {
        this._y = y;
        this._x = x;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    up(): Position {
        return new Position(this._y + 1, this._x);
    }

    down(): Position {
        return new Position(this._y - 1, this._x);
    }

    left(): Position {
        return new Position(this._y, this._x - 1);
    }

    right(): Position {
        return new Position(this._y, this._x + 1);
    }

    applyDirection(direction: string): Position {
        switch (direction) {
            case 'U':
                return this.up();
            case 'D':
                return this.down();
            case 'L':
                return this.left();
            case 'R':
                return this.right();
            default:
                throw `Unknown direction ${direction}`;
        }
    }
}
