import { IoElement, IoElementProps } from '@io-gui/core';
import { SplitDirection } from './IoSplit.js';
import { IoPanel } from './IoPanel.js';
declare class IoTabDropMarker extends IoElement {
    static get Style(): string;
    dropTarget: IoPanel | null;
    splitDirection: SplitDirection;
    dropIndex: number;
    constructor(args?: IoElementProps);
    changed(): void;
}
export declare const ioTabDropMarkerSingleton: IoTabDropMarker;
export {};
//# sourceMappingURL=IoTabDropMarker.d.ts.map