import {html} from "../io-core.js";
import {IoButton} from "./button.js";

export class IoBoolean extends IoButton {
  static get style() {
    return html`<style>
      :host {
        display: inline;
        background: white;
      }
    </style>`;
  }
  static get properties() {
    return {
      value: {
        type: Boolean,
        reflect: true
      },
      true: 'true',
      false: 'false'
    };
  }
  constructor(props) {
    super(props);
    this.action = this.toggle;
  }
  toggle() {
    this.set('value', !this.value);
  }
  changed() {
    this.innerText = this.value ? this.true : this.false;
  }
}

IoBoolean.Register();
