import { ReactiveElement, VDOMElement, ReactiveElementProps, WithBinding } from '@io-gui/core';
import { Option } from '../models/Option.js';
import { Menu } from '../models/Menu.js';
import { IoOption } from './IoOption.js';
export type IoMenuTreeProps = ReactiveElementProps & {
    model?: Menu | Option;
    searchable?: boolean;
    search?: WithBinding<string>;
    depth?: number;
    widget?: VDOMElement | null;
    $menu?: Menu;
};
/**
 * Entry point that presents a Menu as an inline tree with collapsible branches. Branch disclosure is
 * tree-scoped state on the Menu (`expandedIDs`) — persist it by binding that property to storage.
 **/
export declare class IoMenuTree extends ReactiveElement {
    static get Style(): string;
    model: Menu | Option;
    searchable: boolean;
    search: string;
    depth: number;
    widget: VDOMElement | null;
    $parent?: IoOption;
    $menu?: Menu;
    role: string;
    constructor(args?: IoMenuTreeProps);
    get menu(): Menu | undefined;
    onResized(): void;
    modelMutated(): void;
    mutated(): void;
}
export declare const ioMenuTree: (arg0?: IoMenuTreeProps) => VDOMElement;
