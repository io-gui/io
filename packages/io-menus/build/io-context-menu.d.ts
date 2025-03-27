import { IoElement } from 'io-gui';
import { MenuOptions } from './models/menu-options.js';
/**
 * An invisible element that inserts a floating menu when its `parentElement` is clicked. Menu position is set by the pointer by default but it can be configured to expand to the side of the parent element by setting the `position` property. Default `button` property for menu expansion is `0` (left mouse button), but it can be configured for other buttons. You can have multiple `IoContextMenu` instances under the same `parentElement` as long as the `button` properties are different.
 **/
export declare class IoContextMenu extends IoElement {
    options: MenuOptions;
    expanded: boolean;
    button: number;
    static get Properties(): any;
    connectedCallback(): void;
    disconnectedCallback(): void;
    getBoundingClientRect(): any;
    _onItemClicked(event: CustomEvent): void;
    _onContextmenu(event: MouseEvent): void;
    _onPointerdown(event: PointerEvent): void;
    _onPointermove(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    _onOverlayPointermove(event: PointerEvent): void;
    _onClick(event: MouseEvent): void;
    _onCollapse(): void;
    optionsChanged(): void;
}
//# sourceMappingURL=io-context-menu.d.ts.map