import { Node, NodeProps } from 'io-gui';
import { Tab, TabProps } from './Tab.js';
export type PanelProps = NodeProps & {
    tabs: Array<Tab> | Array<TabProps>;
    selected: string;
    flex?: string;
};
export declare class Panel extends Node {
    tabs: Array<Tab>;
    selected: string;
    flex: string;
    constructor(args: PanelProps);
    toJSON(): PanelProps;
    fromJSON(json: PanelProps): this;
}
//# sourceMappingURL=Panel.d.ts.map