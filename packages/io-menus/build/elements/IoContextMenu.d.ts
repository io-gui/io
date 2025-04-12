import { IoElement, IoElementArgs, VDOMElement, ArgsWithBinding } from 'io-gui';
import { MenuOptions } from '../nodes/MenuOptions.js';
export type IoContextMenuArgs = IoElementArgs & ArgsWithBinding<{
    options?: MenuOptions;
    expanded?: boolean;
    button?: number;
}>;
/**
 * An invisible element that inserts a floating menu when its `parentElement` is clicked. Menu position is set by the pointer by default but it can be configured to expand to the side of the parent element by setting the `position` property. Default `button` property for menu expansion is `0` (left mouse button), but it can be configured for other buttons. You can have multiple `IoContextMenu` instances under the same `parentElement` as long as the `button` properties are different.
 **/
export declare class IoContextMenu extends IoElement {
    static vConstructor: (arg0?: IoContextMenuArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    options: MenuOptions;
    expanded: boolean;
    button: number;
    static get Properties(): any;
    constructor(args?: IoContextMenuArgs);
    connectedCallback(): void;
    disconnectedCallback(): void;
    getBoundingClientRect(): any;
    _onItemClicked(event: CustomEvent): void;
    onContextmenu(event: MouseEvent): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    _onOverlayPointermove(event: PointerEvent): void;
    _onClick(event: MouseEvent): void;
    _onCollapse(): void;
    optionsChanged(): void;
}
export declare const ioContextMenu: (arg0?: IoContextMenuArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoContextMenu.d.ts.map