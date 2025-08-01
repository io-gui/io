import { VDOMElement, IoElement, IoElementProps } from 'io-gui';
import { MenuOption } from 'io-menus';
import { IoPanel } from './IoPanel.js';
import { Split, SplitDirection, SplitOrientation } from '../nodes/Split.js';
import { Panel } from '../nodes/Panel.js';
import { Tab } from '../nodes/Tab.js';
export type IoSplitProps = IoElementProps & {
    split: Split;
    elements: VDOMElement[];
    addMenuOption: MenuOption;
};
export declare class IoSplit extends IoElement {
    static get Style(): string;
    split: Split;
    elements: VDOMElement[];
    private addMenuOption;
    static get Listeners(): {
        'io-divider-move': string;
        'io-divider-move-end': string;
        'io-panel-remove': string;
        'io-split-remove': string;
        'io-split-convert-to-panel': string;
    };
    constructor(args: IoSplitProps);
    onDividerMove(event: CustomEvent): void;
    onDividerMoveEnd(event: CustomEvent): void;
    onPanelRemove(event: CustomEvent): void;
    onSplitRemove(event: CustomEvent): void;
    onSplitConvertToPanel(event: CustomEvent): void;
    convertToSplit(panel: Panel, first: Panel, second: Panel, orientation: SplitOrientation): void;
    convertToPanel(split: Split): void;
    moveTabToSplit(sourcePanel: IoPanel, panel: Panel, tab: Tab, direction: SplitDirection): void;
    splitMutated(): void;
    splitMutatedDebounced(): void;
    changed(): void;
}
export declare const ioSplit: (arg0: IoSplitProps) => VDOMElement;
//# sourceMappingURL=IoSplit.d.ts.map