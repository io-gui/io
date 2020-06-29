import {IoElement} from '../build/iogui.js';
import '../build/iogui.js';

export class IoDemoElementsSliders extends IoElement {
  static get Properties() {
    return {
      number: 0,
      vector2: [0, 1],
    };
  }
  constructor(props) {
    super(props);
    this.template([
      ['div', {class: 'io-row'}, [
        ['io-slider', {value: this.bind('number'), horizontal: false, min: 0, max: 2, step: 0.25}],
        ['io-slider-range', {value: this.bind('vector2'), horizontal: false, min: -1, max: 2, step: 0.25}],
        ['div', {class: 'io-column'}, [
          ['io-slider', {value: this.bind('number'), min: -2, max: 2, step: 0.1, exponent: 3}],
          ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 1}],
          ['io-slider', {value: this.bind('number'), min: -1.33, max: 3.5, step: 0.8}],
          ['io-number-slider', {value: this.bind('number'), min: -0.25, max: 0.25, step: 0.01, exponent: 0.25}],
          ['io-slider-range', {value: this.bind('vector2'), min: -10, max: 10, step: 1, exponent: 0.5}],
          ['io-number-slider-range', {value: this.bind('vector2'), min: -10, max: 10, step: 1}],
        ]],
      ]],
    ]);
  }
}

IoDemoElementsSliders.Register();
