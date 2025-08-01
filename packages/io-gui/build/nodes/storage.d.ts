import { Binding } from '../core/Binding.js';
import { Node, NodeProps } from '../nodes/Node.js';
export type StorageProps = NodeProps & {
    key: string;
    value: any;
    storage?: 'hash' | 'local';
};
export declare class StorageNode extends Node {
    key: string;
    value: any;
    storage: 'hash' | 'local';
    binding: Binding<any>;
    default: any;
    constructor(props: StorageProps);
    dispose(): void;
    clearStorage(): void;
    valueMutated(): void;
    valueMutatedDebounced(): void;
    valueChanged(): void;
    removeValueToHash(): void;
    saveValueToHash(): void;
}
export declare const Storage: ((props: StorageProps) => Binding<any>) & {
    permit(): void;
    unpermit(): void;
};
//# sourceMappingURL=Storage.d.ts.map