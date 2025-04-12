import { IoElement, VDOMElement, IoElementArgs, ArgsWithBinding } from 'io-gui';
import { MenuOptions } from '../nodes/MenuOptions.js';
import { IoMenuItem } from './IoMenuItem.js';
export declare function addMenuOptions(options: MenuOptions, depth: number, d?: number): VDOMElement[];
export declare function filterOptions(options: MenuOptions, search: string, depth?: number, elements?: VDOMElement[], d?: number): any;
export type IoMenuTreeArgs = IoElementArgs & ArgsWithBinding<{
    options?: MenuOptions;
    searchable?: boolean;
    search?: string;
    depth?: number;
    slotted?: VDOMElement[];
}>;
export declare class IoMenuTree extends IoElement {
    static vConstructor: (arg0?: IoMenuTreeArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    options: MenuOptions;
    searchable: boolean;
    search: string;
    depth: number;
    slotted: VDOMElement[];
    role: string;
    $parent?: IoMenuItem;
    static get Listeners(): {
        'item-clicked': string;
    };
    constructor(args?: IoMenuTreeArgs);
    _onItemClicked(event: CustomEvent): void;
    _onCollapse(): void;
    changed(): void;
}
export declare const ioMenuTree: (arg0?: IoMenuTreeArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoMenuTree.d.ts.map