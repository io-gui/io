var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../decorators/Register.js';
import { Property } from '../decorators/Property.js';
import { ReactiveObject } from '../nodes/ReactiveObject.js';
import { Storage as $ } from '../nodes/Storage.js';
import { Color } from '../core/Color.js';
import { adoptDocumentStylesheet } from '../core/Style.js';
const THEME_VERSION = 'v0.17';
export const $ThemeID = $({
    value: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    storage: 'local',
    key: 'theme-' + THEME_VERSION
});
export const THEMES = {
    light: {
        spacing: 2,
        spacing2: 0,
        spacing3: 0,
        spacing5: 0,
        spacing8: 0,
        lineHeight: 20,
        fontSize: 14,
        fieldHeight: 0,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: Color.toHex(0.2, 0.2, 0.2),
        borderColorLight: Color.toHex(0.3, 0.3, 0.3),
        borderColorStrong: Color.toHex(0.6, 0.6, 0.6),
        borderColorRed: Color.toHex(1, 0.35, 0.15),
        borderColorGreen: Color.toHex(0.1, 0.7, 0.2),
        borderColorBlue: Color.toHex(0.2, 0.4, 0.95),
        bgColor: Color.toHex(0.85, 0.85, 0.85),
        bgColorStrong: Color.toHex(0.9, 0.9, 0.9),
        bgColorLight: Color.toHex(0.8, 0.8, 0.8),
        bgColorRed: Color.toHex(1, 0.5, 0.3),
        bgColorGreen: Color.toHex(0.2, 0.9, 0.3),
        bgColorBlue: Color.toHex(0.2, 0.5, 0.9),
        bgColorInput: Color.toHex(0.95, 0.96, 0.95),
        color: Color.toHex(0.25, 0.25, 0.2),
        colorStrong: Color.toHex(0, 0, 0),
        colorLight: Color.toHex(0.6, 0.6, 0.6),
        colorRed: Color.toHex(1, 0.2, 0),
        colorGreen: Color.toHex(0, 0.6, 0.1),
        colorBlue: Color.toHex(0.2, 0.3, 1),
        colorWhite: Color.toHex(1, 1, 1),
        colorInput: Color.toHex(0, 0.05, 0.02),
        gradientColorStart: Color.toHex(0.9, 0.9, 0.9),
        gradientColorEnd: Color.toHex(0.75, 0.75, 0.75),
        shadowColor: Color.toHex(0, 0, 0, 0.2),
    },
    dark: {
        spacing: 2,
        spacing2: 0,
        spacing3: 0,
        spacing5: 0,
        spacing8: 0,
        lineHeight: 20,
        fontSize: 14,
        fieldHeight: 0,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: Color.toHex(0.5, 0.5, 0.5),
        borderColorLight: Color.toHex(0.3, 0.3, 0.3),
        borderColorStrong: Color.toHex(0, 0, 0),
        borderColorRed: Color.toHex(1, 0.2, 0),
        borderColorBlue: Color.toHex(0.4, 0.5, 0.9),
        borderColorGreen: Color.toHex(0, 0.6, 0.1),
        bgColor: Color.toHex(0.2, 0.2, 0.2),
        bgColorStrong: Color.toHex(0.15, 0.15, 0.15),
        bgColorLight: Color.toHex(0.25, 0.25, 0.25),
        bgColorRed: Color.toHex(0.7, 0.2, 0.1),
        bgColorGreen: Color.toHex(0.1, 0.5, 0.2),
        bgColorBlue: Color.toHex(0.2, 0.4, 0.8),
        bgColorInput: Color.toHex(0.02, 0.02, 0.02),
        color: Color.toHex(0.6, 0.6, 0.6),
        colorStrong: Color.toHex(0.86, 0.86, 0.86),
        colorLight: Color.toHex(0.3, 0.3, 0.3),
        colorRed: Color.toHex(1, 0.4, 0.4),
        colorGreen: Color.toHex(0.4, 0.95, 0.3),
        colorBlue: Color.toHex(0.6, 0.9, 1),
        colorWhite: Color.toHex(1, 1, 1),
        colorInput: Color.toHex(0.65, 0.7, 0.68),
        gradientColorStart: Color.toHex(0.45, 0.45, 0.45),
        gradientColorEnd: Color.toHex(0.2, 0.2, 0.2),
        shadowColor: Color.toHex(0, 0, 0, 0.2),
    },
};
const themeKeys = Object.keys(THEMES.light);
function isThemeColorKey(key) {
    return key.includes('Color') || key.startsWith('color') || key.startsWith('gradient');
}
/**
 * Top-level theme singleton; maps numeric/Color properties to `--io_*` CSS variables.
 * @see ThemeSingleton
 */
