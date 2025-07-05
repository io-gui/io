import { Binding } from '../core/Binding.js';
import { Node, NodeProps } from '../nodes/Node.js';
export type StorageProps = NodeProps & {
    key: string;
    value?: any;
    default?: any;
    storage?: 'hash' | 'local' | 'none';
};
export declare class StorageNode extends Node {
    key: string;
    value: any;
    default: any;
    storage: 'hash' | 'local' | 'none';
    binding: Binding<any>;
    constructor(props: StorageProps);
    dispose(): void;
    _clearStorage(): void;
    valueMutated(): void;
    valueChanged(): void;
    removeValueToHash(): void;
    saveValueToHash(): void;
}
export declare const Storage: ((props: StorageProps) => Binding<any>) & {
    permit(): void;
    unpermit(): void;
};
//# sourceMappingURL=Storage.d.ts.map