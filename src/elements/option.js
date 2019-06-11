import {html} from "../core/element.js";
import {IoButton} from "./button.js";

export class IoOption extends IoButton {
  static get style() {
    return html`<style>
      :host {
        padding: var(--io-padding) calc(1.5 * var(--io-padding));
      }
      :host:not([label])::before {
        content: '▾';
        padding-right: var(--io-padding);
      }
    </style>`;
  }
  static get properties() {
    return {
      options: Array,
      label: '',
    };
  }
  static get listeners() {
    return {
      'button-clicked': '_onButtonClicked'
    };
  }
  constructor(props) {
    super(props);
    this.__properties.action.value = () => {
      this.$['menu'].expanded = !this.$['menu'].expanded;
    }
  }
  _onButtonClicked(event) {
    event.stopPropagation();
  }
  _onMenu(event) {
    this.$['menu'].expanded = false; // TODO: close menu automatically
    this.set('value', event.detail.value);
  }
  changed() {
    const options = this.options.map(option => {return option.value !== undefined ? option : {value: option}});
    const option = options.find(option => {return option.value === this.value;});
    let label = this.label || option ? (option.label || option.value) : this.value;
    label = (label instanceof Object) ? label.__proto__.constructor.name : String(label);
    this.template([
      ['span', label],
      ['io-menu', {
        id: 'menu',
        options: options,
        position: 'bottom',
        'on-menu-item-clicked': this._onMenu}]
    ]);
  }
}

IoOption.Register();
