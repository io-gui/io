import { ReactivePropertyDefinitions, ReactiveNode, ReactivityType } from '../nodes/ReactiveNode.js';
import { Color } from '../core/Color.js';
export declare const $ThemeID: import("../index.js").Binding<any>;
export type ThemeJSON = Record<string, number>;
export declare const THEMES: Record<string, ThemeJSON>;
/**
 * `Theme` is designed to be used as `ThemeSingleton`. It holds top-level CSS variables for Io-Gui design system.
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
    reactivity: ReactivityType;
    onPropertyMutated(event: CustomEvent): boolean;
    fontSizeChanged(): void;
    lineHeightChanged(): void;
    changed(): void;
}
declare const ThemeSingleton: Theme;
export declare const $Theme: import("../index.js").Binding<any>;
export { ThemeSingleton };
//# sourceMappingURL=Theme.d.ts.map