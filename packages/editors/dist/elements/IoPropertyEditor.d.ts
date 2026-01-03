import { IoElement, IoElementProps, VDOMElement } from '@io-gui/core';
import { PropertyConfig } from '../utils/EditorConfig.js';
import { EditorGroups } from '../utils/EditorGroups.js';
import { EditorWidgets } from '../utils/EditorWidgets.js';
export type IoPropertyEditorProps = IoElementProps & {
    value?: Record<string, any> | any[];
    properties?: string[] | null;
    labeled?: boolean;
    orientation?: 'vertical' | 'horizontal';
    config?: PropertyConfig[];
    groups?: EditorGroups;
    widgets?: EditorWidgets;
};
/**
 * Object editor. It displays a set of labeled property editors for the `value` object. Labels can be omitted by setting `labeled` property to false.
 **/
export declare class IoPropertyEditor extends IoElement {
    static get Style(): string;
    value: object | Array<any>;
    properties: string[];
    labeled: boolean;
    orientation: 'vertical' | 'horizontal';
    config: PropertyConfig[];
    groups: EditorGroups;
    widgets: EditorWidgets;
    private _config;
    private _groups;
    private _widget;
    init(): void;
    _onValueInput(event: CustomEvent): void;
    valueMutated(event: CustomEvent): void;
    configChanged(): void;
    groupsChanged(): void;
    widgetChanged(): void;
    valueChanged(): void;
    configureThrottled(): void;
    changed(): void;
    changedDebounced(): void;
    dispose(): void;
}
export declare const ioPropertyEditor: (arg0?: IoPropertyEditorProps) => VDOMElement;
//# sourceMappingURL=IoPropertyEditor.d.ts.map