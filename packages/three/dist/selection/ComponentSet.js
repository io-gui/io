/**
 * Selected elements of one domain of one object (ADR-0007): a bitset over `0..size-1`.
 * A million elements cost 125 KB; `words` can be uploaded to the GPU as-is.
 */
export class ComponentSet {
    /** Domain size this set was made for. Indices are only meaningful for that topology. */
    size;
    words;
    constructor(size, words) {
        this.size = size;
        this.words = words ?? new Uint32Array(Math.ceil(size / 32));
    }
    static from(size, indices) {
        const set = new ComponentSet(size);
        for (const index of indices)
            set.add(index);
        return set;
    }
    has(index) {
        return index >= 0 && index < this.size && (this.words[index >>> 5] & (1 << (index & 31))) !== 0;
    }
    add(index) {
        if (index >= 0 && index < this.size)
            this.words[index >>> 5] |= 1 << (index & 31);
        return this;
    }
    delete(index) {
        if (index >= 0 && index < this.size)
            this.words[index >>> 5] &= ~(1 << (index & 31));
        return this;
    }
    toggle(index) {
        if (index >= 0 && index < this.size)
            this.words[index >>> 5] ^= 1 << (index & 31);
        return this;
    }
    clear() {
        this.words.fill(0);
        return this;
    }
    /** Selects every element. */
    fill() {
        this.words.fill(0xffffffff);
        const tail = this.size & 31;
        if (tail && this.words.length)
            this.words[this.words.length - 1] = (1 << tail) - 1;
        return this;
    }
    /** Flips every element. */
    invert() {
        for (let i = 0; i < this.words.length; i++)
            this.words[i] = ~this.words[i];
        const tail = this.size & 31;
        if (tail && this.words.length)
            this.words[this.words.length - 1] &= (1 << tail) - 1;
        return this;
    }
    count() {
        let count = 0;
        for (let i = 0; i < this.words.length; i++) {
            let word = this.words[i];
            while (word) {
                word &= word - 1;
                count++;
            }
        }
        return count;
    }
    isEmpty() {
        for (let i = 0; i < this.words.length; i++)
            if (this.words[i])
                return false;
        return true;
    }
    forEach(callback) {
        for (let i = 0; i < this.words.length; i++) {
            let word = this.words[i];
            while (word) {
                const bit = 31 - Math.clz32(word & -word);
                callback(i * 32 + bit);
                word &= word - 1;
            }
        }
    }
    toArray() {
        const indices = [];
        this.forEach(index => indices.push(index));
        return indices;
    }
    clone() {
        return new ComponentSet(this.size, this.words.slice());
    }
    equals(other) {
        if (!other)
            return this.isEmpty();
        if (other.size !== this.size)
            return false;
        for (let i = 0; i < this.words.length; i++)
            if (this.words[i] !== other.words[i])
                return false;
        return true;
    }
}
