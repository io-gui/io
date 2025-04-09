import { IoElement, VDOMElement, IoElementArgs, ArgsWithBinding } from 'io-gui';
export type IoCollapsibleArgs = IoElementArgs & ArgsWithBinding<{
    elements?: VDOMElement[];
    label?: string;
    direction?: 'column' | 'row';
    icon?: string;
    expanded?: boolean;
}>;
/**
 * An element with collapsible content.
 * When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.
 **/
export declare class IoCollapsible extends IoElement {
    static vConstructor: (arg0?: IoCollapsibleArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    elements: VDOMElement[];
    label: string;
    direction: 'column' | 'row';
    icon: string;
    expanded: boolean;
    role: string;
    changed(): void;
}
export declare const ioCollapsible: (arg0?: IoCollapsibleArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=io-collapsible.d.ts.map