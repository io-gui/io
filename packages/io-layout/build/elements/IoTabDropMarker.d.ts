import { IoElement, IoElementProps } from 'io-core';
import { SplitDirection } from '../nodes/Split.js';
import { IoPanel } from './IoPanel.js';
declare class IoTabDropMarker extends IoElement {
    static get Style(): string;
    dropTarget: IoPanel | null;
    splitDirection: SplitDirection;
    dropIndex: number;
    constructor(args?: IoElementProps);
    changed(): void;
}
export declare const tabDropMarkerSingleton: IoTabDropMarker;
export {};
//# sourceMappingURL=IoTabDropMarker.d.ts.map