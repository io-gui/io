import { WithBinding, NudgeDirection, ListenerDefinitions } from '@io-gui/core';
import { IoField, IoFieldProps } from '@io-gui/inputs';
import { Option } from '../models/Option.js';
import { IoMenu } from './IoMenu.js';
import { IoMenuTree } from './IoMenuTree.js';
export declare function onOverlayPointerdown(event: PointerEvent): void;
export declare function onOverlayPointermove(event: PointerEvent): void;
export declare function onOverlayPointeup(event: PointerEvent): void;
export type IoOptionProps = IoFieldProps & {
    model?: Option;
    label?: string;
    expanded?: WithBinding<boolean>;
    direction?: NudgeDirection;
    depth?: number;
    $parent?: IoMenu | IoMenuTree;
};
/**
 * The view paired with one `Option` model. It displays `model.icon`, `model.label` and `model.hint`
 * and creates an expandable `IoMenu` from the `model.options` array. Options expand in the direction
 * specified by the `direction` property. Activating an option dispatches `io-option-clicked` from the
 * menu root element — the single public menus event; selection state is observed via model properties.
 **/
export declare class IoOption extends IoField {
    static get Style(): string;
    model: Option;
    label: string;
    expanded: boolean;
    direction: NudgeDirection;
    depth: number;
    contentEditable: string;
    $parent?: IoMenu | IoMenuTree;
    $menu?: IoMenu;
    static get Listeners(): ListenerDefinitions;
    constructor(args?: IoOptionProps);
    preventDefault(event: Event): void;
    get hasmore(): boolean | 0;
    get inoverlay(): boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
    onClick(): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    onFocus(event: FocusEvent): void;
    onTouchend(event: TouchEvent): void;
    onBlur(event: FocusEvent): void;
    onBlurDebounced(): void;
    onKeydown(event: KeyboardEvent): void;
    collapse(): void;
    collapseRoot(): void;
    modelChanged(): void;
    modelMutated(): void;
    initMenu(): void;
    mutated(): void;
    dispose(): void;
}
export declare const ioOption: (arg0?: IoOptionProps) => import("@io-gui/core").VDOMElement;
