import {Io} from "../../../iocore.js";
import "../../io/io-object/io-object-prop.js";

export class ThreeVector extends Io {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
      }
      :host > io-object-prop {
        flex: 1 1;
        display: flex;
        padding: 0;
      }
      :host > io-object-prop > span {
        display: none;
      }
      :host > io-object-prop > io-number {
        flex: 1 1;
      }
      :host > io-object-prop:nth-child(even) > io-number {
        padding-left: 0.25em;
        background: rgba(255,255,255, 0.05);
      }
      :host > io-object-prop:nth-child(odd) > io-number {
        padding-left: 0.25em;
      }
    </style>`;
  }
  static get properties() {
    return {
      value: null,
      columns: {
        type: Number,
        reflect: true
      }
    };
  }
  update() {
    let elements = [];
    if (this.value.x !== undefined) elements.push('x');
    if (this.value.y !== undefined) elements.push('y');
    if (this.value.z !== undefined) elements.push('z');
    if (this.value.w !== undefined) elements.push('w');
    this.columns = elements.length;
    const Prop = i => ['io-object-prop', {key: i, value: this.value, config: {tag: 'io-number'}}];
    this.render([elements.map(Prop)]);
  }
}

ThreeVector.Register();
