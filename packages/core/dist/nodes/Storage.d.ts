import { Binding } from '../core/Binding.js';
import { ReactiveObject, ReactiveNodeProps } from '../nodes/ReactiveObject.js';
export type StorageProps<T = unknown> = ReactiveNodeProps & {
    key: string;
    value: T;
    default?: T;
    storage?: 'hash' | 'local' | 'none';
};
/**
 * Persistent reactive value backed by localStorage or location hash.
 *
 * `Storage(props)` returns a {@link Binding} to the stored value. Each unique
 * `key` + `storage` pair resolves to a singleton {@link StorageNode}, so multiple
 * bindings share the same persisted state. Values are JSON-serialized at the
 * storage boundary; domain types should own their own encode/decode via
 * `toJSON` / `applyJSON` or constructor hydration.
 *
 * Call {@link Storage.permit} before writing to localStorage when privacy
 * settings require explicit user consent.
 *
 * @example Storage({ key: 'theme', value: 'light', storage: 'local' })
 */
export declare class StorageNode extends ReactiveObject {
    key: string;
    value: unknown;
    storage: 'hash' | 'local' | 'none';
    binding: Binding<StorageNode['value']>;
    default: unknown;
    constructor(props: StorageProps);
    dispose(): void;
    clearStorage(): void;
    valueMutated(): void;
    mutated(): void;
    removeValueToHash(): void;
    saveValueToHash(): void;
}
/** Factory that returns a binding to a persisted value. See {@link StorageNode}. */
export declare const Storage: (<T = unknown>(props: StorageProps<T>) => Binding<T>) & {
    permit(): void;
    unpermit(): void;
};
