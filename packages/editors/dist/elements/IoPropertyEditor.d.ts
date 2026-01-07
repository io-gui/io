import { IoElement, IoElementProps, VDOMElement } from '@io-gui/core';
import { PropertyConfig } from '../utils/EditorConfig.js';
import { PropertyGroups } from '../utils/EditorGroups.js';
export type IoPropertyEditorProps = IoElementProps & {
    value?: Record<string, any> | any[];
    properties?: string[] | null;
    labeled?: boolean;
    labelWidth?: string;
    orientation?: 'vertical' | 'horizontal';
    config?: PropertyConfig[];
    groups?: PropertyGroups;
    widget?: VDOMElement;
};
/**
 * Object editor. It displays a set of labeled property editors for the `value` object. Labels can be omitted by setting `labeled` property to false.
 **/
export declare class IoPropertyEditor extends IoElement {
    static get Style(): string;
    value: object | Array<any>;
    properties: string[];
    labeled: boolean;
    labelWidth: string;
    orientation: 'vertical' | 'horizontal';
    config: PropertyConfig[];
    groups: PropertyGroups;
    widget: VDOMElement | undefined;
    private _config;
    private _groups;
    private _widget;
    _onValueInput(event: CustomEvent): void;
    valueMutated(event: CustomEvent): void;
    configChanged(): void;
    groupsChanged(): void;
    widgetChanged(): void;
    valueChanged(): void;
    configureDebounced(): void;
    changed(): void;
    changedDebounced(): void;
    dispose(): void;
}
export declare const ioPropertyEditor: (arg0?: IoPropertyEditorProps) => VDOMElement;
//# sourceMappingURL=IoPropertyEditor.d.ts.map