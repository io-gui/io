import {html, IoElement} from "../../io.js";
import {IoThemeSingleton as mixin} from "../../io-elements-core.js";

export class IoCollapsable extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        ${mixin.panel}
      }
      :host > io-boolean {
        text-align: left;
        align-self: stretch;
        width: auto;
      }
      :host > io-boolean[value] {
        margin-bottom: var(--io-spacing);
      }
      :host:not([expanded]) > .io-frame {
        display: none;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      label: {
        notify: true,
      },
      expanded: {
        type: Boolean,
        notify: true,
      },
      role: 'region',
    };
  }
  static get Properties() {
    return {
      elements: Array,
    };
  }
  _onButtonValueSet(event) {
    this.set('expanded', event.detail.value);
  }
  changed() {
    this.template([
      ['io-boolean', {true: '▾ ' + this.label, false: '▸ ' + this.label, value: this.expanded, 'on-value-set': this._onButtonValueSet}],
      ['div', {id: 'content', class: 'io-frame'}, (this.expanded && this.elements.length) ? this.elements : [null]],
    ]);
  }
}

IoCollapsable.Register();
