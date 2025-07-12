import { IoElement, IoElementProps, WithBinding } from 'io-gui';
import { MenuItem } from '../nodes/MenuItem.js';
export type IoMenuTreeBranchProps = IoElementProps & {
    depth?: number;
    item?: MenuItem;
    expanded?: WithBinding<boolean>;
};
/**
 * An element with collapsible content.
 * When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.
 **/
export declare class IoMenuTreeBranch extends IoElement {
    static get Style(): string;
    depth: number;
    item: MenuItem;
    expanded: boolean;
    role: string;
    itemMutated(): void;
    changed(): void;
}
export declare const ioMenuTreeBranch: (arg0?: IoMenuTreeBranchProps) => import("io-gui").VDOMElement;
//# sourceMappingURL=IoMenuTreeBranch.d.ts.map