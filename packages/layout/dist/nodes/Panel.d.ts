import { ReactiveObject, NodeArray } from '@io-gui/core';
import { Tab, TabData } from './Tab.js';
import { LayoutSizeData } from '../utils/layoutSize.js';
export type PanelData = {
    type: 'panel';
    tabs: Array<TabData>;
} & LayoutSizeData;
export declare class Panel extends ReactiveObject {
    tabs: NodeArray<Tab>;
    size: string;
    constructor(data: PanelData);
    tabsMutated(): void;
    onTabsMutatedDebounced(): void;
    getSelected(): string;
    setSelected(id: string): void;
    sizeChanged(): void;
    toJSON(): PanelData;
    applyJSON(data: PanelData): this;
}
