import { Register, IoElement } from 'io-gui';
import 'io-colors';
import 'io-inputs';

export class IoColorsDemo extends IoElement {
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
      rgb: {value: {r: 0, g: 1, b: 0.5}},
      rgba: {value: {r: 1, g: 0.5, b: 1, a: 1}},
    };
  }
  init() {
    this.template([
      ['io-color-rgba', {value: this.rgba}],
      ['io-color-rgba', {value: this.rgb}],
      ['io-color-slider', {value: this.rgba, channel: 'r', step: 0.05}],
      ['io-color-slider', {value: this.rgba, channel: 'g', step: 0.05}],
      ['io-color-slider', {value: this.rgba, channel: 'b', step: 0.05}],
      ['io-color-slider', {value: this.rgba, channel: 'a'}],
      ['io-color-slider', {value: this.rgba, channel: 'h'}],
      ['io-color-slider', {value: this.rgba, channel: 's'}],
      ['io-color-slider', {value: this.rgba, channel: 'v'}],
      ['io-color-slider', {value: this.rgba, channel: 'l'}],
      ['div', {class: 'row'}, [
        ['io-color-slider', {value: this.rgba, channel: 'hs'}],
        ['io-color-slider', {value: this.rgba, channel: 'sl', step: 0.1}],
        ['io-color-slider', {value: this.rgba, vertical: true, channel: 'v'}],
        ['io-color-slider', {value: this.rgba, vertical: true, channel: 'l'}],          
      ]],
      ['div', {class: 'row'}, [
        ['io-color-panel', {expanded: true, value: this.rgba}]
      ]],
    ]);
  }
}

Register(IoColorsDemo);

export const ioColorsDemo = IoColorsDemo._vDOMFactory;
