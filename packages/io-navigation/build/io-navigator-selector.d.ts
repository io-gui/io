import { VDOMElement, ArgsWithBinding } from 'io-gui';
import { IoNavigatorBase, IoNavigatorBaseArgs } from './io-navigator-base.js';
export type IoNavigatorSelectorArgs = IoNavigatorBaseArgs & ArgsWithBinding<{
    select?: 'first' | 'last';
    cache?: boolean;
    precache?: boolean;
}>;
export declare class IoNavigatorSelector extends IoNavigatorBase {
    static vConstructor: (arg0?: IoNavigatorSelectorArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    select: 'first' | 'last';
    cache: boolean;
    precache: boolean;
    getSlotted(): VDOMElement;
}
export declare const ioNavigatorSelector: (arg0?: IoNavigatorSelectorArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=io-navigator-selector.d.ts.map