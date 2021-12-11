import './color-swatch.js';
declare const IoColorPicker_base: {
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
export declare class IoColorPicker extends IoColorPicker_base {
    static get Style(): string;
    static get Properties(): any;
    static get Listeners(): {
        click: string;
        keydown: string;
    };
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