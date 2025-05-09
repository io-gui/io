import { VDOMElement, PropsWithBinding } from 'io-gui';
import { IoNavigatorBase, IoNavigatorBaseProps } from './IoNavigatorBase.js';
export type IoNavigatorMdViewProps = IoNavigatorBaseProps & PropsWithBinding<{
    strip?: string[];
    sanitize?: boolean;
}>;
export declare class IoNavigatorMdView extends IoNavigatorBase {
    static vConstructor: (arg0?: IoNavigatorMdViewProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    strip: string[];
    sanitize: boolean;
    getSlotted(): VDOMElement;
}
export declare const ioNavigatorMdView: (arg0?: IoNavigatorMdViewProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoNavigatorMdView.d.ts.map