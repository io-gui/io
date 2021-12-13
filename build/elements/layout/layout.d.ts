import { IoElement } from '../../core/io-element.js';
export declare class IoLayout extends IoElement {
    static get Style(): string;
    static get Properties(): any;
    static get Listeners(): {
        'io-layout-divider-move': string;
        'io-layout-tab-insert': string;
    };
    _onSelectedChanged(): void;
    changed(): void;
    _onLayoutTabInsert(event: CustomEvent): void;
    _onDividerMove(event: CustomEvent): void;
}
export declare class IoLayoutDivider extends IoElement {
    static get Style(): string;
    static get Properties(): any;
    static get Listeners(): {
        pointermove: string;
    };
    _onPointermove(event: PointerEvent): void;
    changed(): void;
}
//# sourceMappingURL=layout.d.ts.map