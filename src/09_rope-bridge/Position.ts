export class Position {

    constructor(public readonly y: number, public readonly x: number) {
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
                throw new Error(`Unknown direction ${direction}`);
        }
    }
}
