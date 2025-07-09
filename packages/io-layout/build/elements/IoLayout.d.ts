import { IoElement, VDOMElement, IoElementProps } from 'io-gui';
import { Split } from '../nodes/Split.js';
export type IoLayoutProps = IoElementProps & {
    split?: Split;
    elements?: VDOMElement[];
};
export declare class IoLayout extends IoElement {
    static vConstructor: (arg0?: IoLayoutProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    split: Split;
    elements: VDOMElement[];
    private addMenuItem;
    static get Listeners(): {
        'io-split-data-changed': string;
        'io-panel-data-changed': string;
    };
    onSplitDataChanged(event: CustomEvent): void;
    onPanelDataChanged(event: CustomEvent): void;
    onDataChangedDebounced(): void;
    changed(): void;
}
export declare const ioLayout: (arg0?: IoLayoutProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoLayout.d.ts.map