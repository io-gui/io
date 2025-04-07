import { IoElement, Change, IoElementArgs, VDOMArray, ArgsWithBinding } from 'io-gui';
import { MenuItem } from './models/menu-item.js';
import { MenuOptions } from './models/menu-options.js';
export type IoOptionMenuArgs = IoElementArgs & ArgsWithBinding<{
    value?: any;
    options?: MenuOptions;
    item?: MenuItem;
}>;
/**
 * Option select element. Similar to `IoMenuItem`, except it is displayed as a button and uses `options` property instead of ~~`option.options`~~  and it is `selectable` by default. It displays selected `value` or `label` followed by the `â–¾` character.
 * When clicked or activated by space/enter key, it expands a menu with selectable options.
 **/
export declare class IoOptionMenu extends IoElement {
    static vConstructor: (arg0?: IoOptionMenuArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
    static get Style(): string;
    value: any;
    options: MenuOptions;
    role: string;
    item: MenuItem;
    constructor(args?: IoOptionMenuArgs);
    _onLeafChanged(event: CustomEvent): void;
    optionsChanged(change: Change): void;
    changed(): void;
}
export declare const ioOptionMenu: (arg0?: IoOptionMenuArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-option-menu.d.ts.map