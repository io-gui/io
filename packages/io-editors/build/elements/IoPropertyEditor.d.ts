import { IoElement, IoElementProps, PropsWithBinding, VDOMElement } from 'io-gui';
import { EditorConfig } from '../utils/EditorConfig';
import { EditorGroups } from '../utils/EditorGroups';
import { EditorWidgets } from '../utils/EditorWidgets';
export type IoPropertyEditorProps = IoElementProps & PropsWithBinding<{
    value?: Record<string, any> | any[];
    properties?: string[];
    config?: EditorConfig;
    groups?: EditorGroups;
    widgets?: EditorWidgets;
    labeled?: boolean;
}>;
/**
 * Object editor. It displays a set of labeled property editors for the `value` object. Labels can be omitted by setting `labeled` property to false.
 **/
export declare class IoPropertyEditor extends IoElement {
    static vConstructor: (arg0?: IoPropertyEditorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    reactivity: string;
    value: Object;
    properties: string[];
    config: EditorConfig;
    groups: EditorGroups;
    widgets: EditorWidgets;
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
export declare const ioPropertyEditor: (arg0?: IoPropertyEditorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoPropertyEditor.d.ts.map