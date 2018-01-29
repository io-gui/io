import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoMenuLayer} from "./io-menu-layer.js"
import {IoMenuGroup} from "./io-menu-group.js"

export class IoMenuOption extends Io {
  static get shadowStyle() {
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
      </style>
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
      },
      listeners: {
        'focus': '_focusHandler',
        'click': '_clickHandler',
        'keydown': '_keydownHandler'
      }
    }
  }
  constructor(props) {
    super(props);
    this.setAttribute('tabindex', 1);
    this.render([
      this.option.options ? ['io-menu-group', {options: this.option.options, $parent: this, position: 'right'}] : null,
      this.option.icon ? ['span', {className: 'io-icon'}, this.option.icon] : null,
      this.option.label ? ['span', {className: 'io-label'}, this.option.label] : null,
      this.option.hint ? ['span', {className: 'io-hint'}, this.option.hint] : null,
      this.option.options ? ['span', {className: 'io-more'}, '▸'] : null,
    ]);
  }
  connectedCallback() {
    super.connectedCallback();
    this.$group = this.querySelector('io-menu-group');
    if (this.$group) {
      IoMenuLayer.singleton.appendChild(this.$group);
    }
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
    // TODO: handle previous focus.
    // TODO: handle tabbed focus marching.

    if (event.which == 13) {
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
      this.fire('io-menu-option', this);
    }
  }
}

window.customElements.define('io-menu-option', IoMenuOption);
