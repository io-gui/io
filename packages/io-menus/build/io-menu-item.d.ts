import { IoField } from 'io-gui';
import { MenuItem } from './models/menu-item.js';
import { IoMenuOptions } from './io-menu-options.js';
/**
 * It displays `option.icon`, `option.label` and `option.hint` property and it creates expandable `IoMenuOptions` from the `option.options` array. Options are expand in the direction specified by `direction` property. If `selectable` property is set, selecting an option sets its `value` to the entire menu tree and `selected` atribute is set on menu items whose `option.value` matches selected value.
 **/
export declare class IoMenuItem extends IoField {
    static get Style(): string;
    item: MenuItem;
    expanded: boolean;
    direction: string;
    depth: number;
    $options?: IoMenuOptions;
    static get Listeners(): any;
    preventDefault(event: Event): void;
    get hasmore(): boolean;
    get inlayer(): boolean;
    get $parent(): any;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _onOverlayPointermove(event: PointerEvent): void;
    _onOverlayPointerup(event: PointerEvent): void;
    _onClick(): void;
    _onItemClicked(event: PointerEvent): void;
    _onPointerdown(event: PointerEvent): void;
    _onPointerdownAction(event: PointerEvent): void;
    _onPointermove(event: PointerEvent): void;
    _onPointermoveAction(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    _onPointerupAction(event: PointerEvent, skipCollapse?: boolean): void;
    _gethovered(event: PointerEvent): IoMenuElementType | undefined;
    _expandHovered(): void;
    _onKeydown(event: KeyboardEvent): void;
    _onCollapse(): void;
    _onCollapseRoot(): void;
    expandedChanged(): void;
    itemChanged(): void;
    changed(): void;
}
type IoMenuElementType = IoMenuItem | IoMenuOptions;
export declare function getMenuDescendants(element: IoMenuElementType): IoMenuElementType[];
export declare function getMenuAncestors(element: IoMenuElementType): (IoMenuItem | IoMenuOptions)[];
export declare function getMenuRoot(element: IoMenuElementType): IoMenuElementType;
export {};
//# sourceMappingURL=io-menu-item.d.ts.map