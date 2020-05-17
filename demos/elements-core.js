import {IoElement} from '../../iogui/build/io.js';
import '../../iogui/build/io-elements.js';

export class IoDemoElementsCore extends IoElement {
  static get Properties() {
    return {
      string: 'Hello IoGUI!',
      number: 0,
      boolean: false,
    };
  }
  constructor(props) {
    super(props);
    this.template([
      ['div', [
        ['io-string', {value: this.bind('string'), style: {width: '7em'}}],
        ['io-number', {ladder: true, value: this.bind('number'), style: {width: '4em'}}],
        ['io-number', {conversion: 2, value: this.bind('number'), style: {width: '4em'}}],
        ['io-boolicon', {value: this.bind('boolean')}],
        ['io-switch', {value: this.bind('boolean')}],
        ['io-boolean', {value: this.bind('boolean')}],
      ]],
    ]);
  }
}

IoDemoElementsCore.Register();
