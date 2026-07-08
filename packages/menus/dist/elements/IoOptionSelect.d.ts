import { ReactiveElement, Change, ReactiveElementProps, WithBinding } from '@io-gui/core';
import { Menu } from '../models/Menu.js';
export type IoOptionSelectProps = ReactiveElementProps & {
    model?: Menu;
    value?: WithBinding<any>;
    label?: string;
    icon?: string;
};
/**
 * Entry point that presents a Menu as a dropdown button. It displays the selected option's label
 * followed by the `▾` character and expands the menu when clicked or activated by space/enter key.
 *
 * `value` is payload, not identity: it mirrors the selected Option's `value`. Writing `value`
 * matches it to an Option at this boundary and selects that Option by its id.
 **/
export declare class IoOptionSelect extends ReactiveElement {
    static get Style(): string;
    value: any;
    label: string;
    icon: string;
    model: Menu;
    role: string;
    constructor(args: IoOptionSelectProps);
    onSelectedIDChanged(): void;
    inputValue(value: any): void;
    valueChanged(): void;
    modelChanged(change: Change): void;
    modelMutated(): void;
    mutated(): void;
}
export declare const ioOptionSelect: (arg0: IoOptionSelectProps) => import("@io-gui/core").VDOMElement;
