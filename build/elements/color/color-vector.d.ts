import './color-picker.js';
declare const IoColorVector_base: {
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
export declare class IoColorVector extends IoColorVector_base {
    static get Style(): string;
    static get Properties(): any;
    _onValueSet(event: CustomEvent): void;
    changed(): void;
    getSlotted(): (string | {
        id: string;
        mode: any;
        value: any;
    })[];
}
export {};
//# sourceMappingURL=color-vector.d.ts.map