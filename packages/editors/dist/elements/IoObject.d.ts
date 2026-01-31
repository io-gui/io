import { IoElement, IoElementProps, WithBinding, VDOMElement } from '@io-gui/core';
import { PropertyConfig } from '../utils/EditorConfig.js';
import { PropertyGroups } from '../utils/EditorGroups.js';
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
    widget?: VDOMElement | null;
};
/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside io-collapsible element. It can be configured to use custom property editors and display only specified properties.
 **/
export declare class IoObject extends IoElement {
    static get Style(): string;
    value: Record<string, unknown> | Array<unknown>;
    properties: string[] | null;
    label: string;
    labeled: boolean;
    labelWidth: string;
    expanded: boolean;
    persistentExpand: boolean;
    config: PropertyConfig[];
    groups: PropertyGroups;
    widget: VDOMElement | undefined | null;
    role: string;
    valueChanged(): void;
    expandedChanged(): void;
    changed(): void;
}
export declare const ioObject: (arg0?: IoObjectProps) => VDOMElement;
//# sourceMappingURL=IoObject.d.ts.map