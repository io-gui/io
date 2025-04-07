import { IoElement, IoElementArgs, AnyConstructor, ArgsWithBinding, VDOMArray } from 'io-gui';
import { PropertyConfig } from './models/editor-config.js';
export type IoPropertyEditorArgs = IoElementArgs & ArgsWithBinding<{
    value?: Record<string, any> | any[];
    properties?: string[];
    config?: Map<AnyConstructor, PropertyConfig[]>;
    labeled?: boolean;
}>;
/**
 * Object editor. It displays a set of labeled property editors for the `value` object. Labels can be omitted by setting `labeled` property to false.
 **/
export declare class IoPropertyEditor extends IoElement {
    static vConstructor: (arg0?: IoPropertyEditorArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
    static get Style(): string;
    reactivity: string;
    value: Record<string, any> | any[];
    properties: string[];
    config: Map<AnyConstructor, PropertyConfig[]>;
    labeled: boolean;
    _onValueInput(event: CustomEvent): void;
    valueMutated(): void;
    changed(): void;
    /**
     * Returns a JSON representation of the property editor. This feature is used in testing.
     * @return {Object} JSON representation of the property editor.
     */
    toJSON(): any;
}
export declare const ioPropertyEditor: (arg0?: IoPropertyEditorArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-property-editor.d.ts.map