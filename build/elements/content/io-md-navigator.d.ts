import { IoElement, VDOMArray } from '../../core/element.js';
import { MenuOptions } from '../menus/models/menu-options.js';
import './io-selector.js';
export declare class IoMdNavigator extends IoElement {
    static get Style(): string;
    slotted: VDOMArray[];
    options: MenuOptions;
    menu: 'none' | 'top' | 'left' | 'bottom' | 'right';
    depth: number;
    collapsed: boolean;
    collapseWidth: number;
    onResized(): void;
    changed(): void;
}
//# sourceMappingURL=io-md-navigator.d.ts.map