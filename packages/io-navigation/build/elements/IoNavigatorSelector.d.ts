import { VDOMElement, PropsWithBinding } from 'io-gui';
import { IoNavigatorBase, IoNavigatorBaseProps } from './IoNavigatorBase.js';
export type IoNavigatorSelectorProps = IoNavigatorBaseProps & PropsWithBinding<{
    select?: 'first' | 'last';
    cache?: boolean;
    precache?: boolean;
}>;
export declare class IoNavigatorSelector extends IoNavigatorBase {
    static vConstructor: (arg0?: IoNavigatorSelectorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    select: 'first' | 'last';
    cache: boolean;
    precache: boolean;
    getSlotted(): VDOMElement;
}
export declare const ioNavigatorSelector: (arg0?: IoNavigatorSelectorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoNavigatorSelector.d.ts.map