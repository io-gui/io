import {html, IoElement, IoStorage as $} from "../../io.js";
import {filterObject} from "../../io-elements-menu.js";

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
      :host io-collapsable > .io-frame {
        padding: 0 0 0 0.75em;
      }
      :host io-button {
        text-align: left;
        align-self: stretch;
      }
      :host io-button,
      :host io-collapsable,
      :host .io-frame {
        background: none;
        box-shadow: none;
        border-color: transparent;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      role: 'navigation',
      label: {
        notify: true,
      },
      overflow: {
        notify: true,
      }
    };
  }
  static get Properties() {
    return {
      selected: String,
      options: Array,
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
        let selectedOption = filterObject(option.options, option => { return option.value === this.selected; });
        elements.push(['io-collapsable', {
          label: option.label,
          expanded: !!selectedOption || $('io-sidebar-collapse ' + UID, false),
          elements: [...this._addOptions(option.options)]
        }]);
      } else {
        const selected = this.selected && (this.selected === option || this.selected === option.value);
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
    let selectedOption = filterObject(this.options, option => { return option.value === this.selected; });
    if (this.overflow) {
      const label = selectedOption ? (selectedOption.label || String(selectedOption.value)) : String(this.selected).split('#')[0];
      this.template([['io-menu-option', {
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
