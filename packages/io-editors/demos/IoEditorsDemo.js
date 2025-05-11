import { Register, IoElement, div } from 'io-gui';
import { MenuOptions, ioOptionMenu } from 'io-menus';
import { ioPropertyEditor, ioObject, ioVector, ioMatrix, ioInspector } from 'io-editors';
import { ioSlider } from 'io-sliders';
import { ioString, ioNumber } from 'io-inputs';
export class IoEditorsDemo extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: row;
        margin: var(--io_spacing2);
      }
      :host > .column {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin: 0;
        margin-bottom: var(--io_lineHeight);
        margin-left: var(--io_lineHeight);
      }
      :host .column {
        flex-direction: column;
      }
      :host > .column > * {
        margin-bottom: var(--io_lineHeight);
      }
      :host io-property-editor.array {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 0;
        max-width: 20rem;
      }
      :host io-property-editor.array > .row {
        padding: 0;
        margin: 0;
        margin: var(--io_spacing) var(--io_spacing) 0 0;
      }
    `;
  }
  static get ReactiveProperties() {
    return {
      object: {value: {
        number: 0.5,
        string: 'hello',
        boolean: true,
        object: {
          name: 'nested object',
          number: 1,
          string: 'world',
          object: {
            name: 'another nested object',
            mixedArray: [false, 2, 'three'],
            object: {
              name: 'the last object',
              boolean: true,
            },
          },
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
      ioInspector({
        value: this.object,
        // TODO: this.object.object displays broken "number" slider. Investigate!
        groups: new Map([
          [Object, {
            'Object Properties': ['object', 'array', 'mixedArray'],
            'Vectors and Matrices': [/vector/i, /matrix/i],
          }],
        ]),
        config: new Map([
          [Object, [
            [Number, ioSlider({step: 0.1})],
            [Array, ioPropertyEditor({labeled: false, class: 'array', config: new Map([
              [Array, [
                [Number, ioNumber({live: true})],
              ]]
            ])})],
            ['vector2', ioVector({linkable: true})],
            ['vector3', ioVector({linkable: true})],
            ['vector4', ioVector({linkable: true})],
            ['matrix2', ioMatrix()],
            ['matrix3', ioMatrix()],
            ['matrix4', ioMatrix()],
          ]]
        ]),
      }),
      div({class: 'column'}, [
        ioPropertyEditor({
          value: this.object,
          properties: ['number', 'string', 'boolean', 'object'],
          config: new Map([
            [Object, [
              [String, ioString({live: true})],
              [Number, ioNumber({live: true})],
            ]]
          ]),
        }),
        ioPropertyEditor({
          value: this.object,
          style: {width: '10rem'},
          properties: ['number', 'string', 'boolean'],
          config: new Map([
            [Object, [
              [String, ioString({live: true})],
              [Number, ioSlider({step: 0.1})],
            ]]
          ]),
        }),
        ioPropertyEditor({
          value: this.object,
          properties: ['number', 'string'],
          // widget: IoField({label: 'Widget Element'}),
          config: new Map([
            [Object, [
              [String, ioString({live: true})],
              [Number, ioOptionMenu({options: new MenuOptions().fromJSON([
                {label: 'zero', value: 0},
                {label: 'half', value: 0.5},
                {label: 'one', value: 1},
              ])})],
            ]]
          ]),
        }),
      ]),
      div({class: 'column'}, [
        ioObject({
          value: this.object,
          expanded: true,
          // widget: IoField({label: 'Widget Element'}),
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
        ioObject({
          value: this.object,
          label: 'Object (All Properties)',
          config: new Map([
            [Object, [
              [Array, ioPropertyEditor({labeled: false, class: 'array'})],
              ['vector2', ioPropertyEditor({labeled: false, class: 'array'})],
              ['vector3', ioPropertyEditor({labeled: false, class: 'array'})],
              ['vector4', ioPropertyEditor({labeled: false, class: 'array'})],
              ['matrix2', ioPropertyEditor({labeled: false, class: 'array'})],
              ['matrix3', ioPropertyEditor({labeled: false, class: 'array'})],
              ['matrix4', ioPropertyEditor({labeled: false, class: 'array'})],
            ]]
          ]),
        }),
      ]),
    ]);
  }
}
Register(IoEditorsDemo);
export const ioEditorsDemo = IoEditorsDemo.vConstructor;
