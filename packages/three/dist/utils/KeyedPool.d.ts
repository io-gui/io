/**
 * Values kept per key from one pass to the next, such as proxies and cages that mirror scene objects.
 * `get` reuses or creates a value and marks it used; `sweep` drops the values the pass did not use.
 */
export declare class KeyedPool<T> {
    private readonly _values;
    private readonly _used;
    private readonly _drop;
    /** `drop` releases a value: removes it from its scene, disposes it. */
    constructor(drop: (value: T) => void);
    /** The value for `key`, made with `create` when there is none or `fits` rejects the current one. */
    get(key: string, create: () => T, fits?: (value: T) => boolean): T;
    /** Drops values not used since the last sweep. Returns how many are kept. */
    sweep(): number;
    clear(): void;
}
