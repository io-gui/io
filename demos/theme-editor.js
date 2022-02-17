import {IoElement, RegisterIoElement} from '../build/iogui.js';
import {IoThemeSingleton, Options} from '../build/iogui.elements.js';

export class IoDemoThemeEditor extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      @apply --io-table2;
      max-width: 32em;
      padding: var(--io-spacing);
      grid-template-columns: auto 1fr !important;
    }
    `;
  }
  constructor(props) {
    super(props);
    this.template([
      ['io-item', {label: 'Reset Current Theme:'}],
      ['io-button', {label: 'Reset', selectable: false, action: () => IoThemeSingleton.reset() }],
      ['io-item', {label: 'Choose theme:'}],
      ['io-option-menu', {value: IoThemeSingleton.bind('theme'), options: new Options(['light', 'dark'])}],
      ['io-item', {label: 'cssSpacing'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('cssSpacing'), min: 0, max: 20, step: 1}],
      ['io-item', {label: 'cssBorderRadius'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('cssBorderRadius'), min: 0, max: 20}],
      ['io-item', {label: 'cssBorderWidth'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('cssBorderWidth'), min: 0, max: 5, step: 1}],
      ['io-item', {label: 'cssStrokeWidth'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('cssStrokeWidth'), min: 1, max: 20, step: 1}],
      ['io-item', {label: 'cssLineHeight'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('cssLineHeight'), min: 10, max: 50, step: 1}],
      ['io-item', {label: 'cssFontSize'}],
      ['io-number-slider', {value: IoThemeSingleton.bind('cssFontSize'), min: 5, max: 20}],
      ['io-item', {label: 'cssBackgroundColor'}],
      // ['io-color-vector', {value: IoThemeSingleton.bind('cssBackgroundColor'), mode: 0}],
      // ['io-item', {label: 'cssBackgroundColorLight'}],
      // ['io-color-vector', {value: IoThemeSingleton.bind('cssBackgroundColorLight'), mode: 0}],
      // ['io-item', {label: 'cssBackgroundColorDark'}],
      // ['io-color-vector', {value: IoThemeSingleton.bind('cssBackgroundColorDark'), mode: 0}],
      // ['io-item', {label: 'cssBackgroundColorField'}],
      // ['io-color-vector', {value: IoThemeSingleton.bind('cssBackgroundColorField'), mode: 0}],
      // ['io-item', {label: 'cssColor'}],
      // ['io-color-vector', {value: IoThemeSingleton.bind('cssColor'), mode: 0}],
      // ['io-item', {label: 'cssColorError'}],
      // ['io-color-vector', {value: IoThemeSingleton.bind('cssColorError'), mode: 0}],
      // ['io-item', {label: 'cssColorLink'}],
      // ['io-color-vector', {value: IoThemeSingleton.bind('cssColorLink'), mode: 0}],
      // ['io-item', {label: 'cssColorFocus'}],
      // ['io-color-vector', {value: IoThemeSingleton.bind('cssColorFocus'), mode: 0}],
      // ['io-item', {label: 'cssColorField'}],
      // ['io-color-vector', {value: IoThemeSingleton.bind('cssColorField'), mode: 0}],
      // ['io-item', {label: 'cssColorNumber'}],
      // ['io-color-vector', {value: IoThemeSingleton.bind('cssColorNumber'), mode: 0}],
      // ['io-item', {label: 'cssColorString'}],
      // ['io-color-vector', {value: IoThemeSingleton.bind('cssColorString'), mode: 0}],
      // ['io-item', {label: 'cssColorBoolean'}],
      // ['io-color-vector', {value: IoThemeSingleton.bind('cssColorBoolean'), mode: 0}],
      // ['io-item', {label: 'cssColorBorder'}],
      // ['io-color-vector', {value: IoThemeSingleton.bind('cssColorBorder'), mode: 0}],
      // ['io-item', {label: 'cssColorBorderLight'}],
      // ['io-color-vector', {value: IoThemeSingleton.bind('cssColorBorderLight'), mode: 0}],
      // ['io-item', {label: 'cssColorBorderDark'}],
      // ['io-color-vector', {value: IoThemeSingleton.bind('cssColorBorderDark'), mode: 0}],
      // ['io-item', {label: 'cssColorGradientStart'}],
      // ['io-color-vector', {value: IoThemeSingleton.bind('cssColorGradientStart'), mode: 0}],
      // ['io-item', {label: 'cssColorGradientEnd'}],
      // ['io-color-vector', {value: IoThemeSingleton.bind('cssColorGradientEnd'), mode: 0}],
      // ['io-item', {label: 'cssColorShadow'}],
      // ['io-color-vector', {value: IoThemeSingleton.bind('cssColorShadow'), mode: 0}],

    ]);
  }
}

RegisterIoElement(IoDemoThemeEditor);
