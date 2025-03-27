import { IoElement, VDOMArray, NudgeDirection } from 'io-gui';
import { MenuOptions } from './models/menu-options.js';
import { IoMenuItem } from './io-menu-item.js';
/**
 * It generates a list of `IoMenuItem` elements from `options` property. If `horizontal` property is set, menu items are displayed in horizontal direction.
 **/
export declare class IoMenuOptions extends IoElement {
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
    slotted: VDOMArray[];
    role: string;
    $parent?: IoMenuItem;
    private _overflownItems;
    static get Listeners(): {
        'item-clicked': string;
        touchstart: (string | {
            passive: boolean;
        })[];
    };
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
//# sourceMappingURL=io-menu-options.d.ts.map