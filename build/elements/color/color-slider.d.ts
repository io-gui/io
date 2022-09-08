declare const IoColorSlider_base: {
    new (): {
        [x: string]: any;
        valueMutated(): void;
        modeChanged(): void;
        setValueFromRgb(): void;
        setValueFromHsv(): void;
        setValueFromHsl(): void;
        setValueFromCmyk(): void;
        valueChanged(): void;
    };
    [x: string]: any;
    readonly Properties: any;
    readonly GlUtils: string;
};
export declare class IoColorSlider extends IoColorSlider_base {
    static get Properties(): any;
    static get GlUtils(): string;
    valueMutated(): void;
    applyAria(): void;
    _onKeydown(event: KeyboardEvent): void;
    _setIncrease(): void;
    _setDecrease(): void;
    _setMin(): void;
    _setMax(): void;
    _onPointermoveThrottled(event: PointerEvent): void;
    _notifyValueChange(): void;
    _setValue(x: number, y?: number): void;
}
export {};
//# sourceMappingURL=color-slider.d.ts.map