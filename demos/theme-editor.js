import { IoElement, Register, IoThemeSingleton, MenuOptions } from '../build/iogui.js';

export class IoDemoThemeEditor extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: var(--iotSpacing);
      background-color: var(--iotBgColor);
      padding: var(--iotSpacing);
      grid-template-columns: auto 1fr !important;
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

      ['io-field', {appearance: 'neutral', label: 'iotSpacing'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('iotSpacing'), min: 0, max: 20, step: 1}],

      ['io-field', {appearance: 'neutral', label: 'iotLineHeight'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('iotLineHeight'), min: 10, max: 50, step: 1}],

      ['io-field', {appearance: 'neutral', label: 'iotFontSize'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('iotFontSize'), min: 5, max: 20, step: 1}],

      ['io-field', {appearance: 'neutral', label: 'iotBorderRadius'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('iotBorderRadius'), min: 0, max: 20, step: 1}],
      ['io-field', {appearance: 'neutral', label: 'iotBorderWidth'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('iotBorderWidth'), min: 0, max: 5, step: 1}],
      ['io-field', {appearance: 'neutral', label: 'iotBorderColor'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotBorderColor')}],
      ['io-field', {appearance: 'neutral', label: 'iotBorderColorLight'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotBorderColorLight')}],
      ['io-field', {appearance: 'neutral', label: 'iotBorderColorDark'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotBorderColorDark')}],

      ['io-field', {appearance: 'neutral', label: 'iotBgColor'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotBgColor')}],
      ['io-field', {appearance: 'neutral', label: 'iotBgColorStrong'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotBgColorStrong')}],
      ['io-field', {appearance: 'neutral', label: 'iotBgColorDimmed'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotBgColorDimmed')}],
      ['io-field', {appearance: 'neutral', label: 'iotBgColorRed'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotBgColorRed')}],
      ['io-field', {appearance: 'neutral', label: 'iotBgColorGreen'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotBgColorGreen')}],
      ['io-field', {appearance: 'neutral', label: 'iotBgColorBlue'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotBgColorBlue')}],
      ['io-field', {appearance: 'neutral', label: 'iotBgColorField'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotBgColorField')}],

      ['io-field', {appearance: 'neutral', label: 'iotColor'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotColor')}],
      ['io-field', {appearance: 'neutral', label: 'iotColorStrong'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotColorStrong')}],
      ['io-field', {appearance: 'neutral', label: 'iotColorDimmed'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotColorDimmed')}],
      ['io-field', {appearance: 'neutral', label: 'iotColorRed'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotColorRed')}],
      ['io-field', {appearance: 'neutral', label: 'iotColorGreen'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotColorGreen')}],
      ['io-field', {appearance: 'neutral', label: 'iotColorBlue'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotColorBlue')}],
      ['io-field', {appearance: 'neutral', label: 'iotColorWhite'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotColorWhite')}],
      ['io-field', {appearance: 'neutral', label: 'iotColorField'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotColorField')}],


      ['io-field', {appearance: 'neutral', label: 'iotGradientColorStart'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotGradientColorStart')}],
      ['io-field', {appearance: 'neutral', label: 'iotGradientColorEnd'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotGradientColorEnd')}],

      ['io-field', {appearance: 'neutral', label: 'iotShadowColor'}],
      ['io-color-rgba', {value: IoThemeSingleton.bind('iotShadowColor')}],
    ]);
  }
}

Register(IoDemoThemeEditor);
