import { IoElement, RegisterIoElement } from '../build/iogui.js';
import {IoThemeSingleton, Options} from '../build/iogui.js';

export class IoDemoThemeEditor extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      @apply --io-grid2;
      max-width: 32em;
      padding: var(--io-spacing);
      grid-template-columns: auto 1fr !important;
    }
    `;
  }
  constructor(props) {
    super(props);
    this.template([
      ['io-field', {label: 'Reset Current Theme:'}],
      ['io-button', {label: 'Reset', selectable: false, action: () => IoThemeSingleton.reset() }],
      ['io-field', {label: 'Choose theme:'}],
      ['io-option-menu', {value: IoThemeSingleton.bind('theme'), options: new Options(['light', 'dark'])}],
      ['io-field', {label: 'ioSpacing'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('ioSpacing'), min: 0, max: 20, step: 1}],
      ['io-field', {label: 'ioBorderRadius'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('ioBorderRadius'), min: 0, max: 20}],
      ['io-field', {label: 'ioBorderWidth'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('ioBorderWidth'), min: 0, max: 5, step: 1}],
      ['io-field', {label: 'ioStrokeWidth'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('ioStrokeWidth'), min: 1, max: 20, step: 1}],
      ['io-field', {label: 'ioLineHeight'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('ioLineHeight'), min: 10, max: 50, step: 1}],
      ['io-field', {label: 'ioFontSize'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('ioFontSize'), min: 5, max: 20}],
      ['io-field', {label: 'ioBackgroundColor'}],
      ['io-color-vector', {value: IoThemeSingleton.bind('ioBackgroundColor'), mode: 0}],
      ['io-field', {label: 'ioBackgroundColorLight'}],
      ['io-color-vector', {value: IoThemeSingleton.bind('ioBackgroundColorLight'), mode: 0}],
      ['io-field', {label: 'ioBackgroundColorDark'}],
      ['io-color-vector', {value: IoThemeSingleton.bind('ioBackgroundColorDark'), mode: 0}],
      ['io-field', {label: 'ioBackgroundColorField'}],
      ['io-color-vector', {value: IoThemeSingleton.bind('ioBackgroundColorField'), mode: 0}],
      ['io-field', {label: 'ioColor'}],
      ['io-color-vector', {value: IoThemeSingleton.bind('ioColor'), mode: 0}],
      ['io-field', {label: 'ioColorError'}],
      ['io-color-vector', {value: IoThemeSingleton.bind('ioColorError'), mode: 0}],
      ['io-field', {label: 'ioColorLink'}],
      ['io-color-vector', {value: IoThemeSingleton.bind('ioColorLink'), mode: 0}],
      ['io-field', {label: 'ioColorFocus'}],
      ['io-color-vector', {value: IoThemeSingleton.bind('ioColorFocus'), mode: 0}],
      ['io-field', {label: 'ioColorField'}],
      ['io-color-vector', {value: IoThemeSingleton.bind('ioColorField'), mode: 0}],
      ['io-field', {label: 'ioColorNumber'}],
      ['io-color-vector', {value: IoThemeSingleton.bind('ioColorNumber'), mode: 0}],
      ['io-field', {label: 'ioColorString'}],
      ['io-color-vector', {value: IoThemeSingleton.bind('ioColorString'), mode: 0}],
      ['io-field', {label: 'ioColorBoolean'}],
      ['io-color-vector', {value: IoThemeSingleton.bind('ioColorBoolean'), mode: 0}],
      ['io-field', {label: 'ioColorBorder'}],
      ['io-color-vector', {value: IoThemeSingleton.bind('ioColorBorder'), mode: 0}],
      ['io-field', {label: 'ioColorBorderLight'}],
      ['io-color-vector', {value: IoThemeSingleton.bind('ioColorBorderLight'), mode: 0}],
      ['io-field', {label: 'ioColorBorderDark'}],
      ['io-color-vector', {value: IoThemeSingleton.bind('ioColorBorderDark'), mode: 0}],
      ['io-field', {label: 'ioColorGradientStart'}],
      ['io-color-vector', {value: IoThemeSingleton.bind('ioColorGradientStart'), mode: 0}],
      ['io-field', {label: 'ioColorGradientEnd'}],
      ['io-color-vector', {value: IoThemeSingleton.bind('ioColorGradientEnd'), mode: 0}],
      ['io-field', {label: 'ioColorShadow'}],
      ['io-color-vector', {value: IoThemeSingleton.bind('ioColorShadow'), mode: 0}],

    ]);
  }
}

RegisterIoElement(IoDemoThemeEditor);
