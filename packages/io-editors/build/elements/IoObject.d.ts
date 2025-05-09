import { IoElement, IoElementProps, PropsWithBinding, VDOMElement } from 'io-gui';
import { EditorConfig } from '../utils/EditorConfig';
import { EditorGroups } from '../utils/EditorGroups';
import { EditorWidgets } from '../utils/EditorWidgets';
export type IoObjectProps = IoElementProps & PropsWithBinding<{
    value?: Record<string, any> | any[];
    properties?: string[];
    config?: EditorConfig;
    groups?: EditorGroups;
    widgets?: EditorWidgets;
    labeled?: boolean;
    label?: string;
    expanded?: boolean;
}>;
/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside io-collapsible element. It can be configured to use custom property editors and display only specified properties.
 **/
export declare class IoObject extends IoElement {
    static vConstructor: (arg0?: IoObjectProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: Record<string, any> | any[];
    properties: string[];
    config: EditorConfig;
    groups: EditorGroups;
    widgets: EditorWidgets;
    labeled: boolean;
    label: string;
    expanded: boolean;
    role: string;
    changed(): void;
}
export declare const ioObject: (arg0?: IoObjectProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoObject.d.ts.map