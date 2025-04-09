import { VDOMElement, ArgsWithBinding } from 'io-gui';
import { IoNavigatorBase, IoNavigatorBaseArgs } from './io-navigator-base.js';
export type IoNavigatorMdViewArgs = IoNavigatorBaseArgs & ArgsWithBinding<{
    strip?: string[];
    sanitize?: boolean;
}>;
export declare class IoNavigatorMdView extends IoNavigatorBase {
    static vConstructor: (arg0?: IoNavigatorMdViewArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    strip: string[];
    sanitize: boolean;
    getSlotted(): VDOMElement;
}
export declare const ioNavigatorMdView: (arg0?: IoNavigatorMdViewArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=io-navigator-md-view.d.ts.map