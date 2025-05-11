import { IoElement, VDOMElement, IoElementProps, WithBinding } from 'io-gui';
import { MenuOptions } from 'io-menus';
export type IoNavigatorBaseProps = IoElementProps & {
    options?: MenuOptions;
    slotted?: VDOMElement[];
    elements?: VDOMElement[];
    menu?: 'top' | 'left' | 'bottom' | 'right';
    depth?: number;
    collapsed?: WithBinding<boolean>;
    collapseWidth?: number;
};
export declare class IoNavigatorBase extends IoElement {
    static vConstructor: (arg0?: IoNavigatorBaseProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    slotted: VDOMElement[];
    elements: VDOMElement[];
    options: MenuOptions;
    menu: 'top' | 'left' | 'bottom' | 'right';
    depth: number;
    collapsed: boolean;
    collapseWidth: number;
    init(): void;
    onResized(): void;
    _computeCollapsed(): void;
    getSlotted(): VDOMElement | null;
    changed(): void;
}
export declare const ioNavigatorBase: (arg0?: IoNavigatorBaseProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoNavigatorBase.d.ts.map