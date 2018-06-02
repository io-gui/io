import {IoElement}from "../../../io-element.js";
import {MenuLayer} from "../menu-layer/menu-layer.js";
import {MenuGroup} from "../menu-group/menu-group.js";

export class MenuItem extends IoElement {
  static get style() {
    return html`<style>
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
    </style>`;
  }
  static get properties() {
    return {
      option: Object,
      position: String,
      $parent: HTMLElement,
      tabindex: 1
    };
  }
  static get listeners() {
    return {
      'focus': '_onFocus',
      'touchstart': '_onTouchstart'
    }
  }
  static get menuroot() {
    return this;
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
      this.option.icon ? ['span', {className: 'menu-icon'}] : null,
      ['span', {className: 'menu-label'}, this.option.label || this.option.value],
      this.option.hint ? ['span', {className: 'menu-hint'}] : null,
      this.option.options ? ['span', {className: 'menu-more'}, '▸'] : null,
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
  _onTouchstart(event) {
    event.preventDefault();
    this.addEventListener('touchmove', this._onTouchmove);
    this.addEventListener('touchend', this._onTouchend);
    this.focus();
  }
  _onTouchmove(event) {
    MenuLayer.singleton._onTouchmove(event);
  }
  _onTouchend(event) {
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
    MenuLayer.singleton._onTouchend(event);
  }
  _onFocus(event) {
    if (this.$group) {
      if (!this.$group.parentNode) {
        MenuLayer.singleton.appendChild(this.$group);
      }
      this.$group.expanded = true;
    }
  }
}

MenuItem.Register();
