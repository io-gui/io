import {Io, html} from "../../io/io.js"

let previousOption;
let previousParent;
let timeoutOpen;
let timeoutReset;
let WAIT_TIME = 1000;

export class UiMenuLayer extends Io {
  static get style() {
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
      :host[expanded] {
        visibility: visible;
      }
      </style>
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
      },
      listeners: {
        'mouseup': '_eventHandler',
        'touchstart': '_eventHandler',
        'keyup': '_eventHandler',
        'expanded-changed': '_expandedHandler',
        'mousemove': '_mousemoveHandler',
        'ui-menu-option-clicked': '_menuClickedHandler'
      }
    }
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this.collapseAll.bind(this));
  }
  collapseAll() {
    let groups = this.querySelectorAll('ui-menu-group');
    for (var i = 0; i < groups.length; i++) {
      groups[i].expanded = false;
    }
  }
  _menuClickedHandler(event) {
    event.stopPropagation();
    let option = event.detail.option;
    if (typeof option.action === 'function') {
      option.action.apply(null, [option.value]);
      UiMenuLayer.singleton.collapseAll();
    } else if (option.button) {
      option.button.click(); // TODO: test
      UiMenuLayer.singleton.collapseAll();
    } else if (option.value !== undefined) {
      UiMenuLayer.singleton.collapseAll();
    }
  }
  _eventHandler(event) {
    event.stopPropagation();
    if (event.target === this || event.key === 'Escape' || event.keyCode === 27) {
      this.collapseAll();
    }
  }
  _mousemoveHandler(event) {
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
    this.pointer.v = Math.abs(event.movementY / 2) - Math.abs(event.movementX);
    let groups = this.querySelectorAll('ui-menu-group');
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
    let options = group.querySelectorAll('ui-menu-option');
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
  _expandedHandler() {
    let groups = this.querySelectorAll('ui-menu-group');
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

window.customElements.define('ui-menu-layer', UiMenuLayer);

UiMenuLayer.singleton = new UiMenuLayer();

document.body.appendChild(UiMenuLayer.singleton);
