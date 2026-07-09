import { ReactiveElement, ReactiveElementProps, WithBinding } from '@io-gui/core';
export type IoColorBaseProps = ReactiveElementProps & {
    value?: WithBinding<{
        r: number;
        g: number;
        b: number;
        a?: number;
    }>;
};
export declare class IoColorBase extends ReactiveElement {
    value: {
        r: number;
        g: number;
        b: number;
        a?: number;
    };
    rgba: [number, number, number, number];
    hsv: [number, number, number];
    hsl: [number, number, number];
    ready(): void;
    valueMutated(): void;
    rgbFromHsv(): void;
    rgbFromHsl(): void;
    valueFromRgb(): void;
    valueChanged(): void;
}
