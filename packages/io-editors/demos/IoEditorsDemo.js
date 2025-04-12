import { Register, IoElement, div } from 'io-gui';
import { MenuOptions, ioOptionMenu } from 'io-menus';
import { ioPropertyEditor, ioObject, ioVector, ioMatrix, ioInspector } from 'io-editors';
import { ioSlider } from 'io-sliders';

export class IoEditorsDemo extends IoElement {
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
      :host > .row > io-property-editor > .io-row > io-text {
        min-width: 5em;
        text-align: right;
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
      div({class: 'row'}, [
        ioPropertyEditor({
          value: this.object,
        }),
        ioPropertyEditor({
          value: this.object,
          config: new Map([
            [Object, [
              [Number, ioSlider({step: 0.1})],
              ['vector2', ioVector()],
              ['vector3', ioVector()],
              ['vector4', ioVector()],
              ['matrix2', ioMatrix()],
              ['matrix3', ioMatrix()],
              ['matrix4', ioMatrix()],
            ]]
          ]),
        }),
        ioPropertyEditor({
          value: this.object,
          properties: ['number', 'string', 'boolean'],
          // widget: ioInputBase({label: 'Widget Element'}),
          config: new Map([
            [Object, [
              [Number, ioOptionMenu({options: new MenuOptions().fromJSON([
                {label: 'zero', value: 0},
                {label: 'half', value: 0.5},
                {label: 'one', value: 1},
              ])})],
            ]]
          ]),
        }),
      ]),
      div({class: 'row'}, [
        ioObject({
          value: this.object,
        }),
        ioObject({
          value: this.object,
          expanded: true,
          // widget: ioInputBase({label: 'Widget Element'}),
          properties: ['number', 'string', 'boolean'],
        }),
        ioObject({
          value: this.object,
          expanded: true,
          properties: ['number'],
          config: new Map([
            [Number, ioSlider({step: 0.1})],
          ]),
        }),
      ]),
      div({class: 'row'}, [
        ioInspector({
          value: this.object,
          // TODO: this.object.object displays broken "number" slider. Investigate!
          groups: {
            'Object|properties': ['number', 'string', 'boolean', 'object', 'array'],
            'Object|vectors and matrices': [/vector/i, /matrix/i],
          },
          config: new Map([
            [Object, [
              ['vector2', ioVector({linkable: true})],
              ['vector3', ioVector({linkable: true})],
              ['vector4', ioVector({linkable: true})],
              ['matrix2', ioMatrix()],
              ['matrix3', ioMatrix()],
              ['matrix4', ioMatrix()],
              [Number, ioSlider({step: 0.1})],
            ]]
          ]),
        }),
      ]),
    ]);
  }
}
Register(IoEditorsDemo);
export const ioEditorsDemo = IoEditorsDemo.vConstructor;
