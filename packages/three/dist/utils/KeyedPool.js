/**
 * Values kept per key from one pass to the next, such as proxies and cages that mirror scene objects.
 * `get` reuses or creates a value and marks it used; `sweep` drops the values the pass did not use.
 */
export class KeyedPool {
    _values = new Map();
    _used = new Set();
    _drop;
    /** `drop` releases a value: removes it from its scene, disposes it. */
    constructor(drop) {
        this._drop = drop;
    }
    /** The value for `key`, made with `create` when there is none or `fits` rejects the current one. */
    get(key, create, fits) {
        let value = this._values.get(key);
        if (value !== undefined && fits && !fits(value)) {
            this._drop(value);
            value = undefined;
        }
        if (value === undefined)
            this._values.set(key, value = create());
        this._used.add(key);
        return value;
    }
    /** Drops values not used since the last sweep. Returns how many are kept. */
    sweep() {
        for (const [key, value] of this._values) {
            if (this._used.has(key))
                continue;
            this._drop(value);
            this._values.delete(key);
        }
        const kept = this._used.size;
        this._used.clear();
        return kept;
    }
    clear() {
        for (const value of this._values.values())
            this._drop(value);
        this._values.clear();
        this._used.clear();
    }
}
