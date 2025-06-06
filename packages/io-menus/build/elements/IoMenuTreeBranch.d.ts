import { IoElement, VDOMElement, IoElementProps, WithBinding } from 'io-gui';
import { MenuItem } from '../nodes/MenuItem';
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
    static vConstructor: (arg0?: IoMenuTreeBranchProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    depth: number;
    item: MenuItem;
    expanded: boolean;
    role: string;
    itemMutated(): void;
    changed(): void;
}
export declare const ioMenuTreeBranch: (arg0?: IoMenuTreeBranchProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoMenuTreeBranch.d.ts.map