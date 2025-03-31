import { IoElement, VDOMArray, Constructor } from 'io-gui';
import './io-property-editor.js';
import { PropertyConfig } from './models/editor-config.js';
/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside io-collapsable element. It can be configured to use custom property editors and display only specified properties.
 **/
export declare class IoObject extends IoElement {
    static get Style(): string;
    value: Record<string, any> | any[];
    properties: string[];
    config: Map<Constructor, PropertyConfig[]>;
    labeled: boolean;
    label: string;
    expanded: boolean;
    role: string;
    changed(): void;
}
export declare const ioObject: (arg0?: import("io-gui").IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray;
//# sourceMappingURL=io-object.d.ts.map