let Theme = class Theme extends ReactiveObject {
    static get Properties() {
        const props = {};
        for (const key of themeKeys) {
            if (isThemeColorKey(key)) {
                props[key] = { type: Color, init: [0, 0, 0, 1] };
            }
            else {
                props[key] = { type: Number };
            }
        }
        return props;
    }
    onPropertyMutated(event) {
        const mutated = super.onPropertyMutated(event);
        if (mutated) {
            this.mutated();
            this.dispatchMutation();
            return true;
        }
        return false;
    }
    fontSizeChanged() {
        this.lineHeight = Math.max(this.fontSize, this.lineHeight);
    }
    lineHeightChanged() {
        this.fontSize = Math.min(this.lineHeight, this.fontSize);
    }
    mutated() {
        this.fieldHeight = this.lineHeight + 2 * (this.spacing + this.borderWidth);
        this.spacing2 = this.spacing * 2;
        this.spacing3 = this.spacing * 3;
        this.spacing5 = this.spacing * 5;
        this.spacing8 = this.spacing * 8;
        for (const key of themeKeys) {
            const value = this[key];
            const cssValue = (value instanceof Color) ? value.toCss() : `${value}px`;
            themeStyleDeclaration.setProperty(`--io_${key}`, cssValue);
        }
    }
};
__decorate([
    Property('debounced')
], Theme.prototype, "dispatchTiming", void 0);
Theme = __decorate([
    Register
], Theme);
export { Theme };
const compositeVariables = {
    '--io_border': 'var(--io_borderWidth) solid var(--io_borderColor)',
    '--io_borderColorInset': 'var(--io_borderColorStrong) var(--io_borderColorLight) var(--io_borderColorLight) var(--io_borderColorStrong)',
    '--io_borderColorOutset': 'var(--io_borderColorLight) var(--io_borderColorStrong) var(--io_borderColorStrong) var(--io_borderColorLight)',
    '--io_gradientOutset': 'linear-gradient(180deg, var(--io_gradientColorStart), var(--io_gradientColorEnd) 100%)',
    '--io_gradientInset': 'linear-gradient(0deg, var(--io_gradientColorStart), var(--io_gradientColorEnd) 150%)',
    '--io_shadow': '2px 2px 6px var(--io_shadowColor), 1px 1px 1px var(--io_shadowColor)',
    '--io_shadowInset': '0.75px 0.75px 2px inset var(--io_shadowColor)',
    '--io_shadowOutset': '1px 1px 2px var(--io_shadowColor)',
};
const themeStyleDeclaration = createThemeStyleDeclaration();
function createThemeStyleDeclaration() {
    const styleSheet = adoptDocumentStylesheet('body {}');
    const bodyRule = styleSheet.cssRules[0];
    for (const name in compositeVariables) {
        bodyRule.style.setProperty(name, compositeVariables[name]);
    }
    return bodyRule.style;
}
const ThemeSingleton = new Theme().applyJSON(THEMES[$ThemeID.value]);
export const $Theme = $({
    value: ThemeSingleton,
    storage: 'local',
    key: 'io-theme-' + THEME_VERSION
});
$ThemeID.node.addEventListener('value-changed', (event) => {
    ThemeSingleton.applyJSON(THEMES[event.detail.value]);
});
export { ThemeSingleton };
