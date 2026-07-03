import { VDOMElement, ReactiveElement, ReactiveElementProps, WithBinding } from '@io-gui/core';
import { Split } from '../nodes/Split.js';
import { Panel } from '../nodes/Panel.js';
export type IoSplitData = ReactiveElementProps & {
    split: WithBinding<Split>;
    elements: VDOMElement[];
};
export declare class IoSplit extends ReactiveElement {
    static get Style(): string;
    split: Split;
    elements: VDOMElement[];
    leadingDrawer: Split | Panel | null;
    trailingDrawer: Split | Panel | null;
    hasVisibleAutoSize: boolean;
    showVeil: boolean;
    static get Listeners(): {
        'io-divider-move': string;
        'io-divider-move-end': string;
        'io-drawer-expanded-changed': string;
    };
    constructor(args: IoSplitData);
    onResized(): void;
    calculateCollapsedDrawersDebounced(): void;
    calculateCollapsedDrawers(): void;
    onDividerMove(event: CustomEvent): void;
    onDividerMoveEnd(event: CustomEvent): void;
    updateVisibleAutoSize(): void;
    ensureOneHasAutoSize(): void;
    onDrawerExpandedChanged(event: CustomEvent): void;
    collapseAllDrawers(): void;
    leadingDrawerChanged(): void;
    trailingDrawerChanged(): void;
    onVeilClick(event: MouseEvent): void;
    splitMutated(): void;
    splitChanged(): void;
    mutated(): void;
}
export declare const ioSplit: (arg0: IoSplitData) => VDOMElement;
