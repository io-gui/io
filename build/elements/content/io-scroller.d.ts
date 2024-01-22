import { IoElement } from '../../core/element.js';
import { MenuOptions } from '../menus/models/menu-options.js';
export declare class IoScroller extends IoElement {
    static get Style(): string;
    options: MenuOptions;
    private _observer;
    init(): void;
    connectedCallback(): void;
    _domMutated(): void;
    optionsMutated(): void;
    _scrollToSelected(): void;
    dispose(): void;
}
//# sourceMappingURL=io-scroller.d.ts.map