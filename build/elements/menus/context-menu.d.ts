import { IoElement } from '../../core/io-element.js';
export declare class IoContextMenu extends IoElement {
    static get Properties(): any;
    connectedCallback(): void;
    disconnectedCallback(): void;
    getBoundingClientRect(): any;
    _onItemClicked(event: CustomEvent): void;
    _onContextmenu(event: MouseEvent): void;
    _onPointerdown(event: PointerEvent): void;
    _onPointermove(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    _onLayerPointermove(event: PointerEvent): void;
    _onClick(event: MouseEvent): void;
    _collapse(): void;
    expandedChanged(): void;
}
//# sourceMappingURL=context-menu.d.ts.map