import { ReactiveObject, NodeArray } from '@io-gui/core';
import { Panel, PanelData } from './Panel.js';
import { LayoutSizeData } from '../utils/layoutSize.js';
export type SplitOrientation = 'horizontal' | 'vertical';
export type SplitData = {
    type: 'split';
    children: Array<SplitData | PanelData>;
    orientation?: SplitOrientation;
} & LayoutSizeData;
export declare class Split extends ReactiveObject {
    children: NodeArray<Split | Panel>;
    orientation: SplitOrientation;
    size: string;
    constructor(data: SplitData);
    childrenMutated(): void;
    onChildrenMutatedDebounced(): void;
    normalize(): void;
    consolidateChildAt(index: number, childSplit: Split): void;
    sizeChanged(): void;
    toJSON(): SplitData;
    applyJSON(data: SplitData): this;
}
