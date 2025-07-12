import { IoElement, VDOMElement, IoElementProps } from 'io-gui';
import { MenuItem } from 'io-menus';
import { Split } from '../nodes/Split.js';
export type IoLayoutProps = IoElementProps & {
    split: Split;
    elements: VDOMElement[];
    addMenuItem: MenuItem;
};
export declare class IoLayout extends IoElement {
    static get Style(): string;
    split: Split;
    elements: VDOMElement[];
    private addMenuItem;
    changed(): void;
}
export declare const ioLayout: (arg0: IoLayoutProps) => VDOMElement;
//# sourceMappingURL=IoLayout.d.ts.map