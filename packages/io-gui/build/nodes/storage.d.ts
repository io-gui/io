import { Binding } from '../core/internals/binding';
import { IoNode } from '../core/node';
interface StorageProps {
    key: string;
    value?: any;
    default?: any;
    storage?: 'hash' | 'local' | 'none';
}
export declare function genObjectStorageID(object: Record<string, any>): string;
export declare class IoStorageNode extends IoNode {
    key: string;
    value: any;
    default: any;
    storage: 'hash' | 'local' | 'none';
    binding: Binding;
    constructor(props: StorageProps);
    dispose(): void;
    _clearStorage(): void;
    valueChanged(): void;
    removeValueToHash(): void;
    saveValueToHash(): void;
}
export declare const IoStorage: ((props: StorageProps) => Binding) & {
    permit(): void;
    unpermit(): void;
};
export {};
//# sourceMappingURL=storage.d.ts.map