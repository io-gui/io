import { ReactiveNode, NodeArray } from '@io-gui/core';
import { Tab, TabProps } from './Tab.js';
export type PanelProps = {
    type: 'panel';
    tabs: Array<TabProps>;
    flex?: string;
};
export declare class Panel extends ReactiveNode {
    tabs: NodeArray<Tab>;
    flex: string;
    constructor(args: PanelProps);
    tabsMutated(): void;
    onTabsMutatedDebounced(): void;
    getSelected(): string;
    setSelected(id: string): void;
    flexChanged(): void;
    toJSON(): PanelProps;
    fromJSON(json: PanelProps): this;
    dispose(): void;
}
//# sourceMappingURL=Panel.d.ts.map