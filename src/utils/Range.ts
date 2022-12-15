import { last, max, min } from "./arrays";

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

    join(other: Range): Range {
        if (this.isEmpty()) {
            return other;
        }
        if (other.isEmpty()) {
            return this;
        }
        if (!this.overlaps(other)) {
            throw new Error(`Cannot join ranges that do not overlap`);
        }
        return new Range(min([this.start, other.start]), max([this.end, other.end]));
    }

    get size(): number {
        return this.end - this.start + 1;
    }

    isEmpty(): boolean {
        return this.size <= 0;
    }

    /** Joins all overlapping ranges together in an array of non-overlapping ranges. */
    static joinRanges(ranges: Range[]): Range[] {
        let sorted = [...ranges];
        sorted.sort((a, b) => a.start - b.start);

        return sorted.slice(1).reduce((acc: Range[], curr: Range) => {
            if (last(acc).overlaps(curr)) {
                // join current with previous
                let prev = acc.pop() as Range;
                acc.push(prev.join(curr));
            } else {
                // add current as new individual range
                acc.push(curr);
            }
            return acc;
        }, [sorted[0]]);
    }
}
