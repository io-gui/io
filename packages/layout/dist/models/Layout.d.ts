import { ReactiveObject } from '@io-gui/core';
import { SplitDirection } from '../types/SplitDirection.js';
import { Panel, PanelData } from './Panel.js';
import { Split, SplitData, SplitOrientation } from './Split.js';
import { Tab } from './Tab.js';
export type LayoutChildData = SplitData | PanelData;
export type LayoutChild = Split | Panel;
export type LayoutData = {
    child: LayoutChildData;
};
export declare function createLayoutChild(child: SplitData | PanelData): Split | Panel;
export declare class Layout extends ReactiveObject {
    child: LayoutChild;
    constructor(data: LayoutData);
    childMutated(): void;
    dispatchMutationDebounced(): void;
    normalize(): void;
    containsPanel(node: LayoutChild): boolean;
    findPanelWithTab(node: LayoutChild, tab: Tab): Panel | null;
    moveTab(tab: Tab, targetPanel: Panel, direction: SplitDirection, tabIndex: number): void;
    findParentSplit(panel: Panel): Split | null;
    convertToSplit(parentSplit: Split, panel: Panel, first: Panel, second: Panel, orientation: SplitOrientation): void;
    toJSON(): LayoutData;
    applyJSON(data: LayoutData): this;
}
