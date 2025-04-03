import { IoElement, VDOMArray } from 'io-gui';
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
}
export declare const ioCollapsible: (arg0?: import("io-gui").IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-collapsible.d.ts.map