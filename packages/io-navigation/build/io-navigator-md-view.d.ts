import { VDOMArray, ArgsWithBinding } from 'io-gui';
import { IoNavigatorBase, IoNavigatorBaseArgs } from './io-navigator-base.js';
export type IoNavigatorMdViewArgs = IoNavigatorBaseArgs & ArgsWithBinding<{
    strip?: string[];
    sanitize?: boolean;
}>;
export declare class IoNavigatorMdView extends IoNavigatorBase {
    static vConstructor: (arg0?: IoNavigatorMdViewArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
    strip: string[];
    sanitize: boolean;
    getSlotted(): VDOMArray;
}
export declare const ioNavigatorMdView: (arg0?: IoNavigatorMdViewArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-navigator-md-view.d.ts.map