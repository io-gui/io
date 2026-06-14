/**
 * RGBA color with normalized 0–1 channels. Wire format: packed hex via {@link toJSON}/{@link toHex}; CSS via {@link toCss}.
 */
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