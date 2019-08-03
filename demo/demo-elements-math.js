import {html, IoElement} from "../dist/io.js";

export class IoDemoElementsMath extends IoElement {
  static get Style() {
    return html`<style>
    :host {
      max-width: 32em;
      padding: var(--io-spacing);
      grid-template-columns: auto 1fr !important;
    }
    @media only screen and (max-width: 400px) {
      :host {
        grid-template-columns: 0 1fr !important;
      }
      :host > :nth-child(2n+1) {
        visibility: hidden;
      }
    }
    :host .color-slider {
      height: 5em;
    }
    </style>`;
  }
  static get Properties() {
    return {
      class: 'io-table2',
      mode: 0,
      horizontal: true,
      vector2: [1, 1],
      vector3: [1, 1, 1],
      vector4: [1, 1, 1, 1],
      matrix2: [1, 1, 1, 1],
      matrix3: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      matrix4: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    };
  }
  changed(event) {
    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }

  constructor(props) {
    super(props);
    this.template([
      ['io-item', {label: 'Mode'}],
      ['io-menu-option', {value: this.bind('mode'), options: [
        {label: 'rgb', value: 0},
        {label: 'hsv', value: 1},
        {label: 'hsl', value: 2},
        {label: 'cmyk', value: 3},
      ]}],
      ['io-item', {label: 'Horizontal'}],
      ['io-boolean', {display: 'switch', value: this.bind('horizontal')}],
      ['io-item', {label: 'io-color-panel'}],
      ['io-color-panel', {value: this.vector4, mode: this.bind('mode'), class: 'color-slider'}],
      ['io-item', {label: 'Color Sliders'}],
      ['div', {class: 'io-table4'}, [
        ['io-color-slider-hue', {value: this.vector4, mode: this.bind('mode'), horizontal: this.bind('horizontal'), class: 'color-slider'}],
        ['io-color-slider-saturation', {value: this.vector4, mode: this.bind('mode'), horizontal: this.bind('horizontal'), class: 'color-slider'}],
        ['io-color-slider-value', {value: this.vector4, mode: this.bind('mode'), horizontal: this.bind('horizontal'), class: 'color-slider'}],
        ['io-color-slider-level', {value: this.vector4, mode: this.bind('mode'), horizontal: this.bind('horizontal'), class: 'color-slider'}],
        ['io-color-slider-hs', {value: this.vector4, mode: this.bind('mode'), horizontal: this.bind('horizontal'), class: 'color-slider'}],
        ['io-color-slider-sv', {value: this.vector4, mode: this.bind('mode'), horizontal: this.bind('horizontal'), class: 'color-slider'}],
        ['io-color-slider-sl', {value: this.vector4, mode: this.bind('mode'), horizontal: this.bind('horizontal'), class: 'color-slider'}],
        ['io-color-slider-alpha', {value: this.vector4, mode: this.bind('mode'), horizontal: this.bind('horizontal'), class: 'color-slider'}],
      ]],
      ['io-item', {label: 'io-color-vector (rgba)'}], ['io-color-vector', {mode: 0, value: this.vector4}],
      ['io-item', {label: 'io-color-vector (hsva)'}], ['io-color-vector', {mode: 1, value: this.vector4}],
      ['io-item', {label: 'io-color-vector (hsla)'}], ['io-color-vector', {mode: 2, value: this.vector4}],
      ['io-item', {label: 'io-color-vector (cmyka)'}], ['io-color-vector', {mode: 3, value: this.vector4}],
      ['io-item', {label: 'io-vector (vector2)'}], ['io-vector', {value: this.vector2, linkable: true}],
      ['io-item', {label: 'io-vector (vector3)'}], ['io-vector', {value: this.vector3, linkable: true}],
      ['io-item', {label: 'io-vector (vector4)'}], ['io-vector', {value: this.vector4, linkable: true}],
      ['io-item', {label: 'io-matrix (matrix2)'}], ['io-matrix', {value: this.matrix2, linkable: true}],
      ['io-item', {label: 'io-matrix (matrix3)'}], ['io-matrix', {value: this.matrix3, linkable: true}],
      ['io-item', {label: 'io-matrix (matrix4)'}], ['io-matrix', {value: this.matrix4, linkable: true}],
    ]);
  }
}

IoDemoElementsMath.Register();
