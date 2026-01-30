import { IoField, IoFieldProps } from '@io-gui/inputs';
import { Tab } from '../nodes/Tab.js';
import { IoSplit, SplitDirection } from './IoSplit.js';
import { IoPanel } from './IoPanel.js';
declare class IoTabDragIcon extends IoField {
    static get Style(): string;
    dragging: boolean;
    tab: Tab | null;
    dropSource: IoPanel | null;
    dropTarget: IoPanel | null;
    splitDirection: SplitDirection;
    dropIndex: number;
    private _startX;
    private _startY;
    constructor(args?: IoFieldProps);
    setStartPosition(x: number, y: number): void;
    updateDrag(tab: Tab, sourcePanel: IoPanel, x: number, y: number, root: IoSplit | null): void;
    private detectDropTargets;
    private calculateSplitDirection;
    endDrag(): void;
    cancelDrag(): void;
    changed(): void;
}
export declare const tabDragIconSingleton: IoTabDragIcon;
export {};
//# sourceMappingURL=IoTabDragIcon.d.ts.map