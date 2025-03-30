import { IoElement, Constructor } from 'io-gui';
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
//# sourceMappingURL=io-object.d.ts.map