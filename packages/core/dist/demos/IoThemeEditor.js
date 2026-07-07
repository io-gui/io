//@ts-nocheck
import { Register, ReactiveElement, ThemeSingleton, $ThemeID, THEMES, span } from '@io-gui/core';
import { MenuOption, ioOptionSelect } from '@io-gui/menus';
import { ioButton } from '@io-gui/inputs';
import { ioNumberSlider } from '@io-gui/sliders';
import { ioColorRgba } from '@io-gui/colors';
/** @internal Demo: live theme variable editor. */
export class IoThemeEditor extends ReactiveElement {
    static get Style() {
        return /* css */ `
    :host {
      align-self: stretch;
      display: grid;
      grid-gap: var(--io_spacing);
      padding: var(--io_spacing3);
      grid-template-columns: auto minmax(0, 1fr) !important;
    }    `;
    }
    constructor(props) {
        super(props);
        this.render([
            ioOptionSelect({ value: $ThemeID, option: new MenuOption({ options: [
                        { id: 'Light Theme', value: 'light' },
                        { id: 'Dark Theme', value: 'dark' },
                    ] }) }),
            ioButton({ label: 'Reset', action: () => ThemeSingleton.applyJSON(THEMES[$ThemeID.value]) }),
            span('spacing'),
            ioNumberSlider({ value: ThemeSingleton.bind('spacing'), min: 0, max: 20, step: 1 }),
            span('lineHeight'),
            ioNumberSlider({ value: ThemeSingleton.bind('lineHeight'), min: ThemeSingleton.bind('fontSize'), max: 50, step: 1 }),
            span('fontSize'),
            ioNumberSlider({ value: ThemeSingleton.bind('fontSize'), min: 5, max: 20, step: 1 }),
            span('borderRadius'),
            ioNumberSlider({ value: ThemeSingleton.bind('borderRadius'), min: 0, max: 20, step: 1 }),
            span('borderWidth'),
            ioNumberSlider({ value: ThemeSingleton.bind('borderWidth'), min: 0, max: 5, step: 1 }),
            span('borderColor'),
            ioColorRgba({ value: ThemeSingleton.bind('borderColor') }),
            span('borderColorLight'),
            ioColorRgba({ value: ThemeSingleton.bind('borderColorLight') }),
            span('borderColorStrong'),
            ioColorRgba({ value: ThemeSingleton.bind('borderColorStrong') }),
            span('borderColorRed'),
            ioColorRgba({ value: ThemeSingleton.bind('borderColorRed') }),
            span('borderColorBlue'),
            ioColorRgba({ value: ThemeSingleton.bind('borderColorBlue') }),
            span('borderColorGreen'),
            ioColorRgba({ value: ThemeSingleton.bind('borderColorGreen') }),
            span('bgColor'),
            ioColorRgba({ value: ThemeSingleton.bind('bgColor') }),
            span('bgColorStrong'),
            ioColorRgba({ value: ThemeSingleton.bind('bgColorStrong') }),
            span('bgColorLight'),
            ioColorRgba({ value: ThemeSingleton.bind('bgColorLight') }),
            span('bgColorRed'),
            ioColorRgba({ value: ThemeSingleton.bind('bgColorRed') }),
            span('bgColorGreen'),
            ioColorRgba({ value: ThemeSingleton.bind('bgColorGreen') }),
            span('bgColorBlue'),
            ioColorRgba({ value: ThemeSingleton.bind('bgColorBlue') }),
            span('bgColorInput'),
            ioColorRgba({ value: ThemeSingleton.bind('bgColorInput') }),
            span('color'),
            ioColorRgba({ value: ThemeSingleton.bind('color') }),
            span('colorStrong'),
            ioColorRgba({ value: ThemeSingleton.bind('colorStrong') }),
            span('colorLight'),
            ioColorRgba({ value: ThemeSingleton.bind('colorLight') }),
            span('colorRed'),
            ioColorRgba({ value: ThemeSingleton.bind('colorRed') }),
            span('colorGreen'),
            ioColorRgba({ value: ThemeSingleton.bind('colorGreen') }),
            span('colorBlue'),
            ioColorRgba({ value: ThemeSingleton.bind('colorBlue') }),
            span('colorWhite'),
            ioColorRgba({ value: ThemeSingleton.bind('colorWhite') }),
            span('colorInput'),
            ioColorRgba({ value: ThemeSingleton.bind('colorInput') }),
            span('gradientColorStart'),
            ioColorRgba({ value: ThemeSingleton.bind('gradientColorStart') }),
            span('gradientColorEnd'),
            ioColorRgba({ value: ThemeSingleton.bind('gradientColorEnd') }),
        ]);
    }
}
Register(IoThemeEditor);
export const ioThemeEditor = (arg0) => IoThemeEditor.vConstructor(arg0);
