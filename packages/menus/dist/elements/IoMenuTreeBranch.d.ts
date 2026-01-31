import { IoElement, IoElementProps, WithBinding } from '@io-gui/core';
import { MenuOption } from '../nodes/MenuOption.js';
export type IoMenuTreeBranchProps = IoElementProps & {
    depth?: number;
    option?: MenuOption;
    expanded?: WithBinding<boolean>;
};
/**
 * An element with collapsible content.
 * When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.
 **/
export declare class IoMenuTreeBranch extends IoElement {
    static get Style(): string;
    depth: number;
    option: MenuOption;
    expanded: boolean;
    role: string;
    optionMutated(): void;
    expandedChanged(): void;
    changed(): void;
}
export declare const ioMenuTreeBranch: (arg0?: IoMenuTreeBranchProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoMenuTreeBranch.d.ts.map