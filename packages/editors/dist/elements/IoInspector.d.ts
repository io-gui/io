import { IoElement, IoElementProps, WithBinding, VDOMElement } from '@io-gui/core';
import { PropertyConfig } from '../utils/EditorConfig.js';
import { PropertyGroups } from '../utils/EditorGroups.js';
export type IoInspectorProps = IoElementProps & {
    value?: Record<string, any> | any[];
    selected?: WithBinding<Record<string, any> | any[]>;
    search?: WithBinding<string>;
    config?: PropertyConfig[];
    groups?: PropertyGroups;
    widget?: VDOMElement;
};
/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside multiple `io-collapsible` elements. It can be configured to use custom property editors and display only specified properties. Properties of type `Object` are displayed as clickable links which can also be navigated in the `io-breadcrumbs` element.
 **/
export declare class IoInspector extends IoElement {
    static get Style(): string;
    value: object | Array<any>;
    selected: object | Array<any>;
    search: string;
    config: PropertyConfig[];
    groups: PropertyGroups;
    widget: VDOMElement;
    static get Listeners(): {
        'io-button-clicked': string;
    };
    onLinkClicked(event: CustomEvent): void;
    valueChanged(): void;
    valueMutated(): void;
    selectedMutated(): void;
    selectedChanged(): void;
    changed(): void;
    changedDebounced(): void;
    dispose(): void;
}
export declare const ioInspector: (arg0?: IoInspectorProps) => VDOMElement;
//# sourceMappingURL=IoInspector.d.ts.map