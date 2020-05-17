import {IoElement} from '../../iogui/build/io.js';
import '../../iogui/build/io-elements.js';

export class IoDemoElementsMath extends IoElement {
  static get Properties() {
    return {
      number: 0,
      vector2: [0, 1],
      vector3: [0, 1, 2],
      vector4: [0, 1, 2, 3],
      matrix2: [1, 0, 0, 1],
      matrix3: [1, 0, 0, 0, 1, 0, 0, 0, 1],
      matrix4: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    };
  }
  constructor(props) {
    super(props);
    this.template([
      ['div', {class: 'io-column'}, [
        ['io-number-slider-range', {value: this.bind('vector2'), min: -1, max: 2, step: 0.05}],
        ['io-vector', {value: this.bind('vector2'), linkable: true}],
        ['io-vector', {value: this.bind('vector3'), linkable: true}],
        ['io-vector', {value: this.bind('vector4'), linkable: true}],
        ['io-matrix', {value: this.bind('matrix2')}],
        ['io-matrix', {value: this.bind('matrix3')}],
        ['io-matrix', {value: this.bind('matrix4')}],
      ]],
    ]);
  }
}

IoDemoElementsMath.Register();
