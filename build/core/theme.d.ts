import { IoElement } from './element.js';
import { PropertyDeclarations } from './internals/property.js';
export declare class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: number, g: number, b: number, a: number);
}
export type Theme = {
    iotSpacing: number;
    iotSpacing2: number;
    iotSpacing3: number;
    iotSpacing4: number;
    iotLineHeight: number;
    iotLineHeight2: number;
    iotLineHeight3: number;
    iotLineHeight4: number;
    iotLineHeight8: number;
    iotFieldHeight: number;
    iotFieldHeight2: number;
    iotFieldHeight3: number;
    iotFieldHeight4: number;
    iotFieldHeight8: number;
    iotFieldHeight10: number;
    iotFieldHeight12: number;
    iotStrokeWidth: number;
    iotBorderRadius: number;
    iotBorderRadius2: number;
    iotBorderWidth: number;
    iotBorderWidth2: number;
    iotFontSize: number;
    iotBackgroundColor: Color;
    iotBackgroundColorStrong: Color;
    iotBackgroundColorDimmed: Color;
    iotBackgroundColorFaint: Color;
    iotBackgroundColorField: Color;
    iotBackgroundColorSelected: Color;
    iotColor: Color;
    iotColorStrong: Color;
    iotColorDimmed: Color;
    iotColorError: Color;
    iotColorLink: Color;
    iotColorField: Color;
    iotColorSelected: Color;
    iotBorderColor: Color;
    iotBorderColorLight: Color;
    iotBorderColorDark: Color;
    iotBorderColorSelected: Color;
    iotBorderColorFocus: Color;
    iotGradientColorStart: Color;
    iotGradientColorEnd: Color;
    iotShadowColor: Color;
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
 * CSS color variables such as `'--iotColor'` and `'--iotBackgroundColor'` are mapped to numeric properties `iotColor` and `iotBackgroundColor`.
 */
declare class IoTheme extends IoElement {
    static get Properties(): PropertyDeclarations;
    themes: Record<string, Theme>;
    themeID: string;
    init(): void;
    registerTheme(themeID: string, theme: Theme): void;
    _toCss(rgba: Color): string;
    reset(): void;
    themeIDChanged(): void;
    changed(): void;
}
declare const IoThemeSingleton: IoTheme;
export { IoThemeSingleton };
//# sourceMappingURL=theme.d.ts.map