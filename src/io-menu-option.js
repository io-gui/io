import {IoBase, html} from "./io-base.js"
import {IoMenuLayer} from "./io-menu-layer.js"
import {IoMenuGroup} from "./io-menu-group.js"

export class IoMenuOption extends IoBase {
  static get is() { return 'io-menu-option'; }
  static get template() {
    return html`
      <style>
      :host {
        display: flex;
        flex-direction: row;
        cursor: pointer;
        padding: 0.125em 0.5em 0.125em 1.7em;
        line-height: 1em;
      }
      ::slotted(.io-icon) {
        width: 1.25em;
        margin-left: -1.25em;
        line-height: 1em;
      }
      ::slotted(.io-label) {
        flex: 1
      }
      ::slotted(.io-hint) {
        opacity: 0.5;
        padding: 0 0.5em;
      }
      ::slotted(.io-more) {
        opacity: 0.5;
        margin: 0 -0.25em 0 0.25em;
      }
      </style><slot></slot>
    `;
  }
  static get properties() {
    return {
      option: {
        type: Object,
        // observer: '_optionChanged';
      },
      $parent: {
        type: HTMLElement
      }
    }
  }
  constructor(props) {
    super(props);
    this.setAttribute('tabindex', 1);
    if (this.option.options) {
      this.$group = new IoMenuGroup({options: this.option.options, $parent: this, position: 'right'});
      IoMenuLayer.singleton.appendChild(this.$group);
    }

    if (this.option.icon) {
      this.$icon = this.appendHTML(html`<span class='io-icon'>${this.option.icon}</span>`);
    }

    if (this.option.label) {
      this.$label = this.appendHTML(html`<span class='io-label'>${this.option.label}</span>`);
    }

    if (this.option.hint) {
      this.option.hint = this.appendHTML(html`<span class='io-hint'>${this.option.hint}</span>`);
    }

    if (this.option.options) {
      this.$icon = this.appendHTML(html`<span class='io-more'>▸</span>`);
    }

    this._focusListener = this._focusHandler.bind(this);
    this._clickListener = this._clickHandler.bind(this);
    this._keydownListener = this._keydownHandler.bind(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('focus', this._focusListener);
    this.addEventListener('click', this._clickListener);
    this.addEventListener('keydown', this._keydownListener);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('focus', this._focusListener);
    this.removeEventListener('click', this._clickListener);
    this.removeEventListener('keydown', this._keydownListener);
  }
  _focusHandler() {
    for (var i = 0; i < this.$parent.$options.length; i++) {
      if (this.$parent.$options[i] !== this) {
        if (this.$parent.$options[i].$group)
            this.$parent.$options[i].$group.expanded = false;
      }
    }
    if (this.$group) this.$group.expanded = true;
  }
  _clickHandler(event) {
    if (this.option.disabled) return;
    let parent = this.$parent;
    while (parent && parent.localName != 'io-menu') {
      parent = parent.$parent;
    }
    this.dispatchEvent(new CustomEvent('io-menu-option-clicked', {
      detail: {option: this.option},
      bubbles: true,
      composed: true
    }));
    parent.dispatchEvent(new CustomEvent('io-menu-option-clicked', {
      detail: {option: this.option},
      bubbles: false,
      composed: true
    }));
  }
  _keydownHandler(event) {
    var siblings = this.$parent.$options;

    var index = siblings.indexOf(this);

    // TODO: handle search.
    // TODO: handle disabled.
    // TODO: handle previous focus.
    // TODO: handle tabbed focus marching.

    if (event.which == 13) {
      if (this.disabled) return;
      event.preventDefault();
      this._clickHandler(event); // TODO: test
    } else if (event.which == 37) { // LEFT
      event.preventDefault();
      if (this.$parent && this.$parent.$parent) this.$parent.$parent.focus();
    } else if (event.which == 38) { // UP
      event.preventDefault();
      siblings[(index + siblings.length - 1) % (siblings.length)].focus();
    } else if (event.which == 39) { // RIGHT
      event.preventDefault();
      if (this.option.options && this.option.options.length) {
        this.$group.$options[0].focus();
      }
    } else if (event.which == 40) { // DOWN
      event.preventDefault();
      // TODO: search
      siblings[(index + 1) % (siblings.length)].focus();
    } else if (event.which == 9) { // TAB
      event.preventDefault();
      if (this.option.options && this.option.options.length) {
        this.$group.$options[0].focus();
      } else if (index < siblings.length - 1) {
        siblings[(index + 1)].focus();
      } else if (this.$parent && this.$parent.$parent) {
        // TODO: fix and implement better tabbed focus marching.
        var target = this.$parent.$parent;
        var tSiblings = target.$parent.$options
        var tIndex = tSiblings.indexOf(target);
        tSiblings[(tIndex + 1) % (tSiblings.length)].focus();
      }

    } else if (event.which == 27) { // ESC
      event.preventDefault();
      this.fire('io-menu-option-clicked', this);
    }
  }
}

window.customElements.define(IoMenuOption.is, IoMenuOption);
