import { Item } from './item.js';
import { Path } from './path.js';
declare const Options_base: import("../core/io-node.js").IoNodeConstructor<any>;
export declare class Options extends Options_base {
    static get Properties(): {
        items: {
            type: ArrayConstructor;
        };
        path: {
            type: typeof Path;
        };
        lazy: boolean;
    };
    constructor(options?: Array<Item | any>, props?: {});
    option(value: any): any;
    pathChanged(): void;
    onItemSelectedPathChanged(event: any): void;
    onItemSelectedChanged(event: any): void;
    setSelectedPath(path?: any[]): void;
    selectDefault(): boolean;
    changed(): void;
}
export {};
//# sourceMappingURL=options.d.ts.map