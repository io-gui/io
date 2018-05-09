import {Io, html} from "../../../iocore.js";
import {MenuLayer} from "../menu-layer/menu-layer.js";
import {MenuGroup} from "../menu-group/menu-group.js";

export class MenuItem extends Io {
  static get style() {
    return html`
      <style>
      :host {
        display: flex;
        flex-direction: row;
        cursor: pointer;
        padding: 0.125em 0.5em 0.125em 1.7em;
        line-height: 1em;
      }
      :host > .menu-icon {
        width: 1.25em;
        margin-left: -1.25em;
        line-height: 1em;
      }
      :host > .menu-label {
        flex: 1
      }
      :host > .menu-hint {
        opacity: 0.5;
        padding: 0 0.5em;
      }
      :host > .menu-more {
        opacity: 0.5;
        margin: 0 -0.25em 0 0.25em;
      }
      </style>
    `;
  }
  static get properties() {
    return {
      option: {
        type: Object
      },
      $parent: {
        type: HTMLElement
      },
      $group: {
        type: HTMLElement
      },
      listeners: {
        'focus': '_focusHandler'
      },
      attributes: {
        'tabindex': 0
      }
    };
  }
  constructor(props) {
    super(props);
    const option = this.option;
    const suboptions = this.option.options;
    if (suboptions) this.$group = new MenuGroup({options: suboptions, $parent: this});
    this.render([
      ['span', {class: 'menu-icon'}, option.icon],
      ['span', {class: 'menu-label'}, option.label || option.value],
      ['span', {class: 'menu-hint'}, option.hint],
      ['span', {class: 'menu-more'}, suboptions ? '▸' : null],
    ]);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.$group) {
      if (this.$group.parentNode) {
        MenuLayer.singleton.removeChild(this.$group);
        MenuLayer.singleton.unregisterGroup(this.$group);
      }
    }
  }
  _focusHandler(event) {
    event.stopPropagation();
    this.addEventListener('blur', this._blurHandler);
    this.addEventListener('mouseup', this._mouseupHandler);
    this.addEventListener('keyup', this._keyupHandler);
    if (this.$group) {
      if (!this.$group.parentNode) {
        MenuLayer.singleton.appendChild(this.$group);
        MenuLayer.singleton.registerGroup(this.$group);
      }
      this.$group.expanded = true;
    }
    this.fire('menu-item-focused', this);
  }
  _blurHandler(event) {
    event.stopPropagation();
    this.removeEventListener('blur', this._blurHandler);
    this.removeEventListener('mouseup', this._mouseupHandler);
    this.removeEventListener('keyup', this._keyupHandler);
  }
  _mouseupHandler(event) {
    event.stopPropagation();
    this.fire('menu-item-mouseup', this);
  }
  _keyupHandler(event) {
    event.stopPropagation();
    this.fire('menu-item-keyup', this);
  }
}

MenuItem.Register();
