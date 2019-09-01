import {html, IoElement} from "../../io.js";

export class IoCollapsable extends IoElement {
  static get Style() {
    return html`<style>
    :host {
      @apply --io-panel;
    }
    :host > io-boolean {
      text-align: left;
      align-self: stretch;
      width: auto;
    }
    :host > io-boolean[value] {
      margin-bottom: var(--io-spacing);
    }
    </style>`;
  }
  static get Properties() {
    return {
      elements: Array,
      label: {
        reflect: 1,
      },
      expanded: {
        type: Boolean,
        reflect: 1,
      },
      role: 'region',
    };
  }
  _onButtonValueSet(event) {
    this.set('expanded', event.detail.value);
  }
  changed() {
    this.template([
      ['io-boolean', {true: '▾ ' + this.label, false: '▸ ' + this.label, value: this.expanded, 'on-value-set': this._onButtonValueSet}],
      ['io-content', {elements: this.elements, expanded: this.expanded}],
    ]);
  }
}

IoCollapsable.Register();
