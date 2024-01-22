import { IoElement, VDOMArray } from '../../core/element.js';
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
//# sourceMappingURL=io-collapsable.d.ts.map