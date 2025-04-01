import { IoElement, IoElementArgs, Constructor } from 'io-gui';
import { PropertyConfig } from './models/editor-config.js';
/**
 * Object editor. It displays a set of labeled property editors for the `value` object. Labels can be omitted by setting `labeled` property to false.
 **/
export declare class IoPropertyEditor extends IoElement {
    static get Style(): string;
    reactivity: string;
    value: Record<string, any> | any[];
    properties: string[];
    config: Map<Constructor, PropertyConfig[]>;
    labeled: boolean;
    _onValueInput(event: CustomEvent): void;
    valueMutated(): void;
    changed(): void;
}
export declare const ioPropertyEditor: (arg0?: IoElementArgs | import("io-gui").VDOMArray[], arg1?: import("io-gui").VDOMArray[]) => import("io-gui").VDOMArray;
//# sourceMappingURL=io-property-editor.d.ts.map