import { ReactivePropertyDefinitions, ReactiveNode, ReactivityType } from '../nodes/ReactiveNode.js';
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
    borderRadius: number;
    borderWidth: number;
    borderColor: Color;
    borderColorLight: Color;
    borderColorStrong: Color;
    borderColorRed: Color;
    borderColorBlue: Color;
    borderColorGreen: Color;
    bgColor: Color;
    bgColorStrong: Color;
    bgColorLight: Color;
    bgColorRed: Color;
    bgColorGreen: Color;
    bgColorBlue: Color;
    bgColorInput: Color;
    color: Color;
    colorStrong: Color;
    colorLight: Color;
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
export declare class Theme extends ReactiveNode {
    static get ReactiveProperties(): ReactivePropertyDefinitions;
    spacing: number;
    spacing2: number;
    spacing3: number;
    spacing5: number;
    spacing8: number;
    lineHeight: number;
    fontSize: number;
    fieldHeight: number;
    borderRadius: number;
    borderWidth: number;
    borderColor: Color;
    borderColorLight: Color;
    borderColorStrong: Color;
    borderColorRed: Color;
    borderColorGreen: Color;
    borderColorBlue: Color;
    bgColor: Color;
    bgColorStrong: Color;
    bgColorLight: Color;
    bgColorRed: Color;
    bgColorGreen: Color;
    bgColorBlue: Color;
    bgColorInput: Color;
    color: Color;
    colorStrong: Color;
    colorLight: Color;
    colorRed: Color;
    colorGreen: Color;
    colorBlue: Color;
    colorWhite: Color;
    colorInput: Color;
    gradientColorStart: Color;
    gradientColorEnd: Color;
    shadowColor: Color;
    themeDefaults: Record<string, ThemeVars>;
    themeID: string;
    reactivity: ReactivityType;
    ready(): void;
    registerTheme(themeID: string, theme: ThemeVars): void;
    reset(): void;
    themeIDChanged(): void;
    onPropertyMutated(event: CustomEvent): boolean;
    fontSizeChanged(): void;
    lineHeightChanged(): void;
    changed(): void;
    onSaveTheme(): void;
}
declare const ThemeSingleton: Theme;
export { ThemeSingleton };
//# sourceMappingURL=Theme.d.ts.map