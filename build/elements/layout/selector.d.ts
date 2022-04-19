import { IoElement } from '../../iogui.js';
export declare class IoSelector extends IoElement {
    static get Style(): string;
    static get Properties(): any;
    static get Listeners(): {
        scroll: (string | {
            capture: boolean;
            passive: boolean;
        })[];
        'content-ready': string;
    };
    constructor(props?: any);
    _selectDefault(): void;
    _onIoContentReady(event: CustomEvent): void;
    connectedCallback(): void;
    scrollTo(id: string, smooth?: boolean): void;
    _onScroll(): void;
    selectedChanged(): void;
    optionsChanged(): void;
    elementsChanged(): void;
    updateScroll(): void;
    getSlotted(): any;
    update(): void;
}
//# sourceMappingURL=selector.d.ts.map