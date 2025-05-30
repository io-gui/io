import { IoElement, Register, ThemeSingleton } from 'io-gui';
import { MenuOptions, ioOptionSelect } from 'io-menus';
import { ioButton, ioField } from 'io-inputs';
import { ioNumberSlider } from 'io-sliders';
import { ioColorRgba } from 'io-colors';

export class IoGuiThemeEditor extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      align-self: start;
      display: grid;
      grid-gap: var(--io_spacing);
      padding: var(--io_spacing3);
      grid-template-columns: auto 2fr !important;
    }
    `;
  }
  constructor(props) {
    super(props);
    this.template([
      ioOptionSelect({value: ThemeSingleton.bind('themeID'), options: new MenuOptions().fromJSON([
        {label: 'Light Theme', value: 'light'},
        {label: 'Dark Theme', value: 'dark'},
      ])}),
      ioButton({label: 'Reset', action: () => ThemeSingleton.reset() }),

      ioField('spacing'),
      ioNumberSlider({value: ThemeSingleton.bind('spacing'), min: 0, max: 20, step: 1}),

      ioField('lineHeight'),
      ioNumberSlider({value: ThemeSingleton.bind('lineHeight'), min: ThemeSingleton.bind('fontSize'), max: 50, step: 1}),

      ioField('fontSize'),
      ioNumberSlider({value: ThemeSingleton.bind('fontSize'), min: 5, max: 20, step: 1}),

      ioField('borderRadius'),
      ioNumberSlider({value: ThemeSingleton.bind('borderRadius'), min: 0, max: 20, step: 1}),

      ioField('borderWidth'),
      ioNumberSlider({value: ThemeSingleton.bind('borderWidth'), min: 0, max: 5, step: 1}),

      ioField('borderColor'),
      ioColorRgba({value: ThemeSingleton.bind('borderColor')}),

      ioField('borderColorLight'),
      ioColorRgba({value: ThemeSingleton.bind('borderColorLight')}),

      ioField('borderColorDark'),
      ioColorRgba({value: ThemeSingleton.bind('borderColorDark')}),

      ioField('bgColor'),
      ioColorRgba({value: ThemeSingleton.bind('bgColor')}),

      ioField('bgColorStrong'),
      ioColorRgba({value: ThemeSingleton.bind('bgColorStrong')}),

      ioField('bgColorDimmed'),
      ioColorRgba({value: ThemeSingleton.bind('bgColorDimmed')}),

      ioField('bgColorRed'),
      ioColorRgba({value: ThemeSingleton.bind('bgColorRed')}),

      ioField('bgColorGreen'),
      ioColorRgba({value: ThemeSingleton.bind('bgColorGreen')}),

      ioField('bgColorBlue'),
      ioColorRgba({value: ThemeSingleton.bind('bgColorBlue')}),

      ioField('bgColorInput'),
      ioColorRgba({value: ThemeSingleton.bind('bgColorInput')}),

      ioField('color'),
      ioColorRgba({value: ThemeSingleton.bind('color')}),

      ioField('colorStrong'),
      ioColorRgba({value: ThemeSingleton.bind('colorStrong')}),

      ioField('colorDimmed'),
      ioColorRgba({value: ThemeSingleton.bind('colorDimmed')}),

      ioField('colorRed'),
      ioColorRgba({value: ThemeSingleton.bind('colorRed')}),

      ioField('colorGreen'),
      ioColorRgba({value: ThemeSingleton.bind('colorGreen')}),

      ioField('colorBlue'),
      ioColorRgba({value: ThemeSingleton.bind('colorBlue')}),

      ioField('colorWhite'),
      ioColorRgba({value: ThemeSingleton.bind('colorWhite')}),

      ioField('colorInput'),
      ioColorRgba({value: ThemeSingleton.bind('colorInput')}),

      ioField('gradientColorStart'),
      ioColorRgba({value: ThemeSingleton.bind('gradientColorStart')}),

      ioField('gradientColorEnd'),
      ioColorRgba({value: ThemeSingleton.bind('gradientColorEnd')}),

      ioField('shadowColor'),
      ioColorRgba({value: ThemeSingleton.bind('shadowColor')}),
    ]);
  }
}
Register(IoGuiThemeEditor);
export const ioGuiThemeEditor = IoGuiThemeEditor.vConstructor;
