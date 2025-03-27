import { IoElement } from 'io-gui';
import { MenuOptions } from 'io-menus';
export declare class IoScroller extends IoElement {
    static get Style(): string;
    options: MenuOptions;
    private _observer;
    init(): void;
    connectedCallback(): void;
    _onDomMutated(): void;
    optionsMutated(): void;
    _scrollToSelected(): void;
    dispose(): void;
}
//# sourceMappingURL=io-scroller.d.ts.map