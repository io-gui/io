import {IoBase, html} from "./io-base.js"

var previousOption;
var previousParent;
var timeoutOpen;
var timeoutReset;
var WAIT_TIME = 1000;

export class IoMenuLayer extends IoBase {
  static get is() { return 'io-menu-layer'; }
  static get template() {
    return html`
      <style>
      :host {
        display: block;
        visibility: hidden;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 100000;
        background: rgba(0, 0, 0, 0.3);
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        overflow: hidden;
        font-family: "Lucida Grande", sans-serif;
      }
      :host([expanded]) {
        visibility: visible;
      }
      </style><slot></slot>
    `;
  }
  static get properties() {
    return {
      expanded: {
        type: Boolean,
        reflectToAttribute: true,
        observer: '_expandedChanged'
      },
      pointer: {
        value: {x: 0, y: 0, v: 0},
        type: Object
      }
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('mousedown', this._eventHandler);
    this.addEventListener('touchstart', this._eventHandler);
    this.addEventListener('keyup', this._eventHandler);
    this.addEventListener('expanded-changed', this._onMenuGroupExpanded);
    this.addEventListener('mousemove', this._onMousemove);

    this.addEventListener('io-menu-option-clicked', function (event) {
      event.stopPropagation();
      let option = event.detail.option;
      if (typeof option.action === 'function') {
        option.action.apply(null, [option.value]);
        IoMenuLayer.singleton.collapseAll();
      } else if (option.button) {
        option.button.click(); // TODO: test
        IoMenuLayer.singleton.collapseAll();
      } else if (option.value !== undefined) {
        IoMenuLayer.singleton.collapseAll();
      }
    });
  }
  collapseAll() {
    let groups = this.querySelectorAll('io-menu-group');
    for (var i = 0; i < groups.length; i++) {
      groups[i].expanded = false;
    }
  }
  _eventHandler(event) {
    event.stopPropagation();
    if (event.target === this || event.key === 'Escape' || event.keyCode === 27) {
      this.collapseAll();
    }
  }
  _onMousemove(event) {
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
    this.pointer.v = Math.abs(event.movementY / 2) - Math.abs(event.movementX);
    let groups = this.querySelectorAll('io-menu-group');
    for (var i = groups.length; i--;) {
      if (groups[i].expanded) {
        if (groups[i]._rect.top < this.pointer.y && groups[i]._rect.bottom > this.pointer.y &&
          groups[i]._rect.left < this.pointer.x && groups[i]._rect.right > this.pointer.x) {
            this._hover(groups[i]);
            return groups[i];
        }
      }
    }
  }
  _hover(group) {
    let options = group.querySelectorAll('io-menu-option');
    for (var i = options.length; i--;) {
      options[i]._rect = options[i].getBoundingClientRect();
      if (options[i]._rect.top < this.pointer.y && options[i]._rect.bottom > this.pointer.y &&
        options[i]._rect.left < this.pointer.x && options[i]._rect.right > this.pointer.x) {
          this._focus(options[i]);
          return options[i];
      }
    }
  }
  _focus(option) {
    if (option !== previousOption) {
      clearTimeout(timeoutOpen);
      clearTimeout(timeoutReset);
      if (this.pointer.v > 0.5 || option.parentNode !== previousParent) {
        previousOption = option;
        option.focus();
      } else {
        timeoutOpen = setTimeout(function() {
          previousOption = option;
          option.focus();
        }.bind(this), WAIT_TIME);
      }
      previousParent = option.parentNode;
      timeoutReset = setTimeout(function() {
        previousOption = null;
        previousParent = null;
      }.bind(this), WAIT_TIME + 1);
    }
  }
  _onMenuGroupExpanded() {
    let groups = this.querySelectorAll('io-menu-group');
    let expanded = false;
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].expanded) expanded = true;
    }
    this.expanded = expanded;
  }
  _expandedChanged() {
    if (this.expanded) {
      // TODO: test
      this._activeElement = document.activeElement;
    } else {
      if (this._activeElement) {
        this._activeElement.focus();
        delete this._activeElement;
      }
    }
  }
}

window.customElements.define(IoMenuLayer.is, IoMenuLayer);

IoMenuLayer.singleton = new IoMenuLayer();

document.body.appendChild(IoMenuLayer.singleton);
