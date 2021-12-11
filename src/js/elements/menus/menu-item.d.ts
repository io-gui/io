import { IoItem } from '../core/item.js';
export declare class IoMenuItem extends IoItem {
    static get Style(): string;
    static get Properties(): any;
    static get Listeners(): any;
    preventDefault(event: Event): void;
    get hasmore(): any;
    get inlayer(): any;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _onClick(): void;
    _onItemClicked(event: PointerEvent): void;
    _onPointerdown(event: PointerEvent): void;
    _onPointermove(event: PointerEvent): void;
    _gethovered(event: PointerEvent): any;
    _expandHovered(): void;
    _onLayerPointermove(event: PointerEvent): void;
    _onLayerPointerup(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    _onKeydown(event: KeyboardEvent): void;
    _collapse(): void;
    _collapseRoot(): void;
    expandedChanged(): void;
    optionChanged(change: CustomEvent): void;
    onOptionChanged(): void;
    changed(): void;
}
export declare function getElementDescendants(element: IoMenuItem): any;
//# sourceMappingURL=menu-item.d.ts.map