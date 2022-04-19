import { IoElement } from '../../iogui.js';
export declare class IoMenuOptions extends IoElement {
    static get Style(): string;
    static get Properties(): any;
    static get Listeners(): {
        'item-clicked': string;
        touchstart: string;
    };
    connectedCallback(): void;
    _onItemClicked(event: CustomEvent): void;
    _stopPropagation(event: MouseEvent): void;
    onResized(): void;
    _setOverflow(): void;
    _collapse(): void;
    expandedChanged(): void;
    searchChanged(): void;
    _expandedChangedLazy(): void;
    _clipHeight(): void;
    get _options(): any;
    changed(): void;
}
//# sourceMappingURL=menu-options.d.ts.map