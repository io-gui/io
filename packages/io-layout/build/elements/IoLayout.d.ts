import { IoElement, VDOMElement, IoElementProps } from 'io-gui';
import { MenuOption } from 'io-menus';
import { Split } from '../nodes/Split.js';
export type IoLayoutProps = IoElementProps & {
    split: Split;
    elements: VDOMElement[];
    addMenuOption: MenuOption;
};
export declare class IoLayout extends IoElement {
    static get Style(): string;
    split: Split;
    elements: VDOMElement[];
    private addMenuOption;
    changed(): void;
}
export declare const ioLayout: (arg0: IoLayoutProps) => VDOMElement;
//# sourceMappingURL=IoLayout.d.ts.map