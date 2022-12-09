export class Position {
    y: number;
    x: number;

    constructor(y: number, x: number) {
        this.y = y;
        this.x = x;
    }

    up(): Position {
        return new Position(this.y + 1, this.x);
    }

    down(): Position {
        return new Position(this.y - 1, this.x);
    }

    left(): Position {
        return new Position(this.y, this.x - 1);
    }

    right(): Position {
        return new Position(this.y, this.x + 1);
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
