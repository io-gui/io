import { IoElement, IoElementProps, WithBinding, VDOMElement } from '@io-gui/core';
import { PropertyConfig } from '../utils/EditorConfig.js';
import { PropertyGroups } from '../utils/EditorGroups.js';
import { EditorWidgets } from '../utils/EditorWidgets.js';
export type IoObjectProps = IoElementProps & {
    value?: Record<string, any> | any[];
    properties?: string[];
    labeled?: boolean;
    label?: string;
    labelWidth?: string;
    expanded?: WithBinding<boolean>;
    persistentExpand?: boolean;
    config?: PropertyConfig[];
    groups?: PropertyGroups;
    widgets?: EditorWidgets;
};
/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside io-collapsible element. It can be configured to use custom property editors and display only specified properties.
 **/
export declare class IoObject extends IoElement {
    static get Style(): string;
    value: Record<string, any> | any[];
    properties: string[] | null;
    labeled: boolean;
    labelWidth: string;
    label: string;
    expanded: boolean;
    persistentExpand: boolean;
    config: PropertyConfig[];
    groups: PropertyGroups;
    widgets: EditorWidgets;
    role: string;
    valueChanged(): void;
    changed(): void;
}
export declare const ioObject: (arg0?: IoObjectProps) => VDOMElement;
//# sourceMappingURL=IoObject.d.ts.map