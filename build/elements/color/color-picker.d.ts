import { IoField } from '../basic/field.js';
import './color-swatch.js';
declare const IoColorPicker_base: {
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
} & typeof IoField;
export declare class IoColorPicker extends IoColorPicker_base {
    static get Style(): string;
    static get Properties(): any;
    static get Listeners(): any;
    _onClick(): void;
    get expanded(): any;
    _onKeydown(event: KeyboardEvent): void;
    _onValueSet(): void;
    toggle(): void;
    expand(): void;
    collapse(): void;
    changed(): void;
}
export {};
//# sourceMappingURL=color-picker.d.ts.map