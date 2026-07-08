import { ReactiveElement, VDOMElement, ReactiveElementProps, WithBinding } from '@io-gui/core';
import { Menu, Option } from '@io-gui/menus';
import { CachingType } from './IoSelector.js';
export type SelectType = 'shallow' | 'deep' | 'all' | 'none';
export type MenuPosition = 'top' | 'left' | 'none';
export type IoNavigatorProps = ReactiveElementProps & {
    model?: Menu | Option;
    elements?: VDOMElement[];
    widget?: VDOMElement;
    menu?: MenuPosition;
    depth?: number;
    select?: SelectType;
    caching?: CachingType;
    anchor?: WithBinding<string>;
    minWidth?: number;
};
export declare class IoNavigator extends ReactiveElement {
    static get Style(): string;
    elements: VDOMElement[];
    model: Menu | Option;
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
    modelMutated(): void;
    mutated(): void;
}
export declare const ioNavigator: (arg0?: IoNavigatorProps) => VDOMElement;
