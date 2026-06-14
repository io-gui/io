export declare class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: number, g: number, b: number, a?: number);
    applyJSON(hex: number): Color;
    toHex(): number;
    static toHex(r: number, g: number, b: number, a?: number): number;
    toJSON(): number;
    toCss(): string;
}
//# sourceMappingURL=Color.d.ts.map