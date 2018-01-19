import {IoBase, html} from "./io-base.js"
import {IoMenuLayer} from "./io-menu-layer.js"
import {IoMenuGroup} from "./io-menu-group.js"

// var x = 0, y = 0, v = 0;
var previousOption;
var previousParent;
var timeoutOpen;
var timeoutReset;
var WAIT_TIME = 1000;

class IoMenuOption extends IoBase {
  static get is() { return 'io-menu-option'; }
  static get template() {
    return html`
      <style>
      :host {
        display: inline-block;
        cursor: pointer;
      }
      :host([invalid]),
      :host([disabled]) {
        opacity: 0.5;
      }

      </style><slot></slot>
    `;
  }
  static get properties() {
    return {
      option: {
        type: Object,
        observer: '_optionChanged'
      }
    }
  }
  constructor(props) {
    super(props);
    this.$group = new IoMenuGroup({options: this.option.options});
    this.$group._parent = this;
    IoMenuLayer.singleton.appendChild(this.$group);

    this.$icon = this.appendHTML(html`<span class='io-icon'>*</span>`);
    this.$label = this.appendHTML(html`<span class='io-label'>${this.option.label}</span>`);
    this.$expandicon = this.appendHTML(html`<span class='io-icon'>)</span>`);
    this.$info = this.appendHTML(html`<span class='io-info'>..</span>`);
    // button: {
    //   type: HTMLElement
    // },
    // _menuGroup: {
    //   type: HTMLElement
    // }
    // this.__onFocus = this._onFocus.bind(this);
    // this.__onBlur = this._onBlur.bind(this);
    // this.__onMousemove = this._onMousemove.bind(this);
    // this.__onClick = this._onClick.bind(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this.$parentGroup = this.parentElement;
    // Attach menu subgroup to io-menu-layer.
    // Set "parent" reference to `this`.
    // this._menuGroup = this.shadowRoot.querySelector('io-menu-group');
    // this._menuGroup._parent = this;
    //
    // //
    // this.addEventListener('focus', this.__onFocus);
    // this.addEventListener('blur', this.__onBlur);
    // this.addEventListener('mousemove', this.__onMousemove);
    // this.addEventListener('touchmove', this.__onMousemove);
    // this.addEventListener('click', this.__onClick);
  }
  disconnectedCallback() {
    // super.disconnectedCallback();
    // this.removeEventListener('focus', this.__onFocus);
    // this.removeEventListener('blur', this.__onBlur);
    // this.removeEventListener('mousemove', this.__onMousemove);
    // this.removeEventListener('touchmove', this.__onMousemove);
    // this.removeEventListener('click', this.__onClick);
  }
  // _onFocus() {
  //   let siblings = this.parentNode.querySelectorAll('io-menu-option');
  //   for (var i = 0; i < siblings.length; i++) {
  //     if (siblings[i] !== this) {
  //       siblings[i]._menuGroup.expanded = false;
  //     }
  //   }
  //   this._menuGroup.expanded = true;
  // }
  // _onBlur(event) {
  // }
  // _onMousemove(event) {
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
  // }
  _optionChanged() {
    if (this.option.disabled) {
      this.removeAttribute('tabindex');
    } else {
      this.setAttribute('tabindex', 1);
    }
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
  //     this._onClick(event); // TODO: test
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
  //       this._menuGroup.querySelector('io-menu-option')._openGroup();
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
  //       this._menuGroup.querySelector('io-menu-option')._openGroup();
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
  // },
  // _onClick(event) {
  //   let option = this.option;
  //   if (option.disabled) return;
  //   if (typeof option.action === 'function' || option.value !== undefined || option.button) {
  //     if (option.button) {
  //       // TODO: test
  //       option.button.click();
  //     }
  //     if (typeof option.action === 'function') {
  //       option.action.apply(null, [option.value]);
  //     }
  //     /**
  //     * Fired when menu option is clicked.
  //     *
  //     * @event io-menu-option-clicked
  //     * @param {Object} detail.option option clicked
  //     */
  //     this.dispatchEvent(new CustomEvent('io-menu-option-clicked', {
  //       detail: {option: option},
  //       bubbles: true,
  //       composed: true
  //     }));
  //     IoMenuLayer.singleton.collapseAll();
  //   }
  // }
}

window.customElements.define(IoMenuOption.is, IoMenuOption);

export { IoMenuOption };
