import { VDOMElement, ReactiveElement, ReactiveElementProps, WithBinding } from '@io-gui/core';
import { IoDrawer } from './IoDrawer.js';
import { Split } from '../models/Split.js';
import { Panel } from '../models/Panel.js';
export type IoSplitData = ReactiveElementProps & {
    model: WithBinding<Split>;
    elements: VDOMElement[];
};
export declare class IoSplit extends ReactiveElement {
    static get Style(): string;
    model: Split;
    elements: VDOMElement[];
    leadingCollapsedChildModel: Split | Panel | null;
    trailingCollapsedChildModel: Split | Panel | null;
    hasVisibleAutoSize: boolean;
    showVeil: boolean;
    static get Listeners(): {
        'io-divider-move': string;
        'io-divider-move-end': string;
    };
    constructor(args: IoSplitData);
    onResized(): void;
    calculateCollapsedDrawersDebounced(): void;
    calculateCollapsedDrawers(): void;
    onDividerMove(event: CustomEvent): void;
    onDividerMoveEnd(event: CustomEvent): void;
    updateVisibleAutoSize(): void;
    ensureOneHasAutoSize(): void;
    leadingCollapsedChildModelChanged(): void;
    trailingCollapsedChildModelChanged(): void;
    onVeilClick(event: MouseEvent): void;
    collapseDrawers(except?: IoDrawer): void;
    modelMutated(): void;
    modelChanged(): void;
    mutated(): void;
}
export declare const ioSplit: (arg0: IoSplitData) => VDOMElement;
