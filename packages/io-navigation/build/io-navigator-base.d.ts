import { IoElement, VDOMArray } from 'io-gui';
import { MenuOptions } from 'io-menus';
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
}
export declare const ioNavigatorBase: (arg0?: import("io-gui").IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-navigator-base.d.ts.map