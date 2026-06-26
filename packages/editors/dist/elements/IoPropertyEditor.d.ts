import { ReactiveElement, IoElementProps, VDOMElement } from '@io-gui/core';
import { PropertyConfig } from '../utils/EditorConfig.js';
import { PropertyGroups } from '../utils/EditorGroups.js';
export type IoPropertyEditorProps = IoElementProps & {
    value?: Record<string, any> | any[];
    properties?: string[] | null;
    label?: string;
    labeled?: boolean;
    labelWidth?: string;
    config?: PropertyConfig[];
    groups?: PropertyGroups;
    widget?: VDOMElement | null;
};
/**
 * Object editor. It displays a set of labeled property editors for the `value` object. Labels can be omitted by setting `labeled` property to false.
 **/
export declare class IoPropertyEditor extends ReactiveElement {
    static get Style(): string;
    value: object | Array<unknown>;
    properties: string[] | undefined;
    label: string;
    labeled: boolean;
    labelWidth: string;
    config: PropertyConfig[];
    groups: PropertyGroups;
    widget: VDOMElement | undefined | null;
    private _config;
    private _groups;
    private _widget;
    private _propertyEditors;
    _onValueInput(event: CustomEvent): void;
    configChanged(): void;
    groupsChanged(): void;
    widgetChanged(): void;
    valueChanged(): void;
    configureDebounced(): void;
    valueMutated(): void;
    mutated(): void;
    changedThrottled(): void;
    dispose(): void;
}
export declare const ioPropertyEditor: (arg0?: IoPropertyEditorProps) => VDOMElement;
