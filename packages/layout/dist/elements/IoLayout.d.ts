import { IoElement, VDOMElement, IoElementProps, Binding } from '@io-gui/core';
import { MenuOption } from '@io-gui/menus';
import { Split } from '../nodes/Split.js';
export declare function sizeToFlex(size: number | 'auto'): string;
export type IoLayoutProps = IoElementProps & {
    split: Split | Binding;
    elements: VDOMElement[];
    addMenuOption?: MenuOption;
    frozen?: boolean;
};
export declare class IoLayout extends IoElement {
    static get Style(): string;
    split: Split;
    elements: VDOMElement[];
    addMenuOption: MenuOption | undefined;
    frozen: boolean;
    changed(): void;
}
export declare const ioLayout: (arg0: IoLayoutProps) => VDOMElement;
//# sourceMappingURL=IoLayout.d.ts.map