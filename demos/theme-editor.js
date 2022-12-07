import { IoElement, MenuItem, RegisterIoElement } from '../build/iogui.js';
import { IoThemeSingleton, MenuOptions } from '../build/iogui.js';

export class IoDemoThemeEditor extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: var(--ioSpacing);
      background: var(--ioBackgroundColor);
      color: var(--ioColor);
      max-width: 32em;
      padding: var(--ioSpacing);
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
      ['io-field', {appearance: 'neutral', label: 'ioSpacing'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('ioSpacing'), min: 0, max: 20, step: 1}],
      ['io-field', {appearance: 'neutral', label: 'ioBorderRadius'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('ioBorderRadius'), min: 0, max: 20}],
      ['io-field', {appearance: 'neutral', label: 'ioBorderWidth'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('ioBorderWidth'), min: 0, max: 5, step: 1}],
      ['io-field', {appearance: 'neutral', label: 'ioStrokeWidth'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('ioStrokeWidth'), min: 1, max: 20, step: 1}],
      ['io-field', {appearance: 'neutral', label: 'ioLineHeight'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('ioLineHeight'), min: 10, max: 50, step: 1}],
      ['io-field', {appearance: 'neutral', label: 'ioFontSize'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('ioFontSize'), min: 5, max: 20}],

      // ['io-field', {appearance: 'neutral', label: 'ioBackgroundColor'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('ioBackgroundColor')}],
      // ['io-field', {appearance: 'neutral', label: 'ioBackgroundColorFocus'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('ioBackgroundColorFocus')}],
      // ['io-field', {appearance: 'neutral', label: 'ioBackgroundColorLight'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('ioBackgroundColorLight')}],
      // ['io-field', {appearance: 'neutral', label: 'ioBackgroundColorDark'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('ioBackgroundColorDark')}],
      // ['io-field', {appearance: 'neutral', label: 'ioBackgroundColorField'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('ioBackgroundColorField')}],
      // ['io-field', {appearance: 'neutral', label: 'ioBackgroundColorSelected'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('ioBackgroundColorSelected')}],
      // ['io-field', {appearance: 'neutral', label: 'ioColor'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('ioColor')}],
      // ['io-field', {appearance: 'neutral', label: 'ioColorError'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('ioColorError')}],
      // ['io-field', {appearance: 'neutral', label: 'ioColorLink'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('ioColorLink')}],
      // ['io-field', {appearance: 'neutral', label: 'ioColorFieldSelected'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('ioColorFieldSelected')}],
      // ['io-field', {appearance: 'neutral', label: 'ioColorField'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('ioColorField')}],
      // ['io-field', {appearance: 'neutral', label: 'ioColorFieldSelected'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('ioColorFieldSelected')}],
      // ['io-field', {appearance: 'neutral', label: 'ioBorderColor'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('ioBorderColor')}],
      // ['io-field', {appearance: 'neutral', label: 'ioBorderColorSelected'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('ioBorderColorSelected')}],


      // ['io-field', {appearance: 'neutral', label: 'ioColorGradientStart'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('ioColorGradientStart')}],
      // ['io-field', {appearance: 'neutral', label: 'ioColorGradientEnd'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('ioColorGradientEnd')}],
      // ['io-field', {appearance: 'neutral', label: 'ioColorShadow'}],
      // ['io-color-rgba', {value: IoThemeSingleton.bind('ioColorShadow')}],
    ]);
  }
}

RegisterIoElement(IoDemoThemeEditor);
