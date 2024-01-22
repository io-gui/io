import { IoElement, VDOMArray } from '../../core/element.js';
import { MenuOptions } from '../menus/models/menu-options.js';
import './io-selector.js';
export declare class IoNavigator extends IoElement {
    static get Style(): string;
    slotted: VDOMArray[];
    elements: VDOMArray[];
    options: MenuOptions;
    menu: 'top' | 'left' | 'bottom' | 'right';
    select: 'first' | 'last';
    mode: 'select' | 'scroll';
    depth: number;
    cache: boolean;
    precache: boolean;
    collapsed: boolean;
    collapseWidth: number;
    init(): void;
    onResized(): void;
    _computeCollapsed(): void;
    changed(): void;
}
//# sourceMappingURL=io-navigator.d.ts.map