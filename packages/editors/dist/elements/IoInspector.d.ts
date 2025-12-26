import { IoElement, IoElementProps, WithBinding } from '@io-gui/core';
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
    static get Style(): string;
    value: Object | Array<any>;
    selected: Object | Array<any>;
    search: string;
    config: EditorConfig;
    groups: EditorGroups;
    widgets: EditorWidgets;
    static get Listeners(): {
        'io-button-clicked': string;
    };
    init(): void;
    onLinkClicked(event: CustomEvent): void;
    valueChanged(): void;
    valueMutated(): void;
    selectedMutated(): void;
    selectedChanged(): void;
    changed(): void;
    changeThrottled(): void;
    dispose(): void;
}
export declare const ioInspector: (arg0?: IoInspectorProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoInspector.d.ts.map