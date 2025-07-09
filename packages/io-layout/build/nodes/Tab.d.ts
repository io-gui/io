import { Node, NodeProps } from 'io-gui';
export type TabProps = NodeProps & {
    id: string;
    label?: string;
    icon?: string;
};
export declare class Tab extends Node {
    id: string;
    label: string;
    icon: string;
    constructor(args: TabProps);
    toJSON(): TabProps;
    fromJSON(json: TabProps): this;
}
//# sourceMappingURL=Tab.d.ts.map