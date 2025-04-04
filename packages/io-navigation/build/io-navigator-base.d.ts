import { IoElement, VDOMArray, IoElementArgs, ArgsWithBinding } from 'io-gui';
import { MenuOptions } from 'io-menus';
export type IoNavigatorBaseArgs = IoElementArgs & ArgsWithBinding<{
    options?: MenuOptions;
    slotted?: VDOMArray[];
    elements?: VDOMArray[];
    menu?: 'top' | 'left' | 'bottom' | 'right';
    depth?: number;
    collapsed?: boolean;
    collapseWidth?: number;
}>;
export declare class IoNavigatorBase extends IoElement {
    static get Style(): string;
    slotted: VDOMArray[];
    elements: VDOMArray[];
    options: MenuOptions;
    menu: 'top' | 'left' | 'bottom' | 'right';
    depth: number;
    collapsed: boolean;
    collapseWidth: number;
    init(): void;
    onResized(): void;
    _computeCollapsed(): void;
    getSlotted(): VDOMArray | null;
    changed(): void;
    static vDOM: (arg0?: IoNavigatorBaseArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
}
export declare const ioNavigatorBase: (arg0?: IoNavigatorBaseArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-navigator-base.d.ts.map