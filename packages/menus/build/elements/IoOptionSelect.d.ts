import { IoElement, Change, IoElementProps, WithBinding } from 'io-core';
import { MenuOption } from '../nodes/MenuOption.js';
export type SelectBy = 'value' | 'id';
export type IoOptionSelectProps = IoElementProps & {
    option: MenuOption;
    value?: WithBinding<any>;
    label?: string;
    icon?: string;
    selectBy?: SelectBy;
};
/**
 * Option select element. Similar to `IoMenuItem`, except it is displayed as a button and uses `options` property instead of ~~`option.options`~~  and it is `selectable` by default. It displays selected `value` or `label` followed by the `â–¾` character.
 * When clicked or activated by space/enter key, it expands a menu with selectable options.
 **/
export declare class IoOptionSelect extends IoElement {
    static get Style(): string;
    value: any;
    label: string;
    icon: string;
    selectBy: SelectBy;
    option: MenuOption;
    role: string;
    constructor(args: IoOptionSelectProps);
    onOptionSelected(event: CustomEvent): void;
    inputValue(value: any): void;
    optionChanged(change: Change): void;
    changed(): void;
}
export declare const ioOptionSelect: (arg0: IoOptionSelectProps) => import("io-core").VDOMElement;
//# sourceMappingURL=IoOptionSelect.d.ts.map