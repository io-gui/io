import { IoNode } from './node.js';
export declare const getStorageHashes: () => void;
export declare const setStorageHashes: (force?: boolean) => void;
interface StorageProps {
    key: string;
    value?: unknown;
    storage?: 'hash' | 'local' | 'none';
}
export declare class IoStorage extends IoNode {
    key: string;
    value: any;
    default: any;
    storage: 'hash' | 'local' | 'none';
    constructor(props: StorageProps);
    loadStorageValue(): void;
    valueChanged(): void;
}
declare const IoStorageFactory: (props: StorageProps) => import("./index.js").Binding;
export { IoStorageFactory };
//# sourceMappingURL=storage.d.ts.map