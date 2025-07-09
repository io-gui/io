import { Node, NodeProps } from 'io-gui';
import { Panel, PanelProps } from './Panel.js';
export type SplitOrientation = 'horizontal' | 'vertical';
export type SplitProps = NodeProps & {
    orientation?: SplitOrientation;
    children: Array<Split | Panel> | Array<SplitProps | PanelProps>;
    flex?: string;
};
export declare class Split extends Node {
    orientation: SplitOrientation;
    children: Array<Split | Panel>;
    flex: string;
    constructor(args: SplitProps);
    remove(child: Panel | Split): void;
    convertToPanel(split: Split): void;
    toJSON(): SplitProps;
    fromJSON(json: SplitProps): this;
}
//# sourceMappingURL=Split.d.ts.map