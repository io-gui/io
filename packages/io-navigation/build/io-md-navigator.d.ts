import { IoElement, VDOMElement, IoElementArgs, ArgsWithBinding } from 'io-gui';
import { MenuOptions } from 'io-menus';
export type IoMdNavigatorArgs = IoElementArgs & ArgsWithBinding<{
    options?: MenuOptions;
    slotted?: VDOMElement[];
    menu?: 'top' | 'left' | 'bottom' | 'right';
    depth?: number;
    collapsed?: boolean;
    collapseWidth?: number;
}>;
export declare class IoMdNavigator extends IoElement {
    static vConstructor: (arg0?: IoMdNavigatorArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    slotted: VDOMElement[];
    options: MenuOptions;
    menu: 'none' | 'top' | 'left' | 'bottom' | 'right';
    depth: number;
    collapsed: boolean;
    collapseWidth: number;
    onResized(): void;
    changed(): void;
}
export declare const ioMdNavigator: (arg0?: IoMdNavigatorArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=io-md-navigator.d.ts.map