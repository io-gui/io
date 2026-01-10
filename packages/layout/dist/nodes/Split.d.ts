import { Node, NodeArray } from '@io-gui/core';
import { Panel, PanelProps } from './Panel.js';
export type SplitOrientation = 'horizontal' | 'vertical';
export type SplitProps = {
    type: 'split';
    children: Array<SplitProps | PanelProps>;
    orientation?: SplitOrientation;
    flex?: string;
};
export declare class Split extends Node {
    children: NodeArray<Split | Panel>;
    orientation: SplitOrientation;
    flex: string;
    constructor(args: SplitProps);
    childrenMutated(): void;
    onChildrenMutatedDebounced(): void;
    toJSON(): SplitProps;
    fromJSON(json: SplitProps): this;
    dispose(): void;
}
//# sourceMappingURL=Split.d.ts.map