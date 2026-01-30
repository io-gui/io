import { IoElement, VDOMElement, IoElementProps, WithBinding } from '@io-gui/core';
import { MenuOption } from '@io-gui/menus';
import { CachingType } from './IoSelector.js';
export type SelectType = 'shallow' | 'deep' | 'all' | 'none';
export type MenuPosition = 'top' | 'left';
export type IoNavigatorProps = IoElementProps & {
    option?: MenuOption;
    elements?: VDOMElement[];
    widget?: VDOMElement;
    menu?: MenuPosition;
    depth?: number;
    select?: SelectType;
    caching?: CachingType;
    anchor?: WithBinding<string>;
    minWidth?: number;
};
export declare class IoNavigator extends IoElement {
    static get Style(): string;
    elements: VDOMElement[];
    option: MenuOption;
    widget: VDOMElement | null;
    menu: MenuPosition;
    depth: number;
    select: SelectType;
    caching: CachingType;
    minWidth: number;
    anchor: string;
    collapsed: boolean;
    showVeil: boolean;
    static get Listeners(): {
        'io-drawer-expanded-changed': string;
    };
    onResized(): void;
    calculateCollapsedDebounced(): void;
    calculateCollapsed(): void;
    onDrawerExpandedChanged(event: CustomEvent): void;
    collapseDrawer(): void;
    onVeilClick(event: MouseEvent): void;
    collapsedChanged(): void;
    menuChanged(): void;
    optionMutated(): void;
    changed(): void;
}
export declare const ioNavigator: (arg0?: IoNavigatorProps) => VDOMElement;
//# sourceMappingURL=IoNavigator.d.ts.map