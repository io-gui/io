import { ReactivePropertyDefinitions, Node } from '../nodes/Node';
export declare class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: number, g: number, b: number, a: number);
    toCss(): string;
}
export type ThemeVars = {
    spacing: number;
    spacing2: number;
    spacing3: number;
    spacing5: number;
    spacing8: number;
    fontSize: number;
    lineHeight: number;
    fieldHeight: number;
    fieldHeight2: number;
    fieldHeight3: number;
    fieldHeight4: number;
    fieldHeight5: number;
    fieldHeight6: number;
    fieldHeight7: number;
    fieldHeight8: number;
    fieldHeight9: number;
    fieldHeight10: number;
    fieldHeight11: number;
    fieldHeight12: number;
    borderRadius: number;
    borderRadius2: number;
    borderWidth: number;
    borderColor: Color;
    borderColorLight: Color;
    borderColorDark: Color;
    borderColorRed: Color;
    borderColorBlue: Color;
    borderColorGreen: Color;
    bgColor: Color;
    bgColorStrong: Color;
    bgColorDimmed: Color;
    bgColorRed: Color;
    bgColorGreen: Color;
    bgColorBlue: Color;
    bgColorInput: Color;
    color: Color;
    colorStrong: Color;
    colorDimmed: Color;
    colorRed: Color;
    colorGreen: Color;
    colorBlue: Color;
    colorWhite: Color;
    colorInput: Color;
    gradientColorStart: Color;
    gradientColorEnd: Color;
    shadowColor: Color;
};
export declare const LIGHT_THEME: ThemeVars;
export declare const DARK_THEME: ThemeVars;
/**
 * `Theme` is designed to be used as `ThemeSingleton`. It holds top-level CSS variables for Io-Gui design system.
 * CSS Variables are grouped in different themes and can be collectively switched by changing `theme` property.
 *
 * ```javascript
 * ThemeSingleton.themeID = 'dark';
 * ```
 *
 * CSS color variables such as `'--io_color'` and `'--io_bgColor'` are mapped to numeric properties `io_color` and `io_bgColor`.
 */
export declare class Theme extends Node {
    static get ReactiveProperties(): ReactivePropertyDefinitions;
    themeDefaults: Record<string, ThemeVars>;
    themeID: string;
    reactivity: string;
    init(): void;
    registerTheme(themeID: string, theme: ThemeVars): void;
    reset(): void;
    themeIDChanged(): void;
    onPropertyMutated(event: CustomEvent): true | undefined;
    fontSizeChanged(): void;
    lineHeightChanged(): void;
    changed(): void;
    onSaveTheme(): void;
}
declare const ThemeSingleton: Theme;
export { ThemeSingleton };
//# sourceMappingURL=Theme.d.ts.map