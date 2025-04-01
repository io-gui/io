import { IoElement, VDOMArray } from 'io-gui';
import { MenuOptions } from 'io-menus';
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
}
export declare const ioMdNavigator: (arg0?: import("io-gui").IoElementArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray;
//# sourceMappingURL=io-md-navigator.d.ts.map