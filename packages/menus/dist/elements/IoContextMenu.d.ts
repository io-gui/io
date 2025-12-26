import { IoElement, IoElementProps, WithBinding } from 'io-core';
import { IoMenuOptions } from './IoMenuOptions.js';
import { MenuOption } from '../nodes/MenuOption.js';
export type IoContextMenuProps = IoElementProps & {
    option: MenuOption;
    expanded?: WithBinding<boolean>;
    button?: number;
};
/**
 * An invisible element that inserts a floating menu when its `parentElement` is clicked. Menu position is set by the pointer by default but it can be configured to expand to the side of the parent element by setting the `position` property. Default `button` property for menu expansion is `0` (left mouse button), but it can be configured for other buttons. You can have multiple `IoContextMenu` instances under the same `parentElement` as long as the `button` properties are different.
 **/
export declare class IoContextMenu extends IoElement {
    option: MenuOption;
    expanded: boolean;
    button: number;
    $options: IoMenuOptions;
    _contextTimeout: number;
    static get ReactiveProperties(): any;
    constructor(args: IoContextMenuProps);
    init(): void;
    optionChanged(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    getBoundingClientRect(): DOMRect;
    onContextmenu(event: MouseEvent): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    onPointerleave(event: PointerEvent): void;
    collapse(): void;
}
export declare const ioContextMenu: (arg0?: IoContextMenuProps) => import("io-core").VDOMElement;
//# sourceMappingURL=IoContextMenu.d.ts.map