import { IoElement, RegisterIoElement } from '../build/iogui.js';

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
        height: calc(var(--io-field-height) * 4);
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
      array2: [0, 1],
      array3: [0, 1, 2],
      array4: [0, 1, 2, 3],
      vector2: {value: {x: 0, y: 1}},
      vector3: {value: {x: 0, y: 1, z: 2}},
      vector4: {value: {x: 0, y: 1, z: 2, w: 3}},
    };
  }
  constructor(props) {
    super(props);
    this.template([
      ['div', [
        ['io-label', {label: 'slider'}],
        ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.1}],
      ]],
      ['div', [
        ['io-label', {label: 'slider [exp]'}],
        ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.05, exponent: 3}],
      ]],
      ['div', [
        ['io-label', {label: 'slider [exp]'}],
        ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.05, exponent: 0.3}],
      ]],
      ['div', [
        ['io-label', {label: 'slider [exp][inv]'}],
        ['io-slider', {value: this.bind('number'), min: 2, max: 0, step: 0.05, exponent: 0.3}],
      ]],
      ['div', [
        ['io-label', {label: 'number-slider'}],
        ['io-number-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.1}],
      ]],
      ['div', [
        ['io-label', {label: 'slider-range'}],
        ['io-slider-range', {value: this.array2, min: 0, max: 2, step: 0.1}],
      ]],
      ['div', [
        ['io-label', {label: 'slider-range [exp]'}],
        ['io-slider-range', {value: this.array2, min: 0, max: 2, step: 0.05, exponent: 3}],
      ]],
      ['div', [
        ['io-label', {label: 'slider-range [exp]'}],
        ['io-slider-range', {value: this.array2, min: 0, max: 2, step: 0.05, exponent: 0.3}],
      ]],
      ['div', [
        ['io-label', {label: 'number-slider-range'}],
        ['io-number-slider-range', {value: this.array2, min: 0, max: 2, step: 0.1}],
      ]],
      ['div', {class: 'tall'}, [
        ['io-label', {label: 'sliders [vertical]'}],
        ['io-slider', {value: this.bind('number'), vertical: true, min: -2, max: 2, step: 0.2}],
        ['io-slider', {value: this.bind('number'), vertical: true, min: 2, max: -2, step: 0.2}],
        ['io-slider-range', {value: this.array2, vertical: true, min: 0, max: 2, step: 0.1}],
        ['io-slider-range', {value: this.array2, vertical: true, min: 2, max: 0, step: 0.1}],
      ]],
      ['div', {class: 'tall'}, [
        ['io-label', {label: 'sliders2d'}],
        ['io-slider-2d', {value: this.bind('array2'), min: [-3, -1], max: [2, 4], step: [0.5, 0.5]}],
      ]],
      ['div', {class: 'tall'}, [
        ['io-label', {label: 'sliders2d'}],
        ['io-slider-2d', {value: this.bind('array2'), min: [2, 4], max: [-3, -1], step: [0.5, 0.5], vertical: false}],
        ['io-slider-2d', {value: this.bind('array2'), min: [2, 4], max: [-3, -1], step: [0.5, 0.5], vertical: true}],
        ['io-slider-2d', {value: this.bind('array2'), min: [-3, -1], max: [2, 4], step: [0.5, 0.5], vertical: true}],
      ]],
    ]);
  }
}

RegisterIoElement(IoDemoElementsSliders);
