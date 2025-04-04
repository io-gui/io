import { IoElement, VDOMArray, IoElementArgs, ArgsWithBinding } from 'io-gui';
import { MenuOptions } from 'io-menus';
export type IoMdNavigatorArgs = IoElementArgs & ArgsWithBinding<{
    options?: MenuOptions;
    slotted?: VDOMArray[];
    menu?: 'top' | 'left' | 'bottom' | 'right';
    depth?: number;
    collapsed?: boolean;
    collapseWidth?: number;
}>;
export declare class IoMdNavigator extends IoElement {
    static get Style(): string;
    slotted: VDOMArray[];
    options: MenuOptions;
    menu: 'none' | 'top' | 'left' | 'bottom' | 'right';
    depth: number;
    collapsed: boolean;
    collapseWidth: number;
    onResized(): void;
    changed(): void;
    static vDOM: (arg0?: IoMdNavigatorArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
}
export declare const ioMdNavigator: (arg0?: IoMdNavigatorArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-md-navigator.d.ts.map