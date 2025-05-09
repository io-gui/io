import { IoElement, VDOMElement, IoElementProps, PropsWithBinding } from 'io-gui';
import { MenuOptions } from '../nodes/MenuOptions.js';
import { IoMenuItem } from './IoMenuItem.js';
export declare function addMenuOptions(options: MenuOptions, depth: number, d?: number): VDOMElement[];
export declare function filterOptions(options: MenuOptions, search: string, depth?: number, elements?: VDOMElement[], d?: number): any;
export type IoMenuTreeProps = IoElementProps & PropsWithBinding<{
    options?: MenuOptions;
    searchable?: boolean;
    search?: string;
    depth?: number;
    slotted?: VDOMElement[];
}>;
export declare class IoMenuTree extends IoElement {
    static vConstructor: (arg0?: IoMenuTreeProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    options: MenuOptions;
    searchable: boolean;
    search: string;
    depth: number;
    slotted: VDOMElement[];
    $parent?: IoMenuItem;
    role: string;
    static get Listeners(): {
        'item-clicked': string;
    };
    constructor(args?: IoMenuTreeProps);
    _onItemClicked(event: CustomEvent): void;
    _onCollapse(): void;
    changed(): void;
}
export declare const ioMenuTree: (arg0?: IoMenuTreeProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoMenuTree.d.ts.map