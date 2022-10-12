import { IoSlider } from '../sliders/slider.js';
declare const IoColorSlider_base: {
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
} & typeof IoSlider;
export declare class IoColorSlider extends IoColorSlider_base {
    static get Properties(): any;
    static get GlUtils(): string;
    valueMutated(): void;
    deprecated_applyAria(): void;
    _onKeydown(event: KeyboardEvent): void;
    _setIncrease(): void;
    _setDecrease(): void;
    _setMin(): void;
    _setMax(): void;
    _onPointermoveThrottled(event: PointerEvent): void;
    _notifyValueInput(): void;
    _inputValue(x: number, y?: number): void;
}
export {};
//# sourceMappingURL=color-slider.d.ts.map