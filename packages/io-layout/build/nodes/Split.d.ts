import { Node, NodeArray } from 'io-gui';
import { Panel, PanelProps } from './Panel.js';
export type SplitOrientation = 'horizontal' | 'vertical';
export type SplitDirection = 'none' | 'left' | 'right' | 'top' | 'bottom' | 'center';
export type SplitProps = {
    children: Array<SplitProps | PanelProps>;
    orientation?: SplitOrientation;
    flex?: string;
};
export declare class Split extends Node {
    children: NodeArray<Split | Panel>;
    orientation: SplitOrientation;
    flex: string;
    constructor(args: SplitProps);
    removeChild(child: Panel | Split): void;
    addSplit(child: Panel | Split, index?: number): void;
    convertToSplit(panel: Panel, first: Panel, second: Panel, orientation: SplitOrientation): void;
    convertToPanel(split: Split): void;
    childrenMutated(): void;
    childrenMutatedDebounced(): void;
    toJSON(): SplitProps;
    fromJSON(json: SplitProps): this;
}
//# sourceMappingURL=Split.d.ts.map