import { IoElement, RegisterIoElement } from '../build/iogui.js';

export class IoDemoElementsVectors extends IoElement {
  static get Properties() {
    return {
      number: 0,
      array2: [0, 1],
      array3: [0, 1, 2],
      array4: [0, 1, 2, 3],
      vector2: {value: {x: 0, y: 1}},
      vector3: {value: {x: 0, y: 1, z: 2}},
      vector4: {value: {x: 0, y: 1, z: 2, w: 3}},
      matrix2: [1, 0, 0, 1],
      matrix3: [1, 0, 0, 0, 1, 0, 0, 0, 1],
      matrix4: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    };
  }
  constructor(props) {
    super(props);
    this.template([
      ['div', [
        ['io-label', {label: 'vector [array2]'}],
        ['io-vector', {value: this.array2}],
      ]],
      ['div', [
        ['io-label', {label: 'vector [array3]'}],
        ['io-vector', {value: this.array3}],
      ]],
      ['div', [
        ['io-label', {label: 'vector [array3][link]'}],
        ['io-vector', {value: this.array3, linkable: true}],
      ]],
      ['div', [
        ['io-label', {label: 'vector [array4]'}],
        ['io-vector', {value: this.array4}],
      ]],
      ['div', [
        ['io-label', {label: 'vector [vector2]'}],
        ['io-vector', {value: this.vector2}],
      ]],
      ['div', [
        ['io-label', {label: 'vector [vector3]'}],
        ['io-vector', {value: this.vector3}],
      ]],
      ['div', [
        ['io-label', {label: 'vector [vector4]'}],
        ['io-vector', {value: this.vector4}],
      ]],
      ['div', [
        ['io-label', {label: 'matrix [matrix2]'}],
        ['io-matrix', {value: this.matrix2}],
      ]],
      ['div', [
        ['io-label', {label: 'matrix [matrix3]'}],
        ['io-matrix', {value: this.matrix3}],
      ]],
      ['div', [
        ['io-label', {label: 'matrix [matrix4]'}],
        ['io-matrix', {value: this.matrix4}],
      ]],
    ]);
  }
}

RegisterIoElement(IoDemoElementsVectors);
