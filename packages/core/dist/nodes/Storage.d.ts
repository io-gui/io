import { Binding } from '../core/Binding.js';
import { ReactiveNode, ReactiveNodeProps } from '../nodes/ReactiveNode.js';
export type StorageProps = ReactiveNodeProps & {
    key: string;
    value: any;
    default?: any;
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
 * @example
 * ```ts
 * const theme = Storage({ key: 'theme', value: 'light', storage: 'local' })
 * theme.value = 'dark'
 * ```
 */
export declare class StorageNode extends ReactiveNode {
    key: string;
    value: any;
    storage: 'hash' | 'local' | 'none';
    binding: Binding<StorageNode['value']>;
    default: any;
    constructor(props: StorageProps);
    dispose(): void;
    clearStorage(): void;
    valueMutated(): void;
    changed(): void;
    removeValueToHash(): void;
    saveValueToHash(): void;
}
/** Factory that returns a binding to a persisted value. See {@link StorageNode}. */
export declare const Storage: ((props: StorageProps) => Binding<StorageNode["value"]>) & {
    permit(): void;
    unpermit(): void;
};
//# sourceMappingURL=Storage.d.ts.map