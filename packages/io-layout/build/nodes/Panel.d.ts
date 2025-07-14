import { Node, NodeArray } from 'io-gui';
import { Tab, TabProps } from './Tab.js';
export type PanelProps = {
    tabs: Array<TabProps>;
    flex?: string;
    selected?: string;
};
export declare class Panel extends Node {
    tabs: NodeArray<Tab>;
    flex: string;
    constructor(args: PanelProps);
    tabsMutated(): void;
    tabsMutatedDebounced(): void;
    toJSON(): PanelProps;
    fromJSON(json: PanelProps): this;
}
//# sourceMappingURL=Panel.d.ts.map