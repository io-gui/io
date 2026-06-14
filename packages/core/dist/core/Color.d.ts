/**
 * RGBA color with normalized channel values in the 0–1 range.
 *
 * Colors serialize to a packed 32-bit hex integer via {@link Color.toJSON} and
 * {@link Color.toHex}. Use {@link Color.applyJSON} or the constructor to hydrate
 * from wire format. For CSS output, use {@link Color.toCss}.
 *
 * @example
 * ```ts
 * const c = new Color(1, 0, 0, 0.5)
 * c.toCss() // 'rgba(255, 0, 0, 0.5)'
 * ```
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