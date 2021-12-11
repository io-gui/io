declare const IoColorSwatch_base: {
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
export declare class IoColorSwatch extends IoColorSwatch_base {
    static get Style(): string;
    static get Frag(): string;
}
export {};
//# sourceMappingURL=color-swatch.d.ts.map