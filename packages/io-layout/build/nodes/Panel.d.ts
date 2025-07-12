import { Node, NodeArray } from 'io-gui';
import { Tab, TabProps } from './Tab.js';
export type PanelProps = {
    tabs: Array<TabProps>;
    selected?: string;
    flex?: string;
};
export declare class Panel extends Node {
    tabs: NodeArray<Tab>;
    selected: string;
    flex: string;
    constructor(args: PanelProps);
    selectIndex(index: number): void;
    removeTab(tab: Tab): void;
    moveTab(tab: Tab, index: number): void;
    addTab(tab: Tab, index?: number): void;
    tabsMutated(): void;
    tabsMutatedDebounced(): void;
    toJSON(): PanelProps;
    fromJSON(json: PanelProps): this;
}
//# sourceMappingURL=Panel.d.ts.map