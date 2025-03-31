import { IoElement, VDOMArray } from 'io-gui';
/**
 * An element with collapsable content.
 * When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.
 **/
export declare class IoCollapsable extends IoElement {
    static get Style(): string;
    elements: VDOMArray[];
    label: string;
    direction: 'column' | 'row';
    icon: string;
    expanded: boolean;
    role: string;
    changed(): void;
}
export declare const ioCollapsable: (arg0?: import("io-gui").IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray;
//# sourceMappingURL=io-collapsable.d.ts.map