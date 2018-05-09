import {Io, html} from "../../../iocore.js";

let previousOption;
let previousParent;
let timeoutOpen;
let timeoutReset;
let WAIT_TIME = 1000;

export class MenuLayer extends Io {
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
          background: rgba(0, 0, 0, 0.2);
          user-select: none;
          overflow: hidden;
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
        reflect: true
      },
      pointer: {
        value: {x: 0, y: 0, v: 0},
        type: Object
      },
      $groups: {
        type: Array
      },
      listeners: {
        'mouseup': '_eventStopHandler',
        'touchstart': '_eventStopHandler',
        'keyup': '_eventStopHandler',
        'mousemove': '_mousemoveHandler',
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this.collapseGroups.bind(this));
  }
  registerGroup(group) {
    this.$groups.push(group);
    group.addEventListener('menu-item-focused', this._menuItemFocusedHandler);
    group.addEventListener('menu-item-mouseup', this._menuMouseupHandler);
    group.addEventListener('menu-item-keyup', this._menuKeyupHandler);
    group.addEventListener('expanded-changed', this._expandedChangedHandler);
  }
  unregisterGroup(group) {
    this.$groups.splice(this.$groups.indexOf(group), 1);
    group.removeEventListener('menu-item-focused', this._menuItemFocusedHandler);
    group.removeEventListener('menu-item-mouseup', this._menuMouseupHandler);
    group.removeEventListener('menu-item-keyup', this._menuKeyupHandler);
    group.removeEventListener('expanded-changed', this._expandedChangedHandler);
  }
  collapseGroups() {
    for (let i = this.$groups.length; i--;) {
      this.$groups[i].expanded = false;
    }
  }
  _menuItemFocusedHandler(event) {
    let expanded = [event.detail.$group];
    let parent = event.detail.$parent;
    while (parent) {
      expanded.push(parent);
      parent = parent.$parent;
    }
    for (let i = this.$groups.length; i--;) {
      if (expanded.indexOf(this.$groups[i]) === -1) {
        this.$groups[i].expanded = false;
      }
    }
  }
  _menuMouseupHandler(event) {
    event.stopPropagation();
    let option = event.detail.option;
    if (typeof option.action === 'function') {
      option.action.apply(null, [option.value]);
      this.collapseGroups();
    } else if (option.button) {
      option.button.click(); // TODO: test
      this.collapseGroups();
    } else if (option.value !== undefined) {
      this.collapseGroups();
    }
  }
  _menuKeyupHandler(event) {
    // let siblings = this.$parent.$options;
    // let index = siblings.indexOf(this);
    // // TODO: handle search.
    // // TODO: handle previous focus.
    // // TODO: handle tabbed focus marching.
    // if (event.which == 13) {
    //   event.preventDefault();
    //   this._mouseupHandler(event); // TODO: test
    // } else if (event.which == 37) { // LEFT
    //   event.preventDefault();
    //   if (this.$parent && this.$parent.$parent) this.$parent.$parent.focus();
    // } else if (event.which == 38) { // UP
    //   event.preventDefault();
    //   siblings[(index + siblings.length - 1) % (siblings.length)].focus();
    // } else if (event.which == 39) { // RIGHT
    //   event.preventDefault();
    //   if (this.option.options && this.option.options.length) {
    //     this.$group.$options[0].focus();
    //   }
    // } else if (event.which == 40) { // DOWN
    //   event.preventDefault();
    //   // TODO: search
    //   siblings[(index + 1) % (siblings.length)].focus();
    // } else if (event.which == 9) { // TAB
    //   event.preventDefault();
    //   if (this.option.options && this.option.options.length) {
    //     this.$group.$options[0].focus();
    //   } else if (index < siblings.length - 1) {
    //     siblings[(index + 1)].focus();
    //   } else if (this.$parent && this.$parent.$parent) {
    //     // TODO: fix and implement better tabbed focus marching.
    //     let target = this.$parent.$parent;
    //     let tSiblings = target.$parent.$options;
    //     let tIndex = tSiblings.indexOf(target);
    //     tSiblings[(tIndex + 1) % (tSiblings.length)].focus();
    //   }
    // } else if (event.which == 27) { // ESC
    //   event.preventDefault();
    //   MenuLayer.singleton.collapseAll();
    // }
  }
  _mousemoveHandler(event) {
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
    this.pointer.v = Math.abs(event.movementY / 2) - Math.abs(event.movementX);
    let groups = this.$groups;
    for (let i = groups.length; i--;) {
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
    let options = group.querySelectorAll('menu-item');
    let force = group.localName == 'menu-bar'; // TODO: unhack
    for (let i = options.length; i--;) {
      options[i]._rect = options[i].getBoundingClientRect();
      if (options[i]._rect.top < this.pointer.y && options[i]._rect.bottom > this.pointer.y &&
        options[i]._rect.left < this.pointer.x && options[i]._rect.right > this.pointer.x) {
          this._focus(options[i], force);
          return options[i];
      }
    }
  }
  _focus(option, force) {
    if (option !== previousOption) {
      clearTimeout(timeoutOpen);
      clearTimeout(timeoutReset);
      if (this.pointer.v > 0.5 || option.parentNode !== previousParent || force) {
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
  _expandedChangedHandler() {
    for (let i = this.$groups.length; i--;) {
      if (this.$groups[i].expanded) return this.expanded = true;
    }
    return this.expanded = false;
  }
  _eventStopHandler(event) {
    event.stopPropagation();
    if (event.target === this || event.key === 'Escape') {
      this.collapseGroups();
    }
  }
}

// TODO: menu feature - restore focus

MenuLayer.Register();

MenuLayer.singleton = new MenuLayer();

document.body.appendChild(MenuLayer.singleton);
