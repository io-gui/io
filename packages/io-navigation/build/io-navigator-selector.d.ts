import { VDOMArray, ArgsWithBinding } from 'io-gui';
import { IoNavigatorBase, IoNavigatorBaseArgs } from './io-navigator-base.js';
export type IoNavigatorSelectorArgs = IoNavigatorBaseArgs & ArgsWithBinding<{
    select?: 'first' | 'last';
    cache?: boolean;
    precache?: boolean;
}>;
export declare class IoNavigatorSelector extends IoNavigatorBase {
    static vConstructor: (arg0?: IoNavigatorSelectorArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
    select: 'first' | 'last';
    cache: boolean;
    precache: boolean;
    getSlotted(): VDOMArray;
}
export declare const ioNavigatorSelector: (arg0?: IoNavigatorSelectorArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-navigator-selector.d.ts.map