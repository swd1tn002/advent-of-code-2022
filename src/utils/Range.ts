export class Range {
    private _start: number;
    private _end: number;

    constructor(start: number, end: number) {
        [this._start, this._end] = [start, end];
    }

    static parse(range: string) {
        let [start, end] = range.split('-').map(Number);
        return new Range(start, end);
    }

    contains(num: number): boolean {
        return this.start <= num && num <= this.end;
    }

    fullyContains(other: Range): boolean {
        return this.start <= other.start && other.end <= this.end;
    }

    overlaps(other: Range): boolean {
        return this.fullyContains(other) || other.fullyContains(this) ||
            this.contains(other.start) || this.contains(other.end) ||
            other.contains(this.start) || other.contains(this.end)
    }

    get start(): number {
        return this._start;
    }

    get end(): number {
        return this._end;
    }
}
