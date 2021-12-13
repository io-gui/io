import { IoElement } from '../../core/io-element.js';
export declare class IoVector extends IoElement {
    static get Style(): string;
    static get Properties(): any;
    _onValueSet(event: CustomEvent): void;
    valueChanged(): void;
    changed(): void;
    getSlotted(): (string | {
        value: import("../../core/internals/propertyBinder.js").Binding;
        true: string;
        false: string;
    })[] | null;
}
//# sourceMappingURL=vector.d.ts.map