import { IoElement, IoElementArgs, AnyConstructor, ArgsWithBinding, VDOMElement } from 'io-gui';
import { PropertyConfig } from '../models/EditorConfig';
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
    static vConstructor: (arg0?: IoPropertyEditorArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
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
export declare const ioPropertyEditor: (arg0?: IoPropertyEditorArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoPropertyEditor.d.ts.map