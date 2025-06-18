import { IoElement, VDOMElement, NudgeDirection, IoElementProps, WithBinding } from 'io-gui';
import { MenuOptions } from '../nodes/MenuOptions.js';
import { IoMenuItem } from './IoMenuItem.js';
import { IoContextMenu } from './IoContextMenu.js';
export type IoMenuOptionsProps = IoElementProps & {
    options?: WithBinding<MenuOptions>;
    expanded?: WithBinding<boolean>;
    horizontal?: boolean;
    searchable?: boolean;
    search?: WithBinding<string>;
    direction?: NudgeDirection;
    depth?: number;
    noPartialCollapse?: boolean;
    widget?: VDOMElement | null;
    $parent?: IoMenuItem | IoContextMenu;
};
/**
 * It generates a list of `IoMenuItem` elements from `options` property. If `horizontal` property is set, menu items are displayed in horizontal direction.
 **/
export declare class IoMenuOptions extends IoElement {
    static vConstructor: (arg0?: IoMenuOptionsProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    options: MenuOptions;
    expanded: boolean;
    horizontal: boolean;
    searchable: boolean;
    search: string;
    direction: NudgeDirection;
    depth: number;
    noPartialCollapse: boolean;
    overflow: string;
    widget: VDOMElement | null;
    $parent?: IoMenuItem;
    role: string;
    private _overflownItems;
    static get Listeners(): {
        touchstart: (string | {
            passive: boolean;
        })[];
        'io-focus-to': string;
    };
    get inoverlay(): any;
    constructor(args?: IoMenuOptionsProps);
    init(): void;
    ready(): void;
    stopPropagation(event: MouseEvent): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    onIoFocusTo(event: CustomEvent): void;
    onResized(): void;
    setOverflow(): void;
    collapse(): void;
    expandedChanged(): void;
    searchChanged(): void;
    onExpandInOverlay(): void;
    changed(): void;
}
export declare const ioMenuOptions: (arg0?: IoMenuOptionsProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoMenuOptions.d.ts.map