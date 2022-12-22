/**
 * Circular list class for wrapping regular arrays. Supports negative indices and
 * wrapping around the indices.
 */
export default class Circle<T> {

    constructor(readonly content: T[]) { }

    /**
     * Gets the element from given index. Negative indices also supported.
     * Indices wrap around the circular list.
     */
    get(index: number): T {
        while (index < 0) {
            index += this.content.length;
        }
        return this.content[index % this.content.length];
    }

    /**
     * Gets the element following the given element. If multiple copies of
     * given element exist, returns next from the first occurrence.
     * Wraps around from last to first.
     */
    next(element: T): T {
        if (!this.content.includes(element)) {
            throw new Error(`Array does not contain ${element}`);
        }
        let nextIndex = this.content.indexOf(element) + 1;
        return this.get(nextIndex);
    }

    /**
     * Gets the element preceding the given element. If multiple copies of
     * given element exist, returns preceding from the first occurrence.
     * Wraps around from first to last.
     */
    previous(element: T): T {
        if (!this.content.includes(element)) {
            throw new Error(`Array does not contain ${element}`);
        }
        let previousIndex = this.content.indexOf(element) - 1;
        return this.get(previousIndex);
    }

    get length(): number {
        return this.content.length;
    }
}
