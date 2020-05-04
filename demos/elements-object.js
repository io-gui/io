import {IoElement} from '../../io/build/io.js';
import '../../io/build/io-elements.js';

export class IoDemoElementsObject extends IoElement {
  static get Properties() {
    return {
      object: {
        value: {
          number: 0.5,
          string: 'hello',
          boolean: true,
          object: {
            prop1: 1,
            prop2: 2,
          },
          array: [...Array(32).keys()],
        }
      } 
    };
  }
  constructor(props) {
    super(props);
    this.template([
      ['io-properties', {value: this.object, properties: ['number', 'string', 'boolean']}],
      ['io-object', {
        value: this.object,
        expanded: true,
        slotted: ['io-item', {label: 'Slotted Element'}],
        properties: ['number', 'string', 'boolean']
      }],
      ['io-object', {value: this.object, expanded: true, properties: ['number'], config: {'number': ['io-slider', {step: 0.1}]}}],
      ['io-inspector', {
        value: this.object,
        expanded: ['properties'],
        groups: {
          'Object|properties': [],
          'Object|vectors and matrices': [/vector/i, /matrix/i],
        },
        config: {
          // 'vector2': ['io-vector', {linkable: true}],
          // 'vector3': ['io-vector', {linkable: true}],
          // 'vector4': ['io-vector', {linkable: true}],
          // 'matrix2': ['io-matrix'],
          // 'matrix3': ['io-matrix'],
          // 'matrix4': ['io-matrix'],
          'number': ['io-slider', {step: 0.1}],
        },
      }],
    ]);
  }
}

IoDemoElementsObject.Register();
