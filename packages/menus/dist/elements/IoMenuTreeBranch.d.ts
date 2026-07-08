import { ReactiveElement, ReactiveElementProps, WithBinding } from '@io-gui/core';
import { Option } from '../models/Option.js';
import { Menu } from '../models/Menu.js';
export type IoMenuTreeBranchProps = ReactiveElementProps & {
    depth?: number;
    model?: Option;
    expanded?: WithBinding<boolean>;
    $menu?: Menu;
};
/**
 * A collapsible branch inside an `IoMenuTree`. Toggling it writes through to the Menu's
 * tree-scoped disclosure state (`expandedIDs`) when a Menu is available.
 **/
export declare class IoMenuTreeBranch extends ReactiveElement {
    static get Style(): string;
    depth: number;
    model: Option;
    expanded: boolean;
    $menu?: Menu;
    role: string;
    modelMutated(): void;
    expandedChanged(): void;
    mutated(): void;
}
export declare const ioMenuTreeBranch: (arg0?: IoMenuTreeBranchProps) => import("@io-gui/core").VDOMElement;
