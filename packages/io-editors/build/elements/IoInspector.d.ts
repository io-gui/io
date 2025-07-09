import { IoElement, VDOMElement, IoElementProps, WithBinding } from 'io-gui';
import { EditorConfig } from '../utils/EditorConfig.js';
import { EditorGroups } from '../utils/EditorGroups.js';
import { EditorWidgets } from '../utils/EditorWidgets.js';
export type IoInspectorProps = IoElementProps & {
    value?: Record<string, any> | any[];
    selected?: WithBinding<Record<string, any> | any[]>;
    search?: WithBinding<string>;
    config?: EditorConfig;
    groups?: EditorGroups;
    widgets?: EditorWidgets;
};
/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside multiple `io-collapsible` elements. It can be configured to use custom property editors and display only specified properties. Properties of type `Object` are displayed as clickable links which can also be navigated in the `io-breadcrumbs` element.
 **/
export declare class IoInspector extends IoElement {
    static vConstructor: (arg0?: IoInspectorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: Record<string, any> | any[];
    selected: Record<string, any> | any[];
    search: string;
    config: EditorConfig;
    groups: EditorGroups;
    widgets: EditorWidgets;
    _cfgTimeout: number;
    static get Listeners(): {
        'io-button-clicked': string;
    };
    onLinkClicked(event: CustomEvent): void;
    valueChanged(): void;
    selectedChanged(): void;
    selectedMutated(): void;
    changed(): void;
    _onChangedThrottled(): void;
    _onChange(): void;
}
export declare const ioInspector: (arg0?: IoInspectorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoInspector.d.ts.map