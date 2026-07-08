import { ReactiveObject, NodeArray } from '@io-gui/core';
import { Tab, TabData } from './Tab.js';
export type PanelData = {
    type: 'panel';
    tabs: Array<TabData>;
    size?: string;
};
export declare class Panel extends ReactiveObject {
    tabs: NodeArray<Tab>;
    size: string;
    constructor(data: PanelData);
    tabsMutated(): void;
    onTabsMutatedDebounced(): void;
    get selectedID(): string;
    addTab(tab: Tab, index?: number): void;
    removeTab(tab: Tab): void;
    moveTab(tab: Tab, index: number): void;
    selectByIndex(index: number): void;
    sizeChanged(): void;
    toJSON(): PanelData;
    applyJSON(data: PanelData): this;
}
