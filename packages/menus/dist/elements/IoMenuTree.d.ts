import { ReactiveElement, VDOMElement, IoElementProps, WithBinding } from '@io-gui/core';
import { MenuOption } from '../nodes/MenuOption.js';
import { IoMenuItem } from './IoMenuItem.js';
export type IoMenuTreeProps = IoElementProps & {
    option?: MenuOption;
    searchable?: boolean;
    search?: WithBinding<string>;
    depth?: number;
    widget?: VDOMElement | null;
};
export declare class IoMenuTree extends ReactiveElement {
    static get Style(): string;
    option: MenuOption;
    searchable: boolean;
    search: string;
    depth: number;
    widget: VDOMElement | null;
    $parent?: IoMenuItem;
    role: string;
    constructor(args?: IoMenuTreeProps);
    onResized(): void;
    optionMutated(): void;
    mutated(): void;
}
export declare const ioMenuTree: (arg0?: IoMenuTreeProps) => VDOMElement;
