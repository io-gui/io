import { IoElement, RegisterIoElement } from '../build/iogui.js';

export class IoDemoElementsSliders extends IoElement {
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
        ['io-label', {label: 'slider [alt]'}],
        ['io-slider', {value: this.bind('number'), min: -0.3, max: 2, step: 1}],
      ]],
      ['div', [
        ['io-label', {label: 'slider [alt]'}],
        ['io-slider', {value: this.bind('number'), min: 0, max: 2.3, step: 1}],
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
        ['io-label', {label: 'slider-2d + [vert]'}],
        ['io-slider-2d', {value: this.bind('array2'), min: [-6, -2.5], max: [4.2, 8], step: [1, 1]}],
        ['io-slider-2d', {value: this.bind('array2'), min: [-6, -2.5], max: [4.2, 8], step: [1, 1], vertical: true}],
        ['io-slider', {value: this.bind('number'), vertical: true, min: -2, max: 2, step: 0.2}],
        ['io-slider-range', {value: this.array2, vertical: true, min: 0, max: 2, step: 0.1}],
      ]],
      ['div', {class: 'tall'}, [
        ['io-label', {label: 'sliders [inv][vert]'}],
        ['io-slider-2d', {value: this.bind('array2'), min: [4.2, 8], max: [-6, -2.5], step: [1, 1]}],
        ['io-slider-2d', {value: this.bind('array2'), min: [4.2, 8], max: [-6, -2.5], step: [1, 1], vertical: true}],
        ['io-slider', {value: this.bind('number'), vertical: true, min: 2, max: -2, step: 0.2}],
        ['io-slider-range', {value: this.array2, vertical: true, min: 2, max: 0, step: 0.1}],
      ]],
    ]);
  }
}

RegisterIoElement(IoDemoElementsSliders);
