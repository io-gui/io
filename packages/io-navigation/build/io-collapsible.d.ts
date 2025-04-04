import { IoElement, VDOMArray, IoElementArgs, ArgsWithBinding } from 'io-gui';
export type IoCollapsibleArgs = IoElementArgs & ArgsWithBinding<{
    elements?: VDOMArray[];
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
    static get Style(): string;
    elements: VDOMArray[];
    label: string;
    direction: 'column' | 'row';
    icon: string;
    expanded: boolean;
    role: string;
    changed(): void;
    static vDOM: (arg0?: IoCollapsibleArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
}
export declare const ioCollapsible: (arg0?: IoCollapsibleArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-collapsible.d.ts.map