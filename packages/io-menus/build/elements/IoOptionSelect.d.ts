import { IoElement, Change, IoElementProps, VDOMElement, WithBinding } from 'io-gui';
import { MenuItem } from '../nodes/MenuItem.js';
import { MenuOptions } from '../nodes/MenuOptions.js';
export type SelectBy = 'value' | 'id';
export type IoOptionSelectProps = IoElementProps & {
    value?: WithBinding<any>;
    label?: string;
    icon?: string;
    selectBy?: SelectBy;
    options?: MenuOptions;
};
/**
 * Option select element. Similar to `IoMenuItem`, except it is displayed as a button and uses `options` property instead of ~~`option.options`~~  and it is `selectable` by default. It displays selected `value` or `label` followed by the `â–¾` character.
 * When clicked or activated by space/enter key, it expands a menu with selectable options.
 **/
export declare class IoOptionSelect extends IoElement {
    static vConstructor: (arg0?: IoOptionSelectProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: any;
    label: string;
    icon: string;
    selectBy: SelectBy;
    options: MenuOptions;
    role: string;
    $item: MenuItem;
    constructor(args?: IoOptionSelectProps);
    ready(): void;
    _onItemSelected(event: CustomEvent): void;
    inputValue(value: any): void;
    optionsChanged(change: Change): void;
    optionsMutated(): void;
    changed(): void;
    onChange(): void;
}
export declare const ioOptionSelect: (arg0?: IoOptionSelectProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoOptionSelect.d.ts.map