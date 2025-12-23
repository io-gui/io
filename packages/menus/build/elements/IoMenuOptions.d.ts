import { IoElement, VDOMElement, NudgeDirection, IoElementProps, WithBinding, ListenerDefinition } from 'io-core';
import { MenuOption } from '../nodes/MenuOption.js';
import { IoMenuItem } from './IoMenuItem.js';
import { IoContextMenu } from './IoContextMenu.js';
export type IoMenuOptionsProps = IoElementProps & {
    option?: MenuOption;
    expanded?: WithBinding<boolean>;
    horizontal?: boolean;
    searchable?: boolean;
    search?: WithBinding<string>;
    direction?: NudgeDirection;
    depth?: number;
    widget?: VDOMElement | null;
    $parent?: IoMenuItem | IoContextMenu;
};
/**
 * It generates a list of `IoMenuItem` elements from `options` property. If `horizontal` property is set, menu options are displayed in horizontal direction.
 **/
export declare class IoMenuOptions extends IoElement {
    static get Style(): string;
    option: MenuOption;
    expanded: boolean;
    horizontal: boolean;
    searchable: boolean;
    search: string;
    direction: NudgeDirection;
    depth: number;
    overflow: string;
    widget: VDOMElement | null;
    $parent?: IoMenuItem;
    role: string;
    static get Listeners(): {
        touchstart: ListenerDefinition;
        'io-focus-to': string;
    };
    get inoverlay(): boolean;
    constructor(args?: IoMenuOptionsProps);
    stopPropagation(event: TouchEvent): void;
    connectedCallback(): void;
    onIoFocusTo(event: CustomEvent): void;
    collapse(): void;
    expandedChanged(): void;
    searchChanged(): void;
    onExpandInOverlay(): void;
    changed(): void;
}
export declare const ioMenuOptions: (arg0?: IoMenuOptionsProps) => VDOMElement;
//# sourceMappingURL=IoMenuOptions.d.ts.map