import { IoElement, Change, IoElementProps, VDOMElement, WithBinding } from 'io-gui';
import { MenuItem } from '../nodes/MenuItem.js';
import { MenuOptions } from '../nodes/MenuOptions.js';
export type IoOptionMenuProps = IoElementProps & {
    value?: WithBinding<any>;
    options?: MenuOptions;
    item?: MenuItem;
};
/**
 * Option select element. Similar to `IoMenuItem`, except it is displayed as a button and uses `options` property instead of ~~`option.options`~~  and it is `selectable` by default. It displays selected `value` or `label` followed by the `â–¾` character.
 * When clicked or activated by space/enter key, it expands a menu with selectable options.
 **/
export declare class IoOptionMenu extends IoElement {
    static vConstructor: (arg0?: IoOptionMenuProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: any;
    options: MenuOptions;
    item: MenuItem;
    role: string;
    constructor(args?: IoOptionMenuProps);
    _onLastChanged(event: CustomEvent): void;
    optionsChanged(change: Change): void;
    changed(): void;
}
export declare const ioOptionMenu: (arg0?: IoOptionMenuProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoOptionMenu.d.ts.map