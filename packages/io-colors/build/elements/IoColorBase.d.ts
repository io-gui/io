import { IoElement, IoElementProps, VDOMElement, PropsWithBinding } from 'io-gui';
export type IoColorBaseProps = IoElementProps & PropsWithBinding<{
    value?: {
        r: number;
        g: number;
        b: number;
        a?: number;
    };
}>;
export declare class IoColorBase extends IoElement {
    static vConstructor: (arg0?: IoColorBaseProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
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
//# sourceMappingURL=IoColorBase.d.ts.map