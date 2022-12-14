export class Range {
    constructor(readonly start: number, readonly end: number) { }

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
}
