import { IoElement } from '../../core/element.js';
import '../content/io-selector.js';
export declare class IoSelectorTabs extends IoElement {
    static get Style(): string;
    static get Properties(): any;
    elementsChanged(): void;
    editableChanged(): void;
    selectedChanged(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    connectDragListeners(): void;
    disconnectDragListeners(): void;
    _onDrag(event: CustomEvent): void;
    _onDragEnd(event: CustomEvent): void;
    changed(): void;
}
export declare class IoTabs extends IoElement {
    static get Style(): string;
    static get Properties(): any;
    select(id: string): void;
    onResized(): void;
    _onAddTab(tabID: string): void;
    _onRemoveTab(tabID: string): void;
    _onPointerdown(event: PointerEvent): void;
    _onPointermove(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    changed(): void;
}
export declare class IoTabDragicon extends IoElement {
    static get Style(): string;
}
export declare class IoTabDropzone extends IoElement {
    static get Style(): string;
}
//# sourceMappingURL=_io-tabbed-elements.d.ts.map