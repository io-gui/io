import { IoElement, RegisterIoElement } from '../build/iogui.js';

import '../build/iogui.js';
import './elements-core.js';
import './elements-sliders.js';
// import './elements-menus.js';
// import './elements-object.js';
import './elements-vectors.js';
import './elements-color.js';

export class IoDemoElements extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
      }
      :host > * > div {
        display: flex;
        /* width: 425px; */
        margin: var(--io-spacing) 0;
        padding: var(--io-spacing) 0;
        border: var(--io-border);
        border-color: rgba(128, 128, 128, .125);
      }
      :host > * > div.tall {
        height: var(--io-field-height4);
      }
      :host > * > div > :nth-child(1) {
        flex: 0 0 140px;
        text-align: right;
        margin-right: var(--io-spacing);
      }
      :host > * > div > * {
        margin-left: var(--io-spacing);
      }
      :host > * > div > io-label,
      :host > * > div > io-icon {
        margin-top: var(--io-spacing);
      }
    `;
  }
  static get Properties() {
    return {
      string: 'Hello IoGUI!',
      number: 1,
      boolean: false,
      array2: [0, 1],
      array3: [0, 1, 2],
      array4: [0, 1, 2, 3],
      vector2: {value: {x: 0, y: 1}},
      vector3: {value: {x: 0, y: 1, z: 2}},
      vector4: {value: {x: 0, y: 1, z: 2, w: 3}},
      rgb: {value: {r: 0, g: 1, b: 0.5}},
      rgba: {value: {r: 1, g: 0.5, b: 1, a: 1}},
      matrix2: [1, 0, 0, 1],
      matrix3: [1, 0, 0, 0, 1, 0, 0, 0, 1],
      matrix4: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    };
  }
  constructor(props) {
    super(props);
    this.template([
      ['io-demo-elements-core', {
        string: this.bind('string'),
        number: this.bind('number'),
        boolean: this.bind('boolean'),
      }],
      ['io-demo-elements-sliders', {
        number: this.bind('number'),
        array2: this.bind('array2'),
        array3: this.bind('array3'),
        array4: this.bind('array4'),
        vector2: this.bind('vector2'),
        vector3: this.bind('vector3'),
        vector4: this.bind('vector4'),
      }],
      // ['io-demo-elements-menus', {
      //   number: this.bind('number'),
      // }],
      // ['io-demo-elements-object'],
      ['io-demo-elements-color', {
        rgb: this.bind('rgb'),
        rgba: this.bind('rgba'),
      }],
      ['io-demo-elements-vectors', {
        number: this.bind('number'),
        array2: this.bind('array2'),
        array3: this.bind('array3'),
        array4: this.bind('array4'),
        vector2: this.bind('vector2'),
        vector3: this.bind('vector3'),
        vector4: this.bind('vector4'),
        matrix2: this.bind('matrix2'),
        matrix3: this.bind('matrix3'),
        matrix4: this.bind('matrix4'),
      }],
    ]);
  }
}

RegisterIoElement(IoDemoElements);
