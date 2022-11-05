import { IoElement, RegisterIoElement } from '../build/iogui.js';

export class IoDemoElementsColor extends IoElement {
  static get Style() {
    return /* css */`
      :host > div {
        display: flex;
        width: 425px;
        margin: var(--io-spacing) 0;
        padding: var(--io-spacing) 0;
        border: var(--io-border);
        border-color: rgba(128, 128, 128, .125);
      }
      :host > div.tall {
        height: calc(var(--io-field-height) * 4);
      }
      :host > div.xtall {
        height: calc(var(--io-field-height) * 8);
      }
      :host > div.tall > io-color-slider {
        
      }
      :host > div > :nth-child(1) {
        flex: 0 0 140px;
        text-align: right;
        margin-right: var(--io-spacing);
      }
      :host > div > * {
        margin-left: var(--io-spacing);
      }
      :host > div > io-label,
      :host > div > io-icon {
        margin-top: var(--io-spacing);
      }
    `;
  }
  static get Properties() {
    return {
      rgb: { value: {'r': 1, 'g': 0.5, 'b': 0}},
      rgba: { value: {'r': 1, 'g': 0.5, 'b': 0, 'a': 0.75}},
    };
  }
  constructor(props) {
    super(props);
    this.template([
      ['div', [
        ['io-label', {label: 'color-rgba'}],
        ['io-color-rgba', {value: this.rgba}],
      ]],
      ['div', [
        ['io-label', {label: 'color-rgba [rgb]'}],
        ['io-color-rgba', {value: this.rgb}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [red]'}],
        ['io-color-slider', {value: this.rgba, channel: 'r'}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [green]'}],
        ['io-color-slider', {value: this.rgba, channel: 'g'}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [blue]'}],
        ['io-color-slider', {value: this.rgba, channel: 'b'}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [alpha]'}],
        ['io-color-slider', {value: this.rgba, channel: 'a'}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [h]'}],
        ['io-color-slider', {value: this.rgba, channel: 'h'}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [s]'}],
        ['io-color-slider', {value: this.rgba, channel: 's'}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [v]'}],
        ['io-color-slider', {value: this.rgba, channel: 'v'}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [l]'}],
        ['io-color-slider', {value: this.rgba, channel: 'l'}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [c]'}],
        ['io-color-slider', {value: this.rgba, channel: 'c'}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [m]'}],
        ['io-color-slider', {value: this.rgba, channel: 'm'}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [y]'}],
        ['io-color-slider', {value: this.rgba, channel: 'y'}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [k]'}],
        ['io-color-slider', {value: this.rgba, channel: 'k'}],
      ]],
      ['div', {class: 'xtall'}, [
        ['io-label', {label: 'color-slider [vertical]'}],
        ['io-color-slider', {value: this.rgba, vertical: true, channel: 'r'}],
        ['io-color-slider', {value: this.rgba, vertical: true, channel: 'g'}],
        ['io-color-slider', {value: this.rgba, vertical: true, channel: 'b'}],
        ['io-color-slider', {value: this.rgba, vertical: true, channel: 'a'}],
        ['io-color-slider', {value: this.rgba, vertical: true, channel: 'h'}],
        ['io-color-slider', {value: this.rgba, vertical: true, channel: 's'}],
        ['io-color-slider', {value: this.rgba, vertical: true, channel: 'v'}],
        ['io-color-slider', {value: this.rgba, vertical: true, channel: 'l'}],
        ['io-color-slider', {value: this.rgba, vertical: true, channel: 'c'}],
        ['io-color-slider', {value: this.rgba, vertical: true, channel: 'm'}],
      ]],
      ['div', {class: 'tall'}, [
        ['io-label', {label: 'color-slider [2d]'}],
          ['io-color-slider', {value: this.rgba, channel: 'hs'}],
          ['io-color-slider', {value: this.rgba, channel: 'sv'}],
          ['io-color-slider', {value: this.rgba, channel: 'sl'}],
      ]],
      // ['div', {class: 'tall'}, [
      //   ['io-label', {label: 'color-panel'}],
      //   ['io-color-panel', {expanded: true, value: this.color, class: 'color-slider'}]
      // ]],
    ]);
  }
}

RegisterIoElement(IoDemoElementsColor);