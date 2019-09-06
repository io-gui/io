import {IoElement} from "../../io.js";

export class IoDemoMath extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      max-width: 32em;
      padding: var(--io-spacing);
      grid-template-columns: auto 1fr !important;
    }
    :host > :nth-child(2n+1) {
      text-align: right;
    }
    @media only screen and (max-width: 400px) {
      :host {
        grid-template-columns: 0 1fr !important;
      }
      :host > :nth-child(2n+1) {
        visibility: hidden;
      }
    }
    `;
  }
  static get Properties() {
    return {
      class: 'io-table2',
      vector2: [1, 1],
      vector3: [1, 1, 1],
      vector4: [1, 1, 1, 1],
      matrix2: [1, 1, 1, 1],
      matrix3: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      matrix4: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    };
  }
  changed() {
    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }
  constructor(props) {
    super(props);
    this.template([
      ['io-item', {label: 'io-vector (vector2)'}], ['io-vector', {value: this.vector2, linkable: true}],
      ['io-item', {label: 'io-vector (vector3)'}], ['io-vector', {value: this.vector3, linkable: true}],
      ['io-item', {label: 'io-vector (vector4)'}], ['io-vector', {value: this.vector4, linkable: true}],
      ['io-item', {label: 'io-matrix (matrix2)'}], ['io-matrix', {value: this.matrix2, linkable: true}],
      ['io-item', {label: 'io-matrix (matrix3)'}], ['io-matrix', {value: this.matrix3, linkable: true}],
      ['io-item', {label: 'io-matrix (matrix4)'}], ['io-matrix', {value: this.matrix4, linkable: true}],
    ]);
  }
}

IoDemoMath.Register();
