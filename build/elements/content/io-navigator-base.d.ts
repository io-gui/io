import { IoElement, VDOMArray } from '../../core/element.js';
import { MenuOptions } from '../menus/models/menu-options.js';
export declare class IoNavigatorBase extends IoElement {
    static get Style(): string;
    slotted: VDOMArray[];
    elements: VDOMArray[];
    options: MenuOptions;
    menu: 'top' | 'left' | 'bottom' | 'right';
    depth: number;
    collapsed: boolean;
    collapseWidth: number;
    init(): void;
    onResized(): void;
    _computeCollapsed(): void;
    getSlotted(): VDOMArray | null;
    changed(): void;
}
//# sourceMappingURL=io-navigator-base.d.ts.map