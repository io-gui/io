//@ts-nocheck
import { Register, IoElement, div } from '@io-gui/core'
import { ioSlider, ioSliderRange, ioSlider2d, ioNumberSlider, ioNumberSliderRange } from '@io-gui/sliders'

export class IoSlidersDemo extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        margin: var(--io_spacing2);
        display: flex;
        flex-direction: column;
        align-self: flex-start;
      }
      :host .row,
      :host .column {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: var(--io_spacing);
        margin: var(--io_spacing);
        margin-bottom: 0;
        background-color: var(--io_bgColorLight);
      }
      :host .column {
        flex-direction: column;
      }
      :host .row > * {
        margin-right: var(--io_spacing3);
      }
    `
  }
  static get ReactiveProperties() {
    return {
      number: 1,
      array2: [0, 1],
    }
  }
  ready() {
    this.render([
      div({class: 'column'}, [
        ioSlider({value: this.bind('number'), min: 0, max: 2, step: 0.1}),
        ioSlider({value: this.bind('number'), min: 0, max: 2, step: 0.1, disabled: true}),
        ioSlider({value: 'this should error', min: 0, max: 2, step: 0.1}),
        ioSlider({value: this.bind('number'), min: -1.3, max: 3, step: 1}),
        ioSlider({value: this.bind('number'), min: 0, max: 4.3, step: 1}),
        ioSlider({value: this.bind('number'), min: 0, max: 2, step: 0.1, exponent: 3}),
        ioSlider({value: this.bind('number'), min: 0, max: 2, step: 0.01, exponent: 5}),
        ioSlider({value: this.bind('number'), min: 0, max: 2, step: 0.1, exponent: 0.3}),
        ioSlider({value: this.bind('number'), min: 2, max: 0, step: 0.1, exponent: 0.1, noscroll: true}),
      ]),
      div({class: 'column'}, [
        ioSliderRange({value: this.array2, min: 0, max: 2, step: 0.1}),
        ioSliderRange({value: this.array2, min: 0, max: 2, step: 0.05, exponent: 3}),
        ioSliderRange({value: this.array2, min: 0, max: 2, step: 0.05, exponent: 0.3}),
        ioNumberSlider({value: this.bind('number'), min: 0, max: 2, step: 0.1}),
        ioNumberSliderRange({value: this.array2, min: 0, max: 2, step: 0.1}),
      ]),
      div({class: 'row'}, [
        ioSlider2d({value: this.bind('array2'), min: [-6, -2.5], max: [4.2, 8], step: [1, 1]}),
        ioSlider2d({value: this.bind('array2'), min: [-6, -2.5], max: [4.2, 8], step: [1, 1], vertical: true}),
      ]),
      div({class: 'row'}, [
        ioSlider({value: this.bind('number'), vertical: true, min: -2, max: 2, step: 0.02, exponent: 5.5}),
        ioSliderRange({value: this.array2, vertical: true, min: 0, max: 2, step: 0.1}),
      ]),
      div({class: 'row'}, [
        ioSlider2d({value: this.bind('array2'), min: [4.2, 8], max: [-6, -2.5], step: [1, 1]}),
        ioSlider2d({value: this.bind('array2'), min: [4.2, 8], max: [-6, -2.5], step: [1, 1], vertical: true}),
        ioSlider({value: this.bind('number'), vertical: true, min: 2, max: -2, step: 0.2}),
        ioSliderRange({value: this.array2, vertical: true, min: 2, max: 0, step: 0.1}),
      ]),
    ])
  }
}

Register(IoSlidersDemo)

export const ioSlidersDemo = IoSlidersDemo.vConstructor
