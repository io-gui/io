import { VDOMElement, ArgsWithBinding } from 'io-gui';
import { IoNavigatorBase, IoNavigatorBaseArgs } from './IoNavigatorBase.js';
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
//# sourceMappingURL=IoNavigatorMdView.d.ts.map