declare type Constructor<T extends any> = new (...args: any[]) => T;
export declare function IoColorMixin<T extends Constructor<any>>(superclass: T): {
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
export {};
//# sourceMappingURL=color.d.ts.map