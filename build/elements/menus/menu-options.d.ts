import { IoElement } from '../../core/element.js';
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
    _onSetOverflow(): void;
    _onCollapse(): void;
    expandedChanged(): void;
    searchChanged(): void;
    _onExpandedChangedLazy(): void;
    _clipHeight(): void;
    _filterOptions(object: any, predicate: (object: any) => boolean, _depth?: number, _chain?: any[], _i?: number): any;
    get _options(): any;
    changed(): void;
}
//# sourceMappingURL=menu-options.d.ts.map