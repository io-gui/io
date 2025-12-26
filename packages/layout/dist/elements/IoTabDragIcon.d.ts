import { IoField, IoFieldProps } from '@io-gui/inputs';
import { Tab } from '../nodes/Tab.js';
import { SplitDirection } from '../nodes/Split.js';
import { IoPanel } from './IoPanel.js';
declare class IoTabDragIcon extends IoField {
    static get Style(): string;
    dragging: boolean;
    tab: Tab | null;
    dropSource: IoPanel | null;
    dropTarget: IoPanel | null;
    splitDirection: SplitDirection;
    dropIndex: number;
    tabIndex: number;
    constructor(args?: IoFieldProps);
    changed(): void;
}
export declare const tabDragIconSingleton: IoTabDragIcon;
export {};
//# sourceMappingURL=IoTabDragIcon.d.ts.map