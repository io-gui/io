import { IoElement } from '../../core/element.js';
export declare class IoLayoutBlock extends IoElement {
    static get Style(): string;
    static get Properties(): any;
    static get Listeners(): {
        'layout-tabs-add': string;
        'layout-tabs-remove': string;
        'layout-tab-select': string;
    };
    changed(): void;
    _onTabSelect(event: CustomEvent): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _onTabDragStart(): void;
    _onTabDrag(event: CustomEvent): void;
    _onTabDragEnd(event: CustomEvent): void;
    setDropTarget(target: any): void;
}
//# sourceMappingURL=_layout-block.d.ts.map