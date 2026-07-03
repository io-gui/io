import { ReactiveObject } from '@io-gui/core';
import { Panel, PanelData } from './Panel.js';
import { Split, SplitData } from './Split.js';
export type LayoutChildData = SplitData | PanelData;
export type LayoutChild = Split | Panel;
export type LayoutData = {
    child: LayoutChildData;
};
export declare function createLayoutChild(child: SplitData | PanelData): Split | Panel;
export declare function isPanelNode(node: LayoutChild): node is Panel;
export declare function isSplitNode(node: LayoutChild): node is Split;
export declare class Layout extends ReactiveObject {
    child: LayoutChild;
    constructor(data: LayoutData);
    toJSON(): LayoutData;
    applyJSON(data: LayoutData): this;
}
