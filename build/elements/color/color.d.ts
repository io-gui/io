declare type Constructor<T> = new (...args: any[]) => T;
export declare function IoColorMixin<T extends Constructor<any>>(superclass: T): {
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
} & T;
export {};
//# sourceMappingURL=color.d.ts.map