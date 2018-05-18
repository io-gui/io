import {IoObjectProp} from "../../io/io-object/io-object-prop.js";

export class ThreeInspectorItem extends IoObjectProp {
  static get style() {
    return `
      :host {
        display: flex;
        flex: 1;
        flex-direction: row;
        margin: 0.3em 0.3em 0 0.3em;
      }
      :host:last-of-type {
        margin-bottom: 0.3em;
      }
      :host > span {
        width: 8em;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0.3em 0;
        padding-right: 0.5em;
      }
      :host io-option {
        display: inline-block;
        color: #ddd;
        background: #444;
        color: #ddd !important;
        border-radius: 0.2em;
        padding: 0.3em;
      }
      :host io-slider {
        border-radius: 0.2em;
        background: #444;
      }
      :host io-object-prop > three-matrix > io-object-prop > io-number {
        margin: 0 0.3em 0.3em 0;
      }
      :host io-object-prop > three-color > io-object-prop > io-number,
      :host io-object-prop > three-vector > io-object-prop:not(:last-of-type) > io-number {
        margin-right: 0.3em;
      }
      :host io-string,
      :host io-number {
        border-radius: 0.3em;
        background: #222;
        padding: 0.3em;
      }
      :host three-color-picker,
      :host io-boolean {
        padding: 0.3em;
        border-radius: 0.3em;
      }
      :host io-object-prop > io-boolean {
        flex: none;
      }
      :host three-color,
      :host io-slider,
      :host three-matrix {
        flex: 1;
      }
      :host io-boolean,
      :host io-string,
      :host three-vector,
      :host io-number {
        display: flex;
        color: #bef !important;
        flex: 1;
      }
    `;
  }
  update() {
    this.render([
      ['span', this.key],
      [this.config.tag, Object.assign({
          value: this.value[this.key],
          label: this.key,
          listeners: {'value-set': this.setProperty}},
          this.config.props)]
    ]);
  }
}

ThreeInspectorItem.Register();
