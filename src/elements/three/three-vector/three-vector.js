import {Io} from "../../../iocore.js";

export class ThreeVector extends Io {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
      }
      :host > io-number {
        flex: 1 1;
        padding: 0.25em 0.5em;
      }
      :host > io-number:not(:first-child) {
        border-left: 0.5px solid #666;
      }
      :host > io-number:nth-child(even) {
        padding-left: 0.25em;
      }
      :host > io-number:nth-child(odd) {
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
    if (this.value.x !== undefined) {
      elements.push(['io-number', {
        value: this.value['x'],
        key: 'x'
        // listeners: {'value-set': this.setProperty}
      }]);
    }
    if (this.value.y !== undefined) {
      elements.push(['io-number', {
        value: this.value['y'],
        key: 'y'
        // listeners: {'value-set': this.setProperty}
      }]);
    }
    if (this.value.z !== undefined) {
      elements.push(['io-number', {
        value: this.value['z'],
        key: 'z'
        // listeners: {'value-set': this.setProperty}
      }]);
    }
    if (this.value.w !== undefined) {
      elements.push(['io-number', {
        value: this.value['w'],
        key: 'w'
        // listeners: {'value-set': this.setProperty}
      }]);
    }

    this.render([elements]);
  }
}

ThreeVector.Register();
