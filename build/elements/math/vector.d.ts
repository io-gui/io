import { IoElement } from '../../iogui.js';
export declare class IoVector extends IoElement {
    static get Style(): string;
    static get Properties(): any;
    _onValueSet(event: CustomEvent): void;
    valueChanged(): void;
    changed(): void;
    getSlotted(): (string | {
        value: import("../../iogui.js").Binding;
        true: string;
        false: string;
    })[] | null;
}
//# sourceMappingURL=vector.d.ts.map