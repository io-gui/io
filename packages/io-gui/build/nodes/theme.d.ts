import { PropertyDefinitions, IoNode } from '../core/node';
export declare class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: number, g: number, b: number, a: number);
    toCss(): string;
}
export type Theme = {
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
    bgColor: Color;
    bgColorStrong: Color;
    bgColorDimmed: Color;
    bgColorRed: Color;
    bgColorGreen: Color;
    bgColorBlue: Color;
    bgColorField: Color;
    color: Color;
    colorStrong: Color;
    colorDimmed: Color;
    colorRed: Color;
    colorGreen: Color;
    colorBlue: Color;
    colorWhite: Color;
    colorField: Color;
    gradientColorStart: Color;
    gradientColorEnd: Color;
    shadowColor: Color;
};
export declare const LIGHT_THEME: Theme;
export declare const DARK_THEME: Theme;
/**
 * `IoTheme` is designed to be used as `IoThemeSingleton`. It holds top-level CSS variables for Io-Gui design system.
 * CSS Variables are grouped in different themes and can be collectively switched by changing `theme` property.
 *
 * ```javascript
 * IoThemeSingleton.themeID = 'dark';
 * ```
 *
 * CSS color variables such as `'--io_color'` and `'--io_bgColor'` are mapped to numeric properties `io_color` and `io_bgColor`.
 */
export declare class IoTheme extends IoNode {
    static get Properties(): PropertyDefinitions;
    themeDefaults: Record<string, Theme>;
    themeID: string;
    reactivity: string;
    init(): void;
    registerTheme(themeID: string, theme: Theme): void;
    reset(): void;
    themeIDChanged(): void;
    onPropertyMutated(event: CustomEvent): void;
    changed(): void;
    onSaveTheme(): void;
}
declare const IoThemeSingleton: IoTheme;
export { IoThemeSingleton };
//# sourceMappingURL=theme.d.ts.map