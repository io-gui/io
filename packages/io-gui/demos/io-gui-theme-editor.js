import { IoElement, Register, IoThemeSingleton } from 'io-gui';
import { MenuOptions } from 'io-menus';
import 'io-inputs';
import 'io-sliders';
import 'io-color';

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
      ['io-option-menu', {value: IoThemeSingleton.bind('themeID'), options: new MenuOptions([
        {label: 'Light Theme', value: 'light'},
        {label: 'Dark Theme', value: 'dark'},
      ])}],
      ['io-button', {label: 'Reset', action: () => IoThemeSingleton.reset() }],

      ['io-field', {appearance: 'neutral', label: 'spacing'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('spacing'), min: 0, max: 20, step: 1}],

      ['io-field', {appearance: 'neutral', label: 'lineHeight'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('lineHeight'), min: 10, max: 50, step: 1}],

      ['io-field', {appearance: 'neutral', label: 'fontSize'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('fontSize'), min: 5, max: 20, step: 1}],

      ['io-field', {appearance: 'neutral', label: 'borderRadius'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('borderRadius'), min: 0, max: 20, step: 1}],
      ['io-field', {appearance: 'neutral', label: 'borderWidth'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('borderWidth'), min: 0, max: 5, step: 1}],
      ['io-field', {appearance: 'neutral', label: 'borderColor'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('borderColor')}],
      ['io-field', {appearance: 'neutral', label: 'borderColorLight'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('borderColorLight')}],
      ['io-field', {appearance: 'neutral', label: 'borderColorDark'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('borderColorDark')}],

      ['io-field', {appearance: 'neutral', label: 'bgColor'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('bgColor')}],
      ['io-field', {appearance: 'neutral', label: 'bgColorStrong'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('bgColorStrong')}],
      ['io-field', {appearance: 'neutral', label: 'bgColorDimmed'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('bgColorDimmed')}],
      ['io-field', {appearance: 'neutral', label: 'bgColorRed'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('bgColorRed')}],
      ['io-field', {appearance: 'neutral', label: 'bgColorGreen'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('bgColorGreen')}],
      ['io-field', {appearance: 'neutral', label: 'bgColorBlue'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('bgColorBlue')}],
      ['io-field', {appearance: 'neutral', label: 'bgColorField'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('bgColorField')}],

      ['io-field', {appearance: 'neutral', label: 'color'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('color')}],
      ['io-field', {appearance: 'neutral', label: 'colorStrong'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('colorStrong')}],
      ['io-field', {appearance: 'neutral', label: 'colorDimmed'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('colorDimmed')}],
      ['io-field', {appearance: 'neutral', label: 'colorRed'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('colorRed')}],
      ['io-field', {appearance: 'neutral', label: 'colorGreen'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('colorGreen')}],
      ['io-field', {appearance: 'neutral', label: 'colorBlue'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('colorBlue')}],
      ['io-field', {appearance: 'neutral', label: 'colorWhite'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('colorWhite')}],
      ['io-field', {appearance: 'neutral', label: 'colorField'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('colorField')}],


      ['io-field', {appearance: 'neutral', label: 'gradientColorStart'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('gradientColorStart')}],
      ['io-field', {appearance: 'neutral', label: 'gradientColorEnd'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('gradientColorEnd')}],

      ['io-field', {appearance: 'neutral', label: 'shadowColor'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('shadowColor')}],
    ]);
  }
}

Register(IoGuiThemeEditor);
