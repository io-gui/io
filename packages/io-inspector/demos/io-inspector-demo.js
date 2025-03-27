import { Register, IoElement } from 'io-gui';
import { MenuOptions } from 'io-menus';
import 'io-inspector';

export class IoInspectorDemo extends IoElement {
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
      object: {value: {
        number: 0.5,
        string: 'hello',
        boolean: true,
        object: {
          prop1: 1,
          prop2: 2,
        },
        array: [...Array(32).keys()],
        vector2: [0, 1],
        vector3: [0, 1, 2],
        vector4: [0, 1, 2, 3],
        matrix2: [1, 0, 0, 1],
        matrix3: [1, 0, 0, 0, 1, 0, 0, 0, 1],
        matrix4: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      }}
    };
  }
  init() {
    this.template([
      ['div', {class: 'row'}, [
        ['io-properties', {
          value: this.object,
        }],
        ['io-properties', {
          value: this.object,
          config: {
            'number': ['io-slider', {step: 0.1}],
            'vector2': ['io-vector'],
            'vector3': ['io-vector'],
            'vector4': ['io-vector'],
            'matrix2': ['io-matrix'],
            'matrix3': ['io-matrix'],
            'matrix4': ['io-matrix'],
          },
        }],
        ['io-properties', {
          value: this.object,
          properties: ['number', 'string', 'boolean'],
          widget: ['io-field', {label: 'Widget Element'}],
          // TODO: investigate listener warning
          config: {
            'boolean': ['io-switch'],
            'number': ['io-option-menu', {options: new MenuOptions([
              {label: 'zero', value: 0},
              {label: 'half', value: 0.5},
              {label: 'one', value: 1},
            ])}],
          },
        }],
      ]],
      ['div', {class: 'row'}, [
        ['io-object', {
          value: this.object,
        }],
        ['io-object', {
          value: this.object,
          expanded: true,
          widget: ['io-field', {label: 'Widget Element'}],
          properties: ['number', 'string', 'boolean'],
        }],
        ['io-object', {
          value: this.object,
          expanded: true,
          properties: ['number'],
          config: {'number': ['io-slider', {step: 0.1}]}
        }],
      ]],
      ['div', {class: 'row'}, [
        ['io-inspector', {
          value: this.object,
          // TODO: this.object.object displays broken "number" slider. Investigate!
          groups: {
            'Object|properties': ['number', 'string', 'boolean', 'object', 'array'],
            'Object|vectors and matrices': [/vector/i, /matrix/i],
          },
          config: {
            'vector2': ['io-vector', {linkable: true}],
            'vector3': ['io-vector', {linkable: true}],
            'vector4': ['io-vector', {linkable: true}],
            'matrix2': ['io-matrix'],
            'matrix3': ['io-matrix'],
            'matrix4': ['io-matrix'],
            'number': ['io-slider', {step: 0.1}],
          },
        }],
      ]],
    ]);
  }
}

Register(IoInspectorDemo);
