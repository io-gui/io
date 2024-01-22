import { IoElement } from '../../core/element.js';
export declare class IoColorBase extends IoElement {
    value: {
        r: number;
        g: number;
        b: number;
        a?: number;
    };
    rgba: [number, number, number, number];
    hsv: [number, number, number];
    hsl: [number, number, number];
    cmyk: [number, number, number, number];
    init(): void;
    valueMutated(): void;
    rgbFromHsv(): void;
    rgbFromHsl(): void;
    rgbFromCmyk(): void;
    valueFromRgb(): void;
    valueChanged(): void;
}
//# sourceMappingURL=io-color-base.d.ts.map