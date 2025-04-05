import { IoElement, Register, IoThemeSingleton, ioField } from 'io-gui';
import { MenuOptions, ioOptionMenu } from 'io-menus';
import { ioButton } from 'io-inputs';
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
      ioOptionMenu({value: IoThemeSingleton.bind('themeID'), options: new MenuOptions([
        {label: 'Light Theme', value: 'light'},
        {label: 'Dark Theme', value: 'dark'},
      ])}),
      ioButton({label: 'Reset', action: () => IoThemeSingleton.reset() }),

      ioField('spacing'),
      ioNumberSlider({value: IoThemeSingleton.bind('spacing'), min: 0, max: 20, step: 1}),

      ioField('lineHeight'),
      ioNumberSlider({value: IoThemeSingleton.bind('lineHeight'), min: 10, max: 50, step: 1}),

      ioField('fontSize'),
      ioNumberSlider({value: IoThemeSingleton.bind('fontSize'), min: 5, max: 20, step: 1}),

      ioField('borderRadius'),
      ioNumberSlider({value: IoThemeSingleton.bind('borderRadius'), min: 0, max: 20, step: 1}),

      ioField('borderWidth'),
      ioNumberSlider({value: IoThemeSingleton.bind('borderWidth'), min: 0, max: 5, step: 1}),

      ioField('borderColor'),
      ioColorRgba({value: IoThemeSingleton.bind('borderColor')}),

      ioField('borderColorLight'),
      ioColorRgba({value: IoThemeSingleton.bind('borderColorLight')}),

      ioField('borderColorDark'),
      ioColorRgba({value: IoThemeSingleton.bind('borderColorDark')}),

      ioField('bgColor'),
      ioColorRgba({value: IoThemeSingleton.bind('bgColor')}),

      ioField('bgColorStrong'),
      ioColorRgba({value: IoThemeSingleton.bind('bgColorStrong')}),

      ioField('bgColorDimmed'),
      ioColorRgba({value: IoThemeSingleton.bind('bgColorDimmed')}),

      ioField('bgColorRed'),
      ioColorRgba({value: IoThemeSingleton.bind('bgColorRed')}),

      ioField('bgColorGreen'),
      ioColorRgba({value: IoThemeSingleton.bind('bgColorGreen')}),

      ioField('bgColorBlue'),
      ioColorRgba({value: IoThemeSingleton.bind('bgColorBlue')}),

      ioField('bgColorInput'),
      ioColorRgba({value: IoThemeSingleton.bind('bgColorInput')}),

      ioField('color'),
      ioColorRgba({value: IoThemeSingleton.bind('color')}),

      ioField('colorStrong'),
      ioColorRgba({value: IoThemeSingleton.bind('colorStrong')}),

      ioField('colorDimmed'),
      ioColorRgba({value: IoThemeSingleton.bind('colorDimmed')}),

      ioField('colorRed'),
      ioColorRgba({value: IoThemeSingleton.bind('colorRed')}),

      ioField('colorGreen'),
      ioColorRgba({value: IoThemeSingleton.bind('colorGreen')}),

      ioField('colorBlue'),
      ioColorRgba({value: IoThemeSingleton.bind('colorBlue')}),

      ioField('colorWhite'),
      ioColorRgba({value: IoThemeSingleton.bind('colorWhite')}),

      ioField('colorInput'),
      ioColorRgba({value: IoThemeSingleton.bind('colorInput')}),

      ioField('gradientColorStart'),
      ioColorRgba({value: IoThemeSingleton.bind('gradientColorStart')}),

      ioField('gradientColorEnd'),
      ioColorRgba({value: IoThemeSingleton.bind('gradientColorEnd')}),

      ioField('shadowColor'),
      ioColorRgba({value: IoThemeSingleton.bind('shadowColor')}),
    ]);
  }
}
Register(IoGuiThemeEditor);
export const ioGuiThemeEditor = IoGuiThemeEditor.vConstructor;
