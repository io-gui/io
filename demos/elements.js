import {IoElement, RegisterIoElement} from '../build/iogui.js';
import '../build/iogui.js';
import './elements-core.js';
import './elements-sliders.js';
import './elements-math.js';
import './elements-object.js';
import './elements-color.js';
import './elements-menus.js';

export class IoDemoElements extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        padding: var(--io-spacing);
      }
    `;
  }
  static get Properties() {
    return {
      string: 'Hello IoGUI!',
      number: 1,
      boolean: false,
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
      ['io-demo-elements-core', {
        string: this.bind('string'),
        number: this.bind('number'),
        boolean: this.bind('boolean'),
      }],
      // ['io-demo-elements-sliders', {
      //   number: this.bind('number'),
      //   vector2: this.bind('vector2'),
      // }],
      // ['io-demo-elements-menus', {
      //   number: this.bind('number'),
      // }],
      // ['io-demo-elements-object'],
      // ['io-demo-elements-math', {
      //   number: this.bind('number'),
      //   vector2: this.bind('vector2'),
      //   vector3: this.bind('vector3'),
      //   vector4: this.bind('vector4'),
      //   matrix2: this.bind('matrix2'),
      //   matrix3: this.bind('matrix3'),
      //   matrix4: this.bind('matrix4'),
      // }],
      // ['io-demo-elements-color', {
      //   vector3: this.bind('vector3'),
      //   vector4: this.bind('vector4'),
      // }],
    ]);
  }
}

RegisterIoElement(IoDemoElements);
