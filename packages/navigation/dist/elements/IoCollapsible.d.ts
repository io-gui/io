import { ReactiveElement, VDOMElement, ReactiveElementProps, WithBinding } from '@io-gui/core';
export type IoCollapsibleProps = ReactiveElementProps & {
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
export declare class IoCollapsible extends ReactiveElement {
    static get Style(): string;
    elements: VDOMElement[];
    label: string;
    direction: 'column' | 'row';
    icon: string;
    expanded: boolean;
    role: string;
    expandedChanged(): void;
    mutated(): void;
}
export declare const ioCollapsible: (arg0?: IoCollapsibleProps) => VDOMElement;
