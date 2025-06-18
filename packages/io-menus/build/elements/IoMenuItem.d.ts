import { VDOMElement, WithBinding, NudgeDirection } from 'io-gui';
import { IoField, IoFieldProps } from 'io-inputs';
import { MenuItem } from '../nodes/MenuItem.js';
import { IoMenuOptions } from './IoMenuOptions.js';
import { IoMenuTree } from './IoMenuTree.js';
export declare function onOverlayPointerdown(event: PointerEvent): void;
export declare function onOverlayPointermove(event: PointerEvent): void;
export declare function onOverlayPointeup(event: PointerEvent): void;
export type IoMenuItemProps = IoFieldProps & {
    item?: MenuItem;
    label?: string;
    expanded?: WithBinding<boolean>;
    direction?: NudgeDirection;
    depth?: number;
    $parent?: IoMenuOptions | IoMenuTree;
};
/**
 * It displays `option.icon`, `option.label` and `option.hint` property and it creates expandable `IoMenuOptions` from the `option.options` array. Options are expand in the direction specified by `direction` property. If `selectable` property is set, selecting an option sets its `value` to the entire menu tree and `selected` atribute is set on menu items whose `option.value` matches selected value.
 **/
export declare class IoMenuItem extends IoField {
    static vConstructor: (arg0?: IoMenuItemProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    item: MenuItem;
    label: string;
    expanded: boolean;
    direction: NudgeDirection;
    depth: number;
    contentEditable: boolean;
    $parent?: IoMenuOptions | IoMenuTree;
    $options?: IoMenuOptions;
    static get Listeners(): any;
    constructor(args?: IoMenuItemProps);
    preventDefault(event: Event): void;
    get hasmore(): boolean;
    get inoverlay(): any;
    connectedCallback(): void;
    disconnectedCallback(): void;
    onClick(): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    onPointerupAction(event: PointerEvent): void;
    onFocus(event: FocusEvent): void;
    onBlur(event: FocusEvent): void;
    onBlurDebounced(): void;
    onKeydown(event: KeyboardEvent): void;
    collapse(): void;
    collapseRoot(): void;
    itemChanged(): void;
    itemMutated(): void;
    changed(): void;
    dispose(): void;
}
export declare const ioMenuItem: (arg0?: IoMenuItemProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoMenuItem.d.ts.map