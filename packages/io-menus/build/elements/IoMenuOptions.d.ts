import { IoElement, VDOMElement, NudgeDirection, IoElementArgs, ArgsWithBinding } from 'io-gui';
import { MenuOptions } from '../nodes/MenuOptions.js';
import { IoMenuItem } from './IoMenuItem.js';
import { IoContextMenu } from './IoContextMenu.js';
export type IoMenuOptionsArgs = IoElementArgs & ArgsWithBinding<{
    options?: MenuOptions;
    expanded?: boolean;
    horizontal?: boolean;
    searchable?: boolean;
    search?: string;
    direction?: NudgeDirection;
    depth?: number;
    noPartialCollapse?: boolean;
    inlayer?: boolean;
    slotted?: VDOMElement[];
    $parent?: IoMenuItem | IoContextMenu;
}>;
/**
 * It generates a list of `IoMenuItem` elements from `options` property. If `horizontal` property is set, menu items are displayed in horizontal direction.
 **/
export declare class IoMenuOptions extends IoElement {
    static vConstructor: (arg0?: IoMenuOptionsArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
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
    inlayer: boolean;
    slotted: VDOMElement[];
    role: string;
    $parent?: IoMenuItem;
    private _overflownItems;
    static get Listeners(): {
        'item-clicked': string;
        touchstart: (string | {
            passive: boolean;
        })[];
    };
    constructor(args?: IoMenuOptionsArgs);
    _onItemClicked(event: CustomEvent): void;
    _stopPropagation(event: MouseEvent): void;
    init(): void;
    onResized(): void;
    _onSetOverflow(): void;
    _onCollapse(): void;
    expandedChanged(): void;
    searchChanged(): void;
    _onExpandInOverlay(): void;
    _onClipHeight(): void;
    changed(): void;
}
export declare const ioMenuOptions: (arg0?: IoMenuOptionsArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoMenuOptions.d.ts.map