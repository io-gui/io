import { IoElement, VDOMElement, IoElementProps, WithBinding } from 'io-gui';
import { MenuOptions } from '../nodes/MenuOptions.js';
import { IoMenuItem } from './IoMenuItem.js';
export type IoMenuTreeProps = IoElementProps & {
    options?: MenuOptions;
    searchable?: boolean;
    search?: WithBinding<string>;
    depth?: number;
    widget?: VDOMElement | null;
};
export declare class IoMenuTree extends IoElement {
    static vConstructor: (arg0?: IoMenuTreeProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    options: MenuOptions;
    searchable: boolean;
    search: string;
    depth: number;
    widget: VDOMElement | null;
    $parent?: IoMenuItem;
    role: string;
    constructor(args?: IoMenuTreeProps);
    changed(): void;
}
export declare const ioMenuTree: (arg0?: IoMenuTreeProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoMenuTree.d.ts.map