import { IoGl } from '../../core/gl.js';
declare const IoColorSwatch_base: {
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
} & typeof IoGl;
export declare class IoColorSwatch extends IoColorSwatch_base {
    static get Style(): string;
    static get Frag(): string;
}
export {};
//# sourceMappingURL=color-swatch.d.ts.map