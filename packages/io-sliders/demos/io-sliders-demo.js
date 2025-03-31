import { Register, IoElement } from 'io-gui';
import 'io-sliders';

export class IoSlidersDemo extends IoElement {
  static get Style() {
    return /* css */`
      :host .row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        overflow: hidden;
        margin-bottom: var(--io_spacing);
      }
      :host .row > *:not(:last-child) {
        margin-right: var(--io_spacing);
      }
    `;
  }
  static get Properties() {
    return {
      number: 1,
      array2: [0, 1],
    };
  }
  init() {
    this.template([
      ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.1}],
      ['io-slider', {value: this.bind('number'), min: -1.3, max: 3, step: 1}],
      ['io-slider', {value: this.bind('number'), min: 0, max: 4.3, step: 1}],
      ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.1, exponent: 3}],
      ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.01, exponent: 5}],
      ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.1, exponent: 0.3}],
      ['io-slider', {value: this.bind('number'), min: 2, max: 0, step: 0.1, exponent: 0.1}],
      ['io-slider-range', {value: this.array2, min: 0, max: 2, step: 0.1}],
      ['io-slider-range', {value: this.array2, min: 0, max: 2, step: 0.05, exponent: 3}],
      ['io-slider-range', {value: this.array2, min: 0, max: 2, step: 0.05, exponent: 0.3}],
      ['io-number-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.1}],
      ['io-number-slider-range', {value: this.array2, min: 0, max: 2, step: 0.1}],
      ['div', {class: 'row'}, [
        ['io-slider-2d', {value: this.bind('array2'), min: [-6, -2.5], max: [4.2, 8], step: [1, 1]}],
        ['io-slider-2d', {value: this.bind('array2'), min: [-6, -2.5], max: [4.2, 8], step: [1, 1], vertical: true}],
        ['io-slider', {value: this.bind('number'), vertical: true, min: -2, max: 2, step: 0.02, exponent: 5.5}],
        ['io-slider-range', {value: this.array2, vertical: true, min: 0, max: 2, step: 0.1}],
      ]],
      ['div', {class: 'row'}, [
        ['io-slider-2d', {value: this.bind('array2'), min: [4.2, 8], max: [-6, -2.5], step: [1, 1]}],
        ['io-slider-2d', {value: this.bind('array2'), min: [4.2, 8], max: [-6, -2.5], step: [1, 1], vertical: true}],
        ['io-slider', {value: this.bind('number'), vertical: true, min: 2, max: -2, step: 0.2}],
        ['io-slider-range', {value: this.array2, vertical: true, min: 2, max: 0, step: 0.1}],
      ]],
    ]);
  }
}

Register(IoSlidersDemo);

export const ioSlidersDemo = IoSlidersDemo.vDOM;
