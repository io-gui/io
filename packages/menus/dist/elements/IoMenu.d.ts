import { ReactiveElement, VDOMElement, NudgeDirection, ReactiveElementProps, WithBinding, ListenerDefinition } from '@io-gui/core';
import { Option } from '../models/Option.js';
import { Menu } from '../models/Menu.js';
import { IoOption } from './IoOption.js';
import { IoContextMenu } from './IoContextMenu.js';
export type IoMenuProps = ReactiveElementProps & {
    model?: Menu | Option;
    expanded?: WithBinding<boolean>;
    horizontal?: boolean;
    searchable?: boolean;
    search?: WithBinding<string>;
    direction?: NudgeDirection;
    depth?: number;
    widget?: VDOMElement | null;
    $parent?: IoOption | IoContextMenu;
};
/**
 * The view paired with an expanded selection scope: it renders a list of `IoOption` elements from
 * its model's `options`. The model is the `Menu` root or the branch `Option` whose children it shows.
 * If the `horizontal` property is set, options are displayed in a horizontal direction (menu bar).
 **/
export declare class IoMenu extends ReactiveElement {
    static get Style(): string;
    model: Menu | Option;
    expanded: boolean;
    horizontal: boolean;
    searchable: boolean;
    search: string;
    direction: NudgeDirection;
    depth: number;
    overflow: string;
    widget: VDOMElement | null;
    $parent?: IoOption;
    role: string;
    static get Listeners(): {
        touchstart: ListenerDefinition;
        'io-focus-to': string;
    };
    get inoverlay(): boolean;
    constructor(args?: IoMenuProps);
    stopPropagation(event: TouchEvent): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    onIoFocusTo(event: CustomEvent): void;
    collapse(): void;
    expandedChanged(): void;
    searchChanged(): void;
    onExpandInOverlay(): void;
    focusFirstOption(): void;
    mutated(): void;
}
export declare const ioMenu: (arg0?: IoMenuProps) => VDOMElement;
