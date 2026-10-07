/**
 * Selected elements of one domain of one object (ADR-0007): a bitset over `0..size-1`.
 * A million elements cost 125 KB; `words` can be uploaded to the GPU as-is.
 */
export declare class ComponentSet {
    /** Domain size this set was made for. Indices are only meaningful for that topology. */
    readonly size: number;
    readonly words: Uint32Array;
    constructor(size: number, words?: Uint32Array);
    static from(size: number, indices: Iterable<number>): ComponentSet;
    has(index: number): boolean;
    add(index: number): this;
    delete(index: number): this;
    toggle(index: number): this;
    clear(): this;
    /** Selects every element. */
    fill(): this;
    /** Flips every element. */
    invert(): this;
    count(): number;
    isEmpty(): boolean;
    forEach(callback: (index: number) => void): void;
    toArray(): number[];
    clone(): ComponentSet;
    equals(other: ComponentSet | undefined): boolean;
}
