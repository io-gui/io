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
      :host > * {
        pointer-events: none;
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
      position: {
        type: String
      },
      $parent: {
        type: HTMLElement
      },
      listeners: {
        'focus': '_focusHandler',
        'touchstart': '_touchstartHandler'
      },
      attributes: {
        'tabindex': 0
      }
    };
  }
  _touchstartHandler(event) {
    event.preventDefault();
    this.addEventListener('touchmove', this._touchmoveHandler);
    this.addEventListener('touchend', this._touchendHandler);
    this.focus();
  }
  _touchmoveHandler(event) {
    MenuLayer.singleton._touchmoveHandler(event);
  }
  _touchendHandler(event) {
    this.removeEventListener('touchmove', this._touchmoveHandler);
    this.removeEventListener('touchend', this._touchendHandler);
    MenuLayer.singleton._touchendHandler(event);
  }
  update() {
    if (this.option.options) {
      let grpProps = {options: this.option.options, $parent: this, position: this.position};
      if (!this.$group) {
        this.$group = new MenuGroup(grpProps);
      } else {
        this.$group.__node.update(grpProps); // TODO: test
      }
    }
    this.render([
      this.option.icon ? ['span', {class: 'menu-icon'}] : null,
      ['span', {class: 'menu-label'}, this.option.label || this.option.value],
      this.option.hint ? ['span', {class: 'menu-hint'}] : null,
      this.option.options ? ['span', {class: 'menu-more'}, '▸'] : null,
    ]);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.$group) {
      if (this.$group.parentNode) {
        MenuLayer.singleton.removeChild(this.$group);
      }
    }
  }
  _focusHandler(event) {
    if (this.$group) {
      if (!this.$group.parentNode) {
        MenuLayer.singleton.appendChild(this.$group);
      }
      this.$group.expanded = true;
    }
  }
}

MenuItem.Register();
