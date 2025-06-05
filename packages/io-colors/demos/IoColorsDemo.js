import { Register, IoElement, div } from 'io-gui';
import { ioColorRgba, ioColorSlider } from 'io-colors';

export class IoColorsDemo extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        margin: var(--io_spacing2);
      }
      :host .row,
      :host .column {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: var(--io_spacing);
        margin: var(--io_spacing);
        margin-bottom: 0;
        background-color: var(--io_bgColorDimmed);
      }
      :host .column {
        flex-direction: column;
      }
      :host .row > * {
        margin-right: var(--io_spacing3);
      }
    `;
  }
  static get ReactiveProperties() {
    return {
      rgb: {value: {r: 0, g: 1, b: 0.5}},
      rgba: {value: {r: 1, g: 0.5, b: 1, a: 1}},
    };
  }
  init() {
    this.render([
      div({class: 'column'}, [
        ioColorRgba({value: this.rgba}),
        ioColorRgba({value: this.rgb}),
      ]),
      div({class: 'column'}, [
        ioColorSlider({value: this.rgba, channel: 'r', step: 0.05}),
        ioColorSlider({value: this.rgba, channel: 'g', step: 0.05}),
        ioColorSlider({value: this.rgba, channel: 'b', step: 0.05}),
        ioColorSlider({value: this.rgba, channel: 'a'}),
        ioColorSlider({value: this.rgba, channel: 'h'}),
        ioColorSlider({value: this.rgba, channel: 's'}),
        ioColorSlider({value: this.rgba, channel: 'v'}),
        ioColorSlider({value: this.rgba, channel: 'l'}),
      ]),
      div({class: 'row'}, [
        ioColorSlider({value: this.rgba, channel: 'hs'}),
        ioColorSlider({value: this.rgba, channel: 'sl', step: 0.1}),
        ioColorSlider({value: this.rgba, vertical: true, channel: 'v'}),
        ioColorSlider({value: this.rgba, vertical: true, channel: 'l'}),
      ]),
    ]);
  }
}
Register(IoColorsDemo);
export const ioColorsDemo = IoColorsDemo.vConstructor;
