import { IoElement } from '../../components/io-element.js';
export declare class IoTheme extends IoElement {
    static get Style(): string;
    static get Properties(): {
        theme: any;
        cssSpacing: any;
        cssBorderRadius: any;
        cssBorderWidth: any;
        cssStrokeWidth: any;
        cssLineHeight: any;
        cssItemHeight: any;
        cssFontSize: any;
        cssBackgroundColor: {
            value: any;
            observe: boolean;
        };
        cssBackgroundColorLight: {
            value: any;
            observe: boolean;
        };
        cssBackgroundColorDark: {
            value: any;
            observe: boolean;
        };
        cssBackgroundColorField: {
            value: any;
            observe: boolean;
        };
        cssColor: {
            value: any;
            observe: boolean;
        };
        cssColorError: {
            value: any;
            observe: boolean;
        };
        cssColorLink: {
            value: any;
            observe: boolean;
        };
        cssColorFocus: {
            value: any;
            observe: boolean;
        };
        cssColorField: {
            value: any;
            observe: boolean;
        };
        cssColorNumber: {
            value: any;
            observe: boolean;
        };
        cssColorString: {
            value: any;
            observe: boolean;
        };
        cssColorBoolean: {
            value: any;
            observe: boolean;
        };
        cssColorBorder: {
            value: any;
            observe: boolean;
        };
        cssColorBorderLight: {
            value: any;
            observe: boolean;
        };
        cssColorBorderDark: {
            value: any;
            observe: boolean;
        };
        cssColorGradientStart: {
            value: any;
            observe: boolean;
        };
        cssColorGradientEnd: {
            value: any;
            observe: boolean;
        };
        cssColorShadow: {
            value: any;
            observe: boolean;
        };
        lazy: boolean;
    };
    constructor(props?: any);
    _toCss(rgba: number[]): string;
    reset(): void;
    themeChanged(): void;
    changed(): void;
}
declare const IoThemeSingleton: IoTheme;
export { IoThemeSingleton };
//# sourceMappingURL=theme.d.ts.map