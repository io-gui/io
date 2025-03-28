var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../core/decorators/register';
import { Property } from '../core/decorators/property';
import { IoNode } from '../core/node';
import { IoStorage as $ } from './storage';
const THEME_VERSION = 'v0.10';
const styleElement = document.createElement('style');
styleElement.setAttribute('id', 'io-theme-variables-' + THEME_VERSION);
document.head.appendChild(styleElement);
export class Color {
    r;
    g;
    b;
    a;
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    toCss() {
        const r = Math.floor(this.r * 255);
        const g = Math.floor(this.g * 255);
        const b = Math.floor(this.b * 255);
        if (this.a !== undefined && this.a !== 1) {
            return `rgba(${r}, ${g}, ${b}, ${this.a})`;
        }
        else {
            return `rgb(${r}, ${g}, ${b})`;
        }
    }
}
export const LIGHT_THEME = {
    spacing: 2,
    spacing2: 0,
    spacing3: 0,
    spacing5: 0,
    spacing8: 0,
    lineHeight: 20,
    fontSize: 14,
    fieldHeight: 0,
    fieldHeight2: 0,
    fieldHeight3: 0,
    fieldHeight4: 0,
    fieldHeight5: 0,
    fieldHeight6: 0,
    fieldHeight7: 0,
    fieldHeight8: 0,
    fieldHeight9: 0,
    fieldHeight10: 0,
    fieldHeight11: 0,
    fieldHeight12: 0,
    borderRadius: 2,
    borderRadius2: 0,
    borderWidth: 1,
    borderColor: new Color(0, 0, 0, 0.2),
    borderColorLight: new Color(1, 1, 1, 0.8),
    borderColorDark: new Color(0, 0, 0, 0.4),
    bgColor: new Color(0.85, 0.85, 0.85, 1),
    bgColorStrong: new Color(0.9, 0.9, 0.9, 1),
    bgColorDimmed: new Color(0.8, 0.8, 0.8, 1),
    bgColorRed: new Color(1, 0.5, 0.3, 1),
    bgColorGreen: new Color(0.2, 0.9, 0.3, 1),
    bgColorBlue: new Color(0.2, 0.5, 0.9, 1),
    bgColorField: new Color(0.95, 0.96, 0.95, 1),
    color: new Color(0.25, 0.25, 0.2, 1),
    colorStrong: new Color(0, 0, 0, 1),
    colorDimmed: new Color(0.6, 0.6, 0.6, 1),
    colorRed: new Color(1, 0.2, 0.0, 1),
    colorGreen: new Color(0, 0.6, 0.1, 1),
    colorBlue: new Color(0.2, 0.3, 1, 1),
    colorWhite: new Color(1, 1, 1, 1),
    colorField: new Color(0, 0.05, 0.02, 1),
    gradientColorStart: new Color(0.9, 0.9, 0.9, 1),
    gradientColorEnd: new Color(0.75, 0.75, 0.75, 1),
    shadowColor: new Color(0, 0, 0, 0.2),
};
export const DARK_THEME = {
    spacing: 2,
    spacing2: 0,
    spacing3: 0,
    spacing5: 0,
    spacing8: 0,
    lineHeight: 20,
    fontSize: 14,
    fieldHeight: 0,
    fieldHeight2: 0,
    fieldHeight3: 0,
    fieldHeight4: 0,
    fieldHeight5: 0,
    fieldHeight6: 0,
    fieldHeight7: 0,
    fieldHeight8: 0,
    fieldHeight9: 0,
    fieldHeight10: 0,
    fieldHeight11: 0,
    fieldHeight12: 0,
    borderRadius: 2,
    borderRadius2: 0,
    borderWidth: 1,
    borderColor: new Color(1, 1, 1, 0.5),
    borderColorLight: new Color(1, 1, 1, 0.3),
    borderColorDark: new Color(0, 0, 0, 1),
    bgColor: new Color(0.2, 0.2, 0.2, 1),
    bgColorStrong: new Color(0.15, 0.15, 0.15, 1),
    bgColorDimmed: new Color(0.25, 0.25, 0.25, 1),
    bgColorRed: new Color(0.7, 0.2, 0.1, 1),
    bgColorGreen: new Color(0.1, 0.5, 0.2, 1),
    bgColorBlue: new Color(0, 0.3, 0.65, 1),
    bgColorField: new Color(0.02, 0.02, 0.02, 1),
    color: new Color(0.6, 0.6, 0.6, 1),
    colorStrong: new Color(0.86, 0.86, 0.86, 1),
    colorDimmed: new Color(0.3, 0.3, 0.3, 1),
    colorRed: new Color(1, 0.4, 0.4, 1),
    colorGreen: new Color(0.4, 0.95, 0.3, 1),
    colorBlue: new Color(0.6, 0.9, 1, 1),
    colorWhite: new Color(1, 1, 1, 1),
    colorField: new Color(0.65, 0.7, 0.68, 1),
    gradientColorStart: new Color(0.45, 0.45, 0.45, 1),
    gradientColorEnd: new Color(0.2, 0.2, 0.2, 1),
    shadowColor: new Color(0, 0, 0, 0.2),
};
const $ThemeID = $({
    value: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    storage: 'local',
    key: 'theme-' + THEME_VERSION
});
const $Themes = $({
    value: {},
    storage: 'local',
    key: 'io-themes-' + THEME_VERSION
});
const compositeVariables = /* css */ `
  body {
    --io_border: var(--io_borderWidth) solid var(--io_borderColor);
    --io_borderColorInset: var(--io_borderColorDark) var(--io_borderColorLight) var(--io_borderColorLight) var(--io_borderColorDark);
    --io_borderColorOutset: var(--io_borderColorLight) var(--io_borderColorDark) var(--io_borderColorDark) var(--io_borderColorLight);
    --io_gradientOutset: linear-gradient(180deg, var(--io_gradientColorStart), var(--io_gradientColorEnd) 100%);
    --io_gradientInset: linear-gradient(0deg, var(--io_gradientColorStart), var(--io_gradientColorEnd) 150%);
    --io_shadow: 2px 2px 6px var(--io_shadowColor), 1px 1px 1px var(--io_shadowColor);
    --io_shadowInset: 1px 1px 1px inset var(--io_shadowColor);
    --io_shadowOutset: 1px 1px 2px var(--io_shadowColor);
  }
`;
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
let IoTheme = class IoTheme extends IoNode {
    static get Properties() {
        const props = {};
        for (const p in LIGHT_THEME) {
            const prop = LIGHT_THEME[p];
            if (prop instanceof Object) {
                props[p] = { value: prop, type: Color };
            }
            else {
                props[p] = prop;
            }
        }
        return props;
    }
    init() {
        this.registerTheme('light', LIGHT_THEME);
        this.registerTheme('dark', DARK_THEME);
        this.saveTheme = this.saveTheme.bind(this);
        this.themeIDChanged();
    }
    registerTheme(themeID, theme) {
        // Save default theme
        this.themeDefaults[themeID] = theme;
        this.setProperty('themeDefaults', JSON.parse(JSON.stringify(this.themeDefaults)), true);
        // Save persistant theme
        $Themes.value[themeID] = $Themes.value[themeID] || theme;
        $Themes.value = JSON.parse(JSON.stringify($Themes.value));
    }
    reset() {
        // Load persistant themes from default themes
        $Themes.value = JSON.parse(JSON.stringify(this.themeDefaults));
        this.themeIDChanged();
    }
    themeIDChanged() {
        const values = $Themes.value[this.themeID];
        for (const p in values) {
            if (values[p] instanceof Object && JSON.stringify(Object.keys(values[p])) === '["r","g","b","a"]') {
                values[p] = new Color(values[p].r, values[p].g, values[p].b, values[p].a);
            }
        }
        this.setProperties(values);
    }
    onPropertyMutated(event) {
        super.onPropertyMutated(event);
        this.changed();
        this.dispatchEvent('object-mutated', { object: this });
    }
    changed() {
        this.fieldHeight = this.lineHeight + 2 * (this.spacing + this.borderWidth);
        this.fieldHeight2 = this.fieldHeight * 2;
        this.fieldHeight3 = this.fieldHeight * 3;
        this.fieldHeight4 = this.fieldHeight * 4;
        this.fieldHeight5 = this.fieldHeight * 5;
        this.fieldHeight6 = this.fieldHeight * 6;
        this.fieldHeight7 = this.fieldHeight * 7;
        this.fieldHeight8 = this.fieldHeight * 8;
        this.fieldHeight9 = this.fieldHeight * 9;
        this.fieldHeight10 = this.fieldHeight * 10;
        this.fieldHeight11 = this.fieldHeight * 11;
        this.fieldHeight12 = this.fieldHeight * 12;
        this.spacing2 = this.spacing * 2;
        this.spacing3 = this.spacing * 3;
        this.spacing5 = this.spacing * 5;
        this.spacing8 = this.spacing * 8;
        this.borderRadius2 = this.borderRadius + this.spacing;
        const propertyVariables = Array.from(Object.keys(LIGHT_THEME)).reduce((result, prop) => {
            $Themes.value[this.themeID][prop] = this[prop];
            if (typeof this[prop] === 'object') {
                return `${result}--io_${prop}: ${this[prop].toCss()};\n    `;
            }
            else {
                return `${result}--io_${prop}: ${this[prop]}px;\n    `;
            }
        }, '');
        styleElement.innerHTML = /* css */ `body {\n  ${propertyVariables}\n}\n${compositeVariables}`;
        this.debounce(this.saveTheme, undefined, 100);
    }
    saveTheme() {
        $Themes.value = JSON.parse(JSON.stringify($Themes.value));
    }
};
__decorate([
    Property({ type: Object })
], IoTheme.prototype, "themeDefaults", void 0);
__decorate([
    Property({ type: String, binding: $ThemeID })
], IoTheme.prototype, "themeID", void 0);
__decorate([
    Property('debounced')
], IoTheme.prototype, "reactivity", void 0);
IoTheme = __decorate([
    Register
], IoTheme);
const IoThemeSingleton = new IoTheme();
export { IoThemeSingleton };
//# sourceMappingURL=theme.js.map