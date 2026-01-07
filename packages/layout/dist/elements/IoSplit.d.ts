import { VDOMElement, IoElement, IoElementProps } from '@io-gui/core';
import { MenuOption } from '@io-gui/menus';
import { IoPanel } from './IoPanel.js';
import { Split, SplitDirection, SplitOrientation } from '../nodes/Split.js';
import { Panel } from '../nodes/Panel.js';
import { Tab } from '../nodes/Tab.js';
/**
 * TODO ensure that at least one split has flex-grow: 1
 * There is a bug when you have three splits say:
 * flex: 0 0 300px
 * flex: 1 1 auto
 * flex: 0 0 300px
 * And when you remove the middle split, the remaining two splits dont fill up the space since none is flex-grow.
*/
export type IoSplitProps = IoElementProps & {
    split: Split;
    elements: VDOMElement[];
    addMenuOption?: MenuOption;
};
export declare class IoSplit extends IoElement {
    static get Style(): string;
    split: Split;
    elements: VDOMElement[];
    addMenuOption: MenuOption | undefined;
    static get Listeners(): {
        'io-divider-move': string;
        'io-divider-move-end': string;
        'io-panel-remove': string;
        'io-split-remove': string;
        'io-split-consolidate': string;
    };
    constructor(args: IoSplitProps);
    onDividerMove(event: CustomEvent): void;
    onDividerMoveEnd(event: CustomEvent): void;
    onPanelRemove(event: CustomEvent): void;
    onSplitRemove(event: CustomEvent): void;
    onSplitConsolidate(event: CustomEvent): void;
    convertToSplit(panel: Panel, first: Panel, second: Panel, orientation: SplitOrientation): void;
    consolidateChild(childSplit: Split): void;
    moveTabToSplit(sourcePanel: IoPanel, panel: Panel, tab: Tab, direction: SplitDirection): void;
    splitMutated(): void;
    splitMutatedDebounced(): void;
    changed(): void;
}
export declare const ioSplit: (arg0: IoSplitProps) => VDOMElement;
//# sourceMappingURL=IoSplit.d.ts.map