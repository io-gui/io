import { IoNode } from '../core/io-node.js';
import { Options } from './options.js';
import { Path } from './path.js';
export declare class Item extends IoNode {
    static get Properties(): {
        value: undefined;
        label: string;
        icon: string;
        hint: string;
        action: undefined;
        select: string;
        selected: BooleanConstructor;
        path: {
            type: typeof Path;
        };
        options: {
            type: typeof Options;
        };
    };
    constructor(option: any);
    get hasmore(): boolean;
    option(value: any): any;
    onOptionsSelectedPathChanged(): void;
    optionsChanged(): void;
    selectedChanged(): void;
    setSelectedPath(selected: any, path?: any[]): void;
    changed(): void;
}
//# sourceMappingURL=item.d.ts.map