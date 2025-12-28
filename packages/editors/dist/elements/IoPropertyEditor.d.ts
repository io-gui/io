import { IoElement, IoElementProps } from '@io-gui/core';
import { EditorConfig } from '../utils/EditorConfig.js';
import { EditorGroups } from '../utils/EditorGroups.js';
import { EditorWidgets } from '../utils/EditorWidgets.js';
export type IoPropertyEditorProps = IoElementProps & {
    value?: Record<string, any> | any[];
    properties?: string[] | null;
    labeled?: boolean;
    orientation?: 'vertical' | 'horizontal';
    config?: EditorConfig;
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
    config: EditorConfig;
    groups: EditorGroups;
    widgets: EditorWidgets;
    init(): void;
    _onValueInput(event: CustomEvent): void;
    valueMutated(): void;
    changeThrottled(): void;
    changed(): void;
    dispose(): void;
}
export declare const ioPropertyEditor: (arg0?: IoPropertyEditorProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoPropertyEditor.d.ts.map