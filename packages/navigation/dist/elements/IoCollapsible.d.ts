import { IoElement, VDOMElement, IoElementProps, WithBinding } from '@io-gui/core';
export type IoCollapsibleProps = IoElementProps & {
    elements?: VDOMElement[];
    label?: string;
    direction?: 'column' | 'row';
    icon?: string;
    expanded?: WithBinding<boolean>;
};
/**
 * An element with collapsible content.
 * When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.
 **/
export declare class IoCollapsible extends IoElement {
    static get Style(): string;
    elements: VDOMElement[];
    label: string;
    direction: 'column' | 'row';
    icon: string;
    expanded: boolean;
    role: string;
    changed(): void;
}
export declare const ioCollapsible: (arg0?: IoCollapsibleProps) => VDOMElement;
//# sourceMappingURL=IoCollapsible.d.ts.map