import {html, IoElement, IoStorage as $} from "../dist/io.js";

export class IoDemoElementsMath extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        position: relative;
        display: flex;
        flex-direction: column;
        flex: 1 1;
        overflow-x: hidden;

        display: block;
        align-self: stretch;
        justify-self: stretch;
        flex: 1 1 auto;

      }
      /* :host,
      :host > io-selector-tabs {
        display: flex;
        flex: 1 1;
      }
      :host .io-content {
        flex: 1 1 auto;
      }
      :host div {
        display: flex;
        flex: 1 1;
      }
      :host div {
        margin: var(--io-spacing) 0;
      } */
      :host > * {
        overflow: hidden;
        flex: 0 0 auto;
        align-self: stretch;
        width: auto;
      }
      :host .io-column {
        overflow: hidden;
        /* width: 400px; */
        /* flex: 0 0 auto; */
        /* grid-template-columns: auto 1fr; */
      }
      :host .io-column > * {
        width: auto;
      }

    </style>`;
  }
  static get Properties() {
    return {
      vector2: [1, 1],
      vector3: [1, 1, 1],
      vector4: [1, 1, 1, 1],
      matrix2: [1, 1, 1, 1],
      matrix3: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      matrix4: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      color: [],
      rgba: {},
      hsva: {},
      hsla: {},
      cmyka: {},
    };
  }
  changed(event) {
    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }

  constructor(props) {
    super(props);

    this.color = [1.0000, 0.5019, 0.2509, 1];
    this.rgba = {r: 1.0000, g: 0.5019, b: 0.2509, a:1};
    this.hsva = {h: 0.0558, s: 0.7490, v: 1.0000, a:1};
    this.hsla = {h: 0.0558, s: 1.0000, l: 0.6255, a:1};
    this.cmyka = {c: 0, m: 0.4980, y: 0.7490, k: 0, a:1};

    const color = ['div', {name: 'color', class: 'io-column'}, [
      ['div', {class: 'io-column colors'}, [
        ['io-object', {label: 'Color Array (rgba)', value: this.bind('color')}],
        ['io-color-panel', {value: this.bind('color')}],
        ['io-color-vector', {value: this.bind('color')}],
        ['div', {class: 'io-row'}, [
          ['io-color-slider-hue', {value: this.bind('color')}],
          ['io-color-slider-saturation', {value: this.bind('color')}],
          ['io-color-slider-value', {value: this.bind('color')}],
          ['io-color-slider-level', {value: this.bind('color')}],
          ['io-color-slider-hs', {value: this.bind('color')}],
          ['io-color-slider-sv', {value: this.bind('color')}],
          ['io-color-slider-sl', {value: this.bind('color')}],
          ['io-color-slider-alpha', {value: this.bind('color')}],
        ]],
        ['io-object', {label: 'Color Object (rgba)', value: this.bind('rgba')}],
        ['io-color-panel', {value: this.bind('rgba')}],
        ['io-color-vector', {value: this.bind('rgba')}],
        ['div', {class: 'io-row'}, [
          ['io-color-slider-hue', {value: this.bind('rgba')}],
          ['io-color-slider-saturation', {value: this.bind('rgba')}],
          ['io-color-slider-value', {value: this.bind('rgba')}],
          ['io-color-slider-level', {value: this.bind('rgba')}],
          ['io-color-slider-hs', {value: this.bind('rgba')}],
          ['io-color-slider-sv', {value: this.bind('rgba')}],
          ['io-color-slider-sl', {value: this.bind('rgba')}],
          ['io-color-slider-alpha', {value: this.bind('rgba')}],
        ]],
        ['io-object', {label: 'Color Object (hsva)', value: this.bind('hsva')}],
        ['io-color-panel', {value: this.bind('hsva')}],
        ['io-color-vector', {value: this.bind('hsva')}],
        ['div', {class: 'io-row'}, [
          ['io-color-slider-hue', {value: this.bind('hsva')}],
          ['io-color-slider-saturation', {value: this.bind('hsva')}],
          ['io-color-slider-value', {value: this.bind('hsva')}],
          ['io-color-slider-level', {value: this.bind('hsva')}],
          ['io-color-slider-hs', {value: this.bind('hsva')}],
          ['io-color-slider-sv', {value: this.bind('hsva')}],
          ['io-color-slider-sl', {value: this.bind('hsva')}],
          ['io-color-slider-alpha', {value: this.bind('hsva')}],
        ]],
        ['io-object', {label: 'Color Object (hsla)', value: this.bind('hsla')}],
        ['io-color-panel', {value: this.bind('hsla')}],
        ['io-color-vector', {value: this.bind('hsla')}],
        ['div', {class: 'io-row'}, [
          ['io-color-slider-hue', {value: this.bind('hsla')}],
          ['io-color-slider-saturation', {value: this.bind('hsla')}],
          ['io-color-slider-value', {value: this.bind('hsla')}],
          ['io-color-slider-level', {value: this.bind('hsla')}],
          ['io-color-slider-hs', {value: this.bind('hsla')}],
          ['io-color-slider-sv', {value: this.bind('hsla')}],
          ['io-color-slider-sl', {value: this.bind('hsla')}],
          ['io-color-slider-alpha', {value: this.bind('hsla')}],
        ]],
        ['io-object', {label: 'Color Object (cmyka)', value: this.bind('cmyka')}],
        ['io-color-panel', {value: this.bind('cmyka')}],
        ['io-color-vector', {value: this.bind('cmyka')}],
        ['div', {class: 'io-row'}, [
          ['io-color-slider-hue', {value: this.bind('cmyka')}],
          ['io-color-slider-saturation', {value: this.bind('cmyka')}],
          ['io-color-slider-value', {value: this.bind('cmyka')}],
          ['io-color-slider-level', {value: this.bind('cmyka')}],
          ['io-color-slider-hs', {value: this.bind('cmyka')}],
          ['io-color-slider-sv', {value: this.bind('cmyka')}],
          ['io-color-slider-sl', {value: this.bind('cmyka')}],
          ['io-color-slider-alpha', {value: this.bind('cmyka')}],
        ]],
      ]],
    ]];

    this.template([
      ['io-element-demo', {element: 'io-color-vector'}],
      ['io-element-demo', {element: 'io-color-vector'}],
      ['io-element-demo', {element: 'io-color-vector'}],
      ['io-element-demo', {element: 'io-color-vector'}],
      ['io-element-demo', {element: 'io-color-vector'}],
      ['io-element-demo', {element: 'io-color-vector'}],
      ['io-element-demo', {element: 'io-color-vector'}],
      // ['io-selector-tabs', {precache: true, selected: $('demoelementsmath', 'vectors'),
      //   elements: [
      //     ['div', {name: 'vectors', class: 'io-table2'}, [
            // ['io-item', 'io-vector (vector2)'], ['io-vector', {value: this.vector2, linkable: true}],
            // ['io-item', 'io-vector (vector3)'], ['io-vector', {value: this.vector3, linkable: true}],
            // ['io-item', 'io-vector (vector4)'], ['io-vector', {value: this.vector4, linkable: true}],
            // ['io-item', 'io-matrix (matrix2)'], ['io-matrix', {value: this.matrix2, linkable: true}],
            // ['io-item', 'io-matrix (matrix3)'], ['io-matrix', {value: this.matrix3, linkable: true}],
            // ['io-item', 'io-matrix (matrix4)'], ['io-matrix', {value: this.matrix4, linkable: true}],
      //     ]],
          // ['div', {name: 'color-vectors', class: 'io-column'}, [

            // ['io-item', {label: 'io-vector (color array)'}], ['io-vector', {value: this.color}],
            // ['io-item', {label: 'io-color-vector (color)'}], ['io-color-vector', {value: this.color}],
            // ['io-item', {label: 'io-color-vector (rgba)'}], ['io-color-vector', {value: this.rgba}],
            // ['io-item', {label: 'io-color-vector (hsva)'}], ['io-color-vector', {value: this.hsva}],
            // ['io-item', {label: 'io-color-vector (hsla)'}], ['io-color-vector', {value: this.hsla}],
            // ['io-item', {label: 'io-color-vector (cmyka)'}], ['io-color-vector', {value: this.cmyka}],
          // ]],
      //     ['div', {name: 'color-sliders', class: 'io-table4'}, [
      //       // ['io-color-panel', {value: this.bind('color')}],
      //       // ['io-color-vector', {value: this.bind('color')}],
      //       // ['div', {class: 'io-row'}, [
      //         ['io-color-slider-hue', {value: this.bind('color')}],
      //         ['io-color-slider-saturation', {value: this.bind('color')}],
      //         ['io-color-slider-value', {value: this.bind('color')}],
      //         ['io-color-slider-level', {value: this.bind('color')}],
      //         ['io-color-slider-hs', {value: this.bind('color')}],
      //         ['io-color-slider-sv', {value: this.bind('color')}],
      //         ['io-color-slider-sl', {value: this.bind('color')}],
      //         ['io-color-slider-alpha', {value: this.bind('color')}],
      //       // ]],
      //     ]],
      //   ]
      // }]
    ]);
  }
}

IoDemoElementsMath.Register();
