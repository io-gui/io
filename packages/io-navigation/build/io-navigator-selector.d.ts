import { VDOMArray } from 'io-gui';
import { IoNavigatorBase } from './io-navigator-base.js';
export declare class IoNavigatorSelector extends IoNavigatorBase {
    select: 'first' | 'last';
    cache: boolean;
    precache: boolean;
    getSlotted(): VDOMArray;
}
export declare const ioNavigatorSelector: (arg0?: import("io-gui").IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray;
//# sourceMappingURL=io-navigator-selector.d.ts.map