import {html, IoElement} from "../core/element.js";

export class IoObjectGroup extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        flex: 0 0;
        line-height: 1em;
      }
      :host > div.io-object-group {
        font-weight: bold;
      }
      :host > div.io-object-prop {
        display: flex !important;
        flex-direction: row;
      }
      :host > div > span {
        padding: 0 0.2em 0 0.5em;
        flex: 0 0 auto;
      }
      :host > div > io-number {
        color: rgb(28, 0, 207);
      }
      :host > div > io-string {
        color: rgb(196, 26, 22);
      }
      :host > div > io-boolean {
        color: rgb(170, 13, 145);
      }
      :host > div > io-option {
        color: rgb(32,135,0);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: Object,
      config: Object,
      props: Array,
      expanded: Boolean,
      label: String,
      _config: Object,
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('io-object-mutated', this._onIoObjectMutated);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('io-object-mutated', this._onIoObjectMutated);
  }
  _onIoObjectMutated(event) {
    let key = event.detail.key;
    if (event.detail.object === this.value) {
      if (key && this.$[key]) {
        this.$[key].__props.value.value = this.value[key];
        this.$[key].changed();
      } else if (!key || key === '*') {
        for (let k in this.$) {
          this.$[k].__props.value.value = this.value[k];
          this.$[k].changed();
        }
      }
    }
  }
  _onValueSet(event) {
    const path = event.composedPath();
    if (path[0] === this) return;
    if (event.detail.object) return; // TODO: unhack
    event.stopPropagation();
    let key = path[0].id;
    if (key !== null) {
      this.value[key] = event.detail.value;
      let detail = Object.assign({object: this.value, key: key}, event.detail);
      this.dispatchEvent('io-object-mutated', detail, false, window);
      this.dispatchEvent('value-set', detail, false); // TODO
    }
  }
  changed() {
    const config = this.config;
    const label = this.label || this.value.constructor.name;
    const elements = [['io-boolean', {true: '▾' + label, false: '▸' + label, value: this.bind('expanded')}]];
    if (this.expanded) {
      for (let c in config) {
        if (!this.props.length || this.props.indexOf(c) !== -1) {
          if (config[c]) {
            const tag = config[c][0];
            const protoConfig = config[c][1];
            const itemConfig = {id: c, value: this.value[c], 'on-value-set': this._onValueSet};
            elements.push(['div', {className: 'io-object-prop'}, [['span', config.label || c + ':'], [tag, Object.assign(itemConfig, protoConfig)]]]);
          }
        }
      }
    }
    this.template(elements);
  }
}

IoObjectGroup.Register();
