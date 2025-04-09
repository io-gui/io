import { IoElement, AnyConstructor, IoElementArgs, ArgsWithBinding, VDOMElement } from 'io-gui';
import './io-property-editor.js';
import { PropertyConfig } from './models/editor-config.js';
export type IoObjectArgs = IoElementArgs & ArgsWithBinding<{
    value?: Record<string, any> | any[];
    properties?: string[];
    config?: Map<AnyConstructor, PropertyConfig[]>;
    labeled?: boolean;
    label?: string;
    expanded?: boolean;
}>;
/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside io-collapsible element. It can be configured to use custom property editors and display only specified properties.
 **/
export declare class IoObject extends IoElement {
    static vConstructor: (arg0?: IoObjectArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: Record<string, any> | any[];
    properties: string[];
    config: Map<AnyConstructor, PropertyConfig[]>;
    labeled: boolean;
    label: string;
    expanded: boolean;
    role: string;
    changed(): void;
}
export declare const ioObject: (arg0?: IoObjectArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=io-object.d.ts.map