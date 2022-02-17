import { IoNode } from '../../core/io-node.js';
export declare class Path extends IoNode {
    static get Properties(): {
        value: ArrayConstructor;
        string: StringConstructor;
        root: null;
        leaf: null;
        delimiter: string;
    };
    valueChanged(): void;
    onMutation(): void;
    update(): void;
    stringChanged(): void;
    rootChanged(): void;
    leafChanged(): void;
}
//# sourceMappingURL=path.d.ts.map