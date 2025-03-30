import { IoElement } from 'io-gui';
export declare class IoColorBase extends IoElement {
    reactivity: string;
    value: {
        r: number;
        g: number;
        b: number;
        a?: number;
    };
    rgba: [number, number, number, number];
    hsv: [number, number, number];
    hsl: [number, number, number];
    init(): void;
    valueMutated(): void;
    rgbFromHsv(): void;
    rgbFromHsl(): void;
    valueFromRgb(): void;
    valueChanged(): void;
}
//# sourceMappingURL=io-color-base.d.ts.map