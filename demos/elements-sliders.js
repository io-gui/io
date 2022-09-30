import {IoElement, RegisterIoElement} from '../build/iogui.js';
import '../build/iogui.js';

export class IoDemoElementsSliders extends IoElement {
  static get Style() {
    return /* css */`
      :host > div {
        display: flex;
        width: 460px;
        margin: var(--io-spacing) 0;
        padding: var(--io-spacing) 0;
        border: var(--io-border);
        border-color: rgba(128, 128, 128, .125);
      }
      :host > div.tall {
        height: 6em;
      }
      :host > div > :nth-child(1) {
        flex: 0 0 140px;
        text-align: right;
        margin-right: var(--io-spacing);
      }
      :host > div > * {
        margin-left: var(--io-spacing);
      }
      :host > div > io-label,
      :host > div > io-icon {
        margin-top: var(--io-spacing);
      }
    `;
  }
  static get Properties() {
    return {
      number: 0,
      vector2: [0, 1],
    };
  }
  constructor(props) {
    super(props);
    this.template([
      ['div', [
        ['io-label', {label: 'slider'}],
        ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.25}],
      ]],
      ['div', [
        ['io-label', {label: 'slider [exp]'}],
        ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.0000001, exponent: 5}],
      ]],
        ['div', [
          ['io-label', {label: 'number-slider'}],
          ['io-number-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.25}],
        ]],
      ['div', [
        ['io-label', {label: 'slider-range'}],
        ['io-slider-range', {value: this.vector2, min: 0, max: 2, step: 0.25}],
      ]],
      ['div', [
        ['io-label', {label: 'number-slider-range'}],
        ['io-number-slider-range', {value: this.vector2, min: 0, max: 2}],
      ]],
      ['div', {class: 'tall'}, [
        ['io-label', {label: 'sliders [vertical]'}],
        ['io-slider', {value: this.bind('number'), horizontal: false, min: 0, max: 2, step: 0.25}],
        ['io-slider-range', {value: this.bind('vector2'), horizontal: false, min: -1, max: 2, step: 0.25}],
      ]],
    ]);
  }
}

RegisterIoElement(IoDemoElementsSliders);
