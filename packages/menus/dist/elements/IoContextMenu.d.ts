import { ReactiveElement, ReactiveElementProps, WithBinding } from '@io-gui/core';
import { IoMenu } from './IoMenu.js';
import { Menu } from '../models/Menu.js';
export type IoContextMenuProps = ReactiveElementProps & {
    model: Menu;
    expanded?: WithBinding<boolean>;
    button?: number;
};
/**
 * An invisible element that inserts a floating menu when its `parentElement` is clicked.
 * Menu position is set by the pointer by default but it can be configured to expand to the side of the parent element
 * by setting the `position` property. Default `button` property for menu expansion is `0` (left mouse button),
 * but it can be configured for other buttons. You can have multiple `IoContextMenu` instances under the same
 * `parentElement` as long as the `button` properties are different.
 **/
export declare class IoContextMenu extends ReactiveElement {
    model: Menu;
    expanded: boolean;
    button: number;
    $menu: IoMenu;
    _contextTimeout: ReturnType<typeof setTimeout>;
    _listenerParent: HTMLElement | null;
    static get Properties(): any;
    constructor(args: IoContextMenuProps);
    init(): void;
    modelChanged(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    releasePointerListeners(): void;
    getBoundingClientRect(): DOMRect;
    onContextmenu(event: MouseEvent): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    onPointerleave(event: PointerEvent): void;
    collapse(): void;
}
export declare const ioContextMenu: (arg0?: IoContextMenuProps) => import("@io-gui/core").VDOMElement;
