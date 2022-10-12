import { IoElement } from './element.js';
export declare class IoTheme extends IoElement {
    static get Style(): string;
    static get Properties(): any;
    init(): void;
    _toCss(rgba: number[]): string;
    reset(): void;
    themeChanged(): void;
    changed(): void;
}
declare const IoThemeSingleton: IoTheme;
export { IoThemeSingleton };
//# sourceMappingURL=theme.d.ts.map