import { IoElement, MenuItem, RegisterIoElement } from '../build/iogui.js';
import { IoThemeSingleton, MenuOptions } from '../build/iogui.js';

export class IoDemoThemeEditor extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: var(--iotSpacing);
      background: var(--iotBackgroundColor);
      color: var(--iotColor);
      max-width: 32em;
      padding: var(--iotSpacing);
      grid-template-columns: auto 1fr !important;
    }
    `;
  }
  constructor(props) {
    super(props);
    this.template([
      ['io-option-menu', {value: IoThemeSingleton.bind('theme'), options: new MenuOptions([
        {label: 'Light Theme', value: 'light'},
        {label: 'Dark Theme', value: 'dark'},
      ])}],
      ['io-button', {label: 'Reset', action: () => IoThemeSingleton.reset() }],
      ['io-field', {appearance: 'neutral', label: 'iotSpacing'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('iotSpacing'), min: 0, max: 20, step: 1}],
      ['io-field', {appearance: 'neutral', label: 'iotBorderRadius'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('iotBorderRadius'), min: 0, max: 20}],
      ['io-field', {appearance: 'neutral', label: 'iotBorderWidth'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('iotBorderWidth'), min: 0, max: 5, step: 1}],
      ['io-field', {appearance: 'neutral', label: 'iotStrokeWidth'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('iotStrokeWidth'), min: 1, max: 20, step: 1}],
      ['io-field', {appearance: 'neutral', label: 'iotLineHeight'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('iotLineHeight'), min: 10, max: 50, step: 1}],
      ['io-field', {appearance: 'neutral', label: 'iotFontSize'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('iotFontSize'), min: 5, max: 20}],

      // ['io-field', {appearance: 'neutral', label: 'iotBackgroundColor'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('iotBackgroundColor')}],
      // ['io-field', {appearance: 'neutral', label: 'iotBackgroundColorFocus'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('iotBackgroundColorFocus')}],
      // ['io-field', {appearance: 'neutral', label: 'iotBackgroundColorLight'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('iotBackgroundColorLight')}],
      // ['io-field', {appearance: 'neutral', label: 'iotBackgroundColorDark'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('iotBackgroundColorDark')}],
      // ['io-field', {appearance: 'neutral', label: 'iotBackgroundColorField'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('iotBackgroundColorField')}],
      // ['io-field', {appearance: 'neutral', label: 'iotBackgroundColorSelected'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('iotBackgroundColorSelected')}],
      // ['io-field', {appearance: 'neutral', label: 'iotColor'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('iotColor')}],
      // ['io-field', {appearance: 'neutral', label: 'iotColorError'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('iotColorError')}],
      // ['io-field', {appearance: 'neutral', label: 'iotColorLink'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('iotColorLink')}],
      // ['io-field', {appearance: 'neutral', label: 'iotColorFieldSelected'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('iotColorFieldSelected')}],
      // ['io-field', {appearance: 'neutral', label: 'iotColorField'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('iotColorField')}],
      // ['io-field', {appearance: 'neutral', label: 'iotColorFieldSelected'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('iotColorFieldSelected')}],
      // ['io-field', {appearance: 'neutral', label: 'iotBorderColor'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('iotBorderColor')}],
      // ['io-field', {appearance: 'neutral', label: 'iotBorderColorSelected'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('iotBorderColorSelected')}],


      // ['io-field', {appearance: 'neutral', label: 'iotColorGradientStart'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('iotColorGradientStart')}],
      // ['io-field', {appearance: 'neutral', label: 'iotColorGradientEnd'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('iotColorGradientEnd')}],
      // ['io-field', {appearance: 'neutral', label: 'iotColorShadow'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('iotColorShadow')}],
    ]);
  }
}

RegisterIoElement(IoDemoThemeEditor);
