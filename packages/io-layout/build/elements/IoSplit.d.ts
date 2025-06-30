import { VDOMElement, IoElement, IoElementProps } from 'io-gui';
import { MenuItem } from 'io-menus';
import { PanelData } from './IoPanel.js';
export type SplitData = {
    type: 'split';
    direction: 'row' | 'column';
    children: Array<SplitData | PanelData>;
    flex: string;
};
export type IoSplitProps = IoElementProps & {
    split?: SplitData;
    elements?: VDOMElement[];
    addMenuItem?: MenuItem;
};
export declare class IoSplit extends IoElement {
    static vConstructor: (arg0?: IoSplitProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    split: SplitData;
    elements: VDOMElement[];
    private addMenuItem;
    static get Listeners(): {
        'io-divider-move': string;
        'io-divider-move-end': string;
    };
    constructor(args?: IoSplitProps);
    onDividerMove(event: CustomEvent): void;
    onDividerMoveEnd(event: CustomEvent): void;
    changed(): void;
}
export declare const ioSplit: (arg0?: IoSplitProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoSplit.d.ts.map