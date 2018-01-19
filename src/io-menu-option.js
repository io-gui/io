import {IoBase, html} from "./io-base.js"
import {IoMenuLayer} from "./io-menu-layer.js"
import {IoMenuGroup} from "./io-menu-group.js"

// var x = 0, y = 0, v = 0;
// var previousOption;
// var previousParent;
// var timeoutOpen;
// var timeoutReset;
// var WAIT_TIME = 1000;

class IoMenuOption extends IoBase {
  static get is() { return 'io-menu-option'; }
  static get template() {
    return html`
      <style>
      :host {
        display: inline-block;
        cursor: pointer;
      }
      </style><slot></slot>
    `;
  }
  static get properties() {
    return {
      option: {
        type: Object
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

    this.$label = this.appendHTML(html`<span class='io-label'>${this.option.label}</span>`);

    this._focusListener = this._focusHandler.bind(this);
    this._blurListener = this._blurHandler.bind(this);
    // this._mousemoveListener = this._mousemoveHandler.bind(this);
    this._clickListener = this._clickHandler.bind(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('focus', this._focusListener);
    this.addEventListener('blur', this._blurListener);
    // TODO: performance!!!
    // this.addEventListener('mousemove', this._mousemoveListener);
    // this.addEventListener('touchmove', this._mousemoveListener);
    this.addEventListener('click', this._clickListener);
    this._update();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('focus', this._focusListener);
    this.removeEventListener('blur', this._blurListener);
    // this.removeEventListener('mousemove', this._mousemoveListener);
    // this.removeEventListener('touchmove', this._mousemoveListener);
    this.removeEventListener('click', this._clickListener);
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
  _blurHandler(event) {
  }
  _mousemoveHandler(event) {
  //   if (event.changedTouches) event = event.changedTouches[0];
  //   let v = Math.abs(event.movementY / 2) - Math.abs(event.movementX);
  //   if (this !== previousOption) {
  //     clearTimeout(timeoutOpen);
  //     clearTimeout(timeoutReset);
  //     if (v > 0.5 || this.parentNode !== previousParent) {
  //       previousOption = this;
  //       this.focus();
  //     } else {
  //       timeoutOpen = setTimeout(function() {
  //         previousOption = this;
  //         this.focus();
  //       }.bind(this), WAIT_TIME);
  //     }
  //     previousParent = this.parentNode;
  //     timeoutReset = setTimeout(function() {
  //       previousOption = null;
  //       previousParent = null;
  //     }.bind(this), WAIT_TIME + 1);
  //   }
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
  // _onKeydown: function(event) {
  //   var siblings = Array.prototype.slice.call(this.parentNode.querySelectorAll(
  //           'io-menu-option:not([type=separator]):not([disabled]):not([invalid])'));
  //
  //   var index = siblings.indexOf(this);
  //
  //   if (event.which == 13) {
  //     if (this.disabled) return;
  //     event.preventDefault();
  //     this._clickHandler(event); // TODO: test
  //
  //   } else if (event.which == 37) { // LEFT
  //     event.preventDefault();
  //     if (this.parentNode._parent) {
  //       this.parentNode._parent._openGroup();
  //     }
  //
  //   } else if (event.which == 38) { // UP
  //     event.preventDefault();
  //     if (this.parentNode.search && index === 0) {
  //       this.parentNode.$$('input').focus();
  //       // TODO: make work when first is invalid
  //     } else {
  //       siblings[(index + siblings.length - 1) % (siblings.length)]._openGroup();
  //     }
  //
  //   } else if (event.which == 39) { // RIGHT
  //     event.preventDefault();
  //     if (this.options && this.options.length) {
  //       this.$group.querySelector('io-menu-option')._openGroup();
  //       // TODO: if #1 is invalid/disabled, find first available option.
  //     }
  //
  //   } else if (event.which == 40) { // DOWN
  //     event.preventDefault();
  //     if (this.parentNode.search && index === siblings.length - 1) {
  //       this.parentNode.$$('input').focus();
  //       // TODO: make work when last is invalid
  //     } else {
  //       siblings[(index + 1) % (siblings.length)]._openGroup();
  //     }
  //
  //   } else if (event.which == 9) { // TAB
  //     event.preventDefault();
  //     if (this.options && this.options.length) {
  //       this.$group.querySelector('io-menu-option')._openGroup();
  //     } else if (index < siblings.length - 1) {
  //       siblings[(index + 1)]._openGroup();
  //     } else if (this.parentNode._parent) {
  //       //TODO: find first available option in sequence.
  //     }
  //
  //   } else if (event.which == 27) { // ESC
  //     event.preventDefault();
  //     this.fire('io-menu-option-clicked', this);
  //   }
  // }
}

window.customElements.define(IoMenuOption.is, IoMenuOption);

export { IoMenuOption };
