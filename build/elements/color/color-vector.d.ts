import { IoElement } from '../../core/element.js';
import './color-picker.js';
declare const IoColorVector_base: {
    new (...args: any[]): {
        [x: string]: any;
        valueMutated(): void;
        modeChanged(): void;
        valueFromRgb(): void;
        valueFromHsv(): void;
        valueFromHsl(): void;
        valueFromCmyk(): void;
        valueChanged(): void;
    };
    readonly Properties: any;
    readonly GlUtils: string;
} & typeof IoElement;
export declare class IoColorVector extends IoColorVector_base {
    static get Style(): string;
    static get Properties(): any;
    _onValueSet(event: CustomEvent): void;
    changed(): void;
    getSlotted(): (string | {
        id: string;
        mode: any;
        value: any;
    })[];
}
export {};
//# sourceMappingURL=color-vector.d.ts.map