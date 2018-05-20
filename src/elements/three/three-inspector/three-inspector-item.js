import {IoObjectProp} from "../../io/io-object/io-object-prop.js";

export class ThreeInspectorItem extends IoObjectProp {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex: 0 0 auto;
        flex-direction: row;
        border-bottom: 0.5px solid #252525;
        font-size: 0.85em;
        padding: 0;
      }
      :host:last-of-type {
        border-bottom: 0;
      }
      :host > :nth-child(1) {
        width: 8em;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 3px 2px 3px 4px;
        padding: 0.1em;
      }
      :host > :nth-child(2) {
        flex: 1 1 auto;
        padding: 0.1em 0.3em;
        border-radius: 4px;
        margin: 3px 1px;
      }
      :host io-string,
      :host io-number{
        color: #6ef;
      }
      :host > io-string,
      :host > io-number,
      :host > three-color,
      :host > three-vector,
      :host > three-matrix {
        margin: 2.5px 3px !important;
        background: linear-gradient(45deg, #222, #333);
        border: 0.5px inset #888;
      }
      :host > io-option {
        flex: 0 0 auto !important;
        margin: 2.5px 0.5px 2.5px 4px !important;
        background: linear-gradient(175deg, #777, #555);
        border: 0.5px outset #888;
        color: #eee;
      }
      :host > io-slider {
        margin: 2.5px 3px !important;
        background: #555;
        border: 0.5px inset #888;
        flex: 1 0 auto !important;
        padding: 0.1em 0 !important;
      }
      :host io-boolean {
        color: #9f9;
      }
      :host io-boolean:not([value]) {
        color: #696;
      }

      /*

      :host three-matrix > io-object-prop > io-number {
        margin: 0 0.3em 0.3em 0;
      }


      :host three-color-picker,

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
      }*/
    </style>`;
  }
  update() {
    // TODO: move props to config
    let label = this.config.label || this.key;
    this.render([
      ['span', label],
      [this.config.tag, Object.assign({
          value: this.value[this.key],
          listeners: {'value-set': this.setProperty}},
          this.config.props)]
    ]);
  }
}

ThreeInspectorItem.Register();
