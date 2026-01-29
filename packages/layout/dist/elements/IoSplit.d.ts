import { VDOMElement, IoElement, IoElementProps, WithBinding } from '@io-gui/core';
import { MenuOption } from '@io-gui/menus';
import { IoPanel } from './IoPanel.js';
import { Split, SplitOrientation } from '../nodes/Split.js';
import { Panel } from '../nodes/Panel.js';
import { Tab } from '../nodes/Tab.js';
export declare function parseFlexBasis(flex: string): number;
export declare function hasFlexGrow(flex: string): boolean;
export type SplitDirection = 'none' | 'left' | 'right' | 'top' | 'bottom' | 'center';
export type IoSplitProps = IoElementProps & {
    split: WithBinding<Split>;
    elements: VDOMElement[];
    addMenuOption?: MenuOption;
    frozen?: boolean;
};
export declare class IoSplit extends IoElement {
    static get Style(): string;
    split: Split;
    elements: VDOMElement[];
    leadingDrawer: Split | Panel | null;
    trailingDrawer: Split | Panel | null;
    addMenuOption: MenuOption | undefined;
    hasVisibleFlexGrow: boolean;
    showVeil: boolean;
    frozen: boolean;
    static get Listeners(): {
        'io-divider-move': string;
        'io-divider-move-end': string;
        'io-panel-remove': string;
        'io-split-remove': string;
        'io-split-consolidate': string;
        'io-drawer-expanded-changed': string;
    };
    constructor(args: IoSplitProps);
    onResized(): void;
    calculateCollapsedDrawersDebounced(): void;
    calculateCollapsedDrawers(): void;
    onDividerMove(event: CustomEvent): void;
    onDividerMoveEnd(event: CustomEvent): void;
    onPanelRemove(event: CustomEvent): void;
    onSplitRemove(event: CustomEvent): void;
    ensureOneHasFlexGrow(): void;
    onSplitConsolidate(event: CustomEvent): void;
    convertToSplit(panel: Panel, first: Panel, second: Panel, orientation: SplitOrientation): void;
    consolidateChild(childSplit: Split): void;
    moveTabToSplit(sourcePanel: IoPanel, panel: Panel, tab: Tab, direction: SplitDirection): void;
    onDrawerExpandedChanged(event: CustomEvent): void;
    updateVeil(): void;
    collapseAllDrawers(): void;
    leadingDrawerChanged(): void;
    trailingDrawerChanged(): void;
    onVeilClick(event: MouseEvent): void;
    splitMutated(): void;
    splitChanged(): void;
    changed(): void;
}
export declare const ioSplit: (arg0: IoSplitProps) => VDOMElement;
//# sourceMappingURL=IoSplit.d.ts.map