import { VDOMElement, IoElement, IoElementProps } from 'io-gui';
import { MenuItem } from 'io-menus';
import { Split } from '../nodes/Split.js';
export type IoSplitProps = IoElementProps & {
    split?: Split;
    elements?: VDOMElement[];
    addMenuItem?: MenuItem;
};
export declare class IoSplit extends IoElement {
    static vConstructor: (arg0?: IoSplitProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    split: Split;
    elements: VDOMElement[];
    private addMenuItem;
    static get Listeners(): {
        'io-divider-move': string;
        'io-divider-move-end': string;
        'io-panel-remove': string;
        'io-split-remove': string;
        'io-split-convert-to-panel': string;
    };
    constructor(args?: IoSplitProps);
    onDividerMove(event: CustomEvent): void;
    onDividerMoveEnd(event: CustomEvent): void;
    onPanelRemove(event: CustomEvent): void;
    onSplitRemove(event: CustomEvent): void;
    onSplitConvertToPanel(event: CustomEvent): void;
    splitMutated(): void;
    changed(): void;
}
export declare const ioSplit: (arg0?: IoSplitProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoSplit.d.ts.map