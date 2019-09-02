import {html, IoElement, IoStorageFactory as $} from "../../io.js";

export class IoSidebar extends IoElement {
  static get Style() {
    return html`<style>
    :host {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: hidden;
      overflow-y: auto;
      padding: var(--io-spacing);
    }
    :host:not([overflow]) {
      -webkit-overflow-scrolling: touch;
      flex-direction: column;
    }
    :host > * {
      flex: 0 0 auto;
    }
    :host io-collapsable {
      padding: 0;
    }
    :host io-collapsable > io-content {
      padding: 0 0 0 0.75em;
    }
    :host io-button {
      text-align: left;
      align-self: stretch;
    }
    :host io-button,
    :host io-collapsable,
    :host io-content {
      background: none;
      box-shadow: none;
      border-color: transparent;
    }
    </style>`;
  }
  static get Properties() {
    return {
      selected: String,
      options: {
        type: Array,
        observe: true,
      },
      label: {
        reflect: 1,
      },
      overflow: {
        reflect: 1,
      },
      role: 'navigation',
    };
  }
  _onSelect(id) {
    this.set('selected', id);
  }
  _onValueSet(event) {
    this.set('selected', event.detail.value);
  }
  _addOptions(options) {
    const elements = [];
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (option.options) {
        const UID = option.label + ' ' + i + '/' + options.length + ' (' + option.options.length + ')';
        let selectedOption = this.filterObject(option.options, option => matches(this.selected, option));
        elements.push(['io-collapsable', {
          label: option.label,
          expanded: !!selectedOption || $({value: false, storage: 'local', key: 'io-sidebar-collapse ' + UID}),
          elements: [...this._addOptions(option.options)]
        }]);
      } else {
        const selected = matches(this.selected, option);
        elements.push(['io-button', {
          label: option.label || option.value || option,
          value: option.value || option,
          action: this._onSelect,
          selected: selected,
        }]);
      }
    }
    return elements;
  }
  changed() {
    let selectedOption = this.filterObject(this.options, option => matches(this.selected, option));
    if (this.overflow) {
      const label = selectedOption ? (selectedOption.label || String(selectedOption.value)) : String(this.selected).split('#')[0];
      this.template([['io-option-menu', {
        label: '☰  ' + label,
        title: 'select tab',
        value: this.selected,
        options: this.options,
        selectable: true,
        class: 'io-item',
        'on-value-set': this._onValueSet,
      }]]);
    } else {
      this.template([...this._addOptions(this.options)]);
    }
  }
}

IoSidebar.Register();

function matches(selected, option) {
  if (selected === undefined) return false;
  if (typeof option === 'object') option = option.value;
  return String(selected).toLowerCase() === String(option).toLowerCase();
}
