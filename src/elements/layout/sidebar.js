import {IoElement, Options} from '../../iogui.js';
import {IoStorageFactory as $} from '../core/storage.js';

export class IoSidebar extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: hidden;
      overflow-y: auto;
      padding: var(--io-spacing);
      flex-direction: column;
      -webkit-overflow-scrolling: touch;
    }
    :host > * {
      align-self: stretch !important;
      flex: 0 0 auto;
    }
    :host * {
      overflow: visible !important;
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
    :host io-boolean:not(:focus) {
      border-bottom-color: transparent  !important;
    }
    `;
  }
  static get Properties() {
    return {
      selected: null,
      options: {
        type: Options,
        observe: true,
        strict: true,
      },
      collapsed: {
        type: Boolean,
        reflect: 1,
      },
      role: 'navigation',
    };
  }
  _onSelect(id) {
    this.set('selected', id);
  }
  _addOptions(options) {
    const elements = [];
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (option.options.length) {
        const containsSelected = !!this.filterObject(option.options, o => matches(this.selected, o));
        const collapsableState = $({value: false, storage: 'local', key: genUUID(options, i)});
        elements.push(['io-collapsable', {
          label: option.label,
          expanded: containsSelected || collapsableState,
          elements: [...this._addOptions(option.options)]
        }]);
      } else {
        const selected = matches(this.selected, option);
        elements.push(['io-button', {
          value: option.value || option,
          label: option.label || option.value || option,
          action: this._onSelect,
          selected: selected,
        }]);
      }
    }
    return elements;
  }
  changed() {
    if (this.collapsed) {
      const selected = this.filterObject(this.options, o => matches(this.selected, o));
      this.template([['io-option-menu', {
        options: this.options,
        value: this.bind('selected'),
        label: selected ? selected.label : '',
        icon: '☰',
        selectable: true,
        title: 'select tab',
        class: 'io-item',
      }]]);
    } else {
      this.template([...this._addOptions(this.options)]);
    }
  }
}

IoSidebar.Register();

function genUUID(options, i) {
  const option = options[i];
  let UUID = 'io-sidebar-collapse-state-' + i + '-' + options.length;
  if (option.label) UUID += '-' + option.label;
  if (option.options.length) UUID += '(' + option.options.length + ')';
  return UUID;
}

function matches(selected, option) {
  if (selected === undefined) return false;
  if (typeof option === 'object') option = option.value;
  return String(selected).toLowerCase() === String(option).toLowerCase();
}
