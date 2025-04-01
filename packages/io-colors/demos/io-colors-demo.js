import { Register, IoElement, div } from 'io-gui';
import { ioColorRgba, ioColorSlider } from 'io-colors';

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
      ioColorRgba({value: this.rgba}),
      ioColorRgba({value: this.rgb}),
      ioColorSlider({value: this.rgba, channel: 'r', step: 0.05}),
      ioColorSlider({value: this.rgba, channel: 'g', step: 0.05}),
      ioColorSlider({value: this.rgba, channel: 'b', step: 0.05}),
      ioColorSlider({value: this.rgba, channel: 'a'}),
      ioColorSlider({value: this.rgba, channel: 'h'}),
      ioColorSlider({value: this.rgba, channel: 's'}),
      ioColorSlider({value: this.rgba, channel: 'v'}),
      ioColorSlider({value: this.rgba, channel: 'l'}),
      div({class: 'row'}, [
        ioColorSlider({value: this.rgba, channel: 'hs'}),
        ioColorSlider({value: this.rgba, channel: 'sl', step: 0.1}),
        ioColorSlider({value: this.rgba, vertical: true, channel: 'v'}),
        ioColorSlider({value: this.rgba, vertical: true, channel: 'l'}),
      ]),
      // div({class: 'row'}, [
      //   ioColorPanel({expanded: true, value: this.rgba})
      // ]),
    ]);
  }
}
Register(IoColorsDemo);
export const ioColorsDemo = IoColorsDemo.vDOM;
