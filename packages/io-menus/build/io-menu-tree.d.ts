import { IoElement, VDOMArray } from 'io-gui';
import { MenuOptions } from './models/menu-options.js';
import { IoMenuItem } from './io-menu-item.js';
export declare function addMenuOptions(options: MenuOptions, depth: number, d?: number): VDOMArray[];
export declare function filterOptions(options: MenuOptions, search: string, depth?: number, elements?: VDOMArray[], d?: number): any;
export declare class IoMenuTree extends IoElement {
    static get Style(): string;
    options: MenuOptions;
    searchable: boolean;
    search: string;
    depth: number;
    slotted: VDOMArray[];
    role: string;
    $parent?: IoMenuItem;
    static get Listeners(): {
        'item-clicked': string;
    };
    _onItemClicked(event: CustomEvent): void;
    _onCollapse(): void;
    changed(): void;
}
//# sourceMappingURL=io-menu-tree.d.ts.map