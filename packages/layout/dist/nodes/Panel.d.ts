import { ReactiveObject, NodeArray } from '@io-gui/core';
import { Tab, TabProps } from './Tab.js';
export type PanelProps = {
    type: 'panel';
    tabs: Array<TabProps>;
    flex?: string;
};
export declare class Panel extends ReactiveObject {
    tabs: NodeArray<Tab>;
    flex: string;
    constructor(args: PanelProps);
    tabsMutated(): void;
    onTabsMutatedDebounced(): void;
    getSelected(): string;
    setSelected(id: string): void;
    flexChanged(): void;
    toJSON(): PanelProps;
    applyJSON(json: PanelProps): this;
    dispose(): void;
}
