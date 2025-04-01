import { IoElement, Change } from 'io-gui';
import { MenuItem } from './models/menu-item.js';
import { MenuOptions } from './models/menu-options.js';
/**
 * Option select element. Similar to `IoMenuItem`, except it is displayed as a button and uses `options` property instead of ~~`option.options`~~  and it is `selectable` by default. It displays selected `value` or `label` followed by the `â–¾` character.
 *
 * <io-element-demo element="io-option-menu" properties='{
 *   "label": "",
 *   "value": 0,
 *   "options": [1,2,3]}
 * ' config='{"type:object": ["io-property-editor"]}'></io-element-demo>
 *
 * <io-element-demo element="io-option-menu" properties='{
 *   "label": "",
 *   "value": 0,
 *   "options": [
 *     {"value": 0, "label": "zero"},
 *     {"value": 1, "label": "one"},
 *     {"value": 2, "label": "two"},
 *     {"value": 3, "label": "three"}
 *   ]
 * }' config='{"type:object": ["io-property-editor"]}'></io-element-demo>
 *
 * When clicked or activated by space/enter key, it expands a menu with selectable options.
 **/
export declare class IoOptionMenu extends IoElement {
    static get Style(): string;
    value: any;
    options: MenuOptions;
    role: string;
    item: MenuItem;
    _onLeafChanged(event: CustomEvent): void;
    optionsChanged(change: Change): void;
    changed(): void;
}
export declare const ioOptionMenu: (arg0?: import("io-gui").IoElementArgs | import("io-gui").VDOMArray[], arg1?: import("io-gui").VDOMArray[]) => import("io-gui").VDOMArray;
//# sourceMappingURL=io-option-menu.d.ts.map