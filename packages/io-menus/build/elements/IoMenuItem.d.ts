import { VDOMElement, PropsWithBinding, NudgeDirection } from 'io-gui';
import { MenuItem } from '../nodes/MenuItem.js';
import { IoMenuOptions } from './IoMenuOptions.js';
import { IoField, IoFieldProps } from 'io-inputs';
export type IoMenuItemProps = IoFieldProps & PropsWithBinding<{
    item?: MenuItem;
    expanded?: boolean;
    direction?: 'left' | 'right' | 'up' | 'down';
    depth?: number;
}>;
/**
 * It displays `option.icon`, `option.label` and `option.hint` property and it creates expandable `IoMenuOptions` from the `option.options` array. Options are expand in the direction specified by `direction` property. If `selectable` property is set, selecting an option sets its `value` to the entire menu tree and `selected` atribute is set on menu items whose `option.value` matches selected value.
 **/
export declare class IoMenuItem extends IoField {
    static vConstructor: (arg0?: IoMenuItemProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    item: MenuItem;
    expanded: boolean;
    direction: NudgeDirection;
    depth: number;
    contentEditable: boolean;
    $options?: IoMenuOptions;
    static get Listeners(): any;
    constructor(args?: IoMenuItemProps);
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
    onPointerdown(event: PointerEvent): void;
    onPointerdownAction(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointermoveAction(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    onPointerupAction(event: PointerEvent, skipCollapse?: boolean): void;
    _gethovered(event: PointerEvent): IoMenuElementType | undefined;
    _expandHovered(): void;
    onKeydown(event: KeyboardEvent): void;
    _onCollapse(): void;
    _onCollapseRoot(): void;
    expandedChanged(): void;
    itemChanged(): void;
    itemMutated(): void;
    changed(): void;
}
export declare const ioMenuItem: (arg0?: IoMenuItemProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
type IoMenuElementType = IoMenuItem | IoMenuOptions;
export declare function getMenuDescendants(element: IoMenuElementType): IoMenuElementType[];
export declare function getMenuAncestors(element: IoMenuElementType): (IoMenuItem | IoMenuOptions)[];
export declare function getMenuRoot(element: IoMenuElementType): IoMenuElementType;
export {};
//# sourceMappingURL=IoMenuItem.d.ts.map