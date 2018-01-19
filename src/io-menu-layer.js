import {IoBase, html} from "./io-base.js"

class IoMenuLayer extends IoBase {
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
        background: rgba(0, 0, 0, 0.5);
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        overflow: hidden;
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
    this._pointer = {x: 0, y: 0}

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
    this._pointer.x = event.clientX;
    this._pointer.y = event.clientY;
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

IoMenuLayer.singleton = document.createElement('io-menu-layer');

export { IoMenuLayer };

document.body.appendChild(IoMenuLayer.singleton);
