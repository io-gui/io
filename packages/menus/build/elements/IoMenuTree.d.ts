import { IoElement, VDOMElement, IoElementProps, WithBinding } from 'io-core';
import { MenuOption } from '../nodes/MenuOption.js';
import { IoMenuItem } from './IoMenuItem.js';
export type IoMenuTreeProps = IoElementProps & {
    option?: MenuOption;
    searchable?: boolean;
    search?: WithBinding<string>;
    depth?: number;
    widget?: VDOMElement | null;
};
export declare class IoMenuTree extends IoElement {
    static get Style(): string;
    option: MenuOption;
    searchable: boolean;
    search: string;
    depth: number;
    widget: VDOMElement | null;
    $parent?: IoMenuItem;
    role: string;
    constructor(args?: IoMenuTreeProps);
    changed(): void;
}
export declare const ioMenuTree: (arg0?: IoMenuTreeProps) => VDOMElement;
//# sourceMappingURL=IoMenuTree.d.ts.map