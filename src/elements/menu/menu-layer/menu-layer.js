import {Io, html} from "../../../iocore.js";

let previousOption;
let previousParent;
let timeoutOpen;
let timeoutReset;
let WAIT_TIME = 120;
let lastFocus;

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
        reflect: true,
        observer: '_scrollAnimateGroupHandler'
      },
      $groups: {
        type: Array
      },
      listeners: {
        'mouseup': '_mouseupHandler',
        'mousemove': '_mousemoveHandler',
      }
    };
  }
  constructor(props) {
    super(props);
    this._hoveredItem = null;
    this._hoveredGroup = null;
    this._x = 0;
    this._y = 0;
    this._v = 0;
    window.addEventListener('scroll', this._scrollHandler);
    window.addEventListener('focusin', this._windowFocusHandler);
  }
  registerGroup(group) {
    this.$groups.push(group);
    group.addEventListener('focusin', this._menuItemFocusedHandler);
    group.addEventListener('mouseup', this._mouseupHandler);
    group.addEventListener('keyup', this._keyupHandler);
    group.addEventListener('expanded-changed', this._expandedChangedHandler);
  }
  unregisterGroup(group) {
    this.$groups.splice(this.$groups.indexOf(group), 1);
    group.removeEventListener('focusin', this._menuItemFocusedHandler);
    group.removeEventListener('mouseup', this._mouseupHandler);
    group.removeEventListener('keyup', this._keyupHandler);
    group.removeEventListener('expanded-changed', this._expandedChangedHandler);
  }
  collapseAllGroups() {
    for (let i = this.$groups.length; i--;) {
      this.$groups[i].expanded = false;
    }
  }
  runAction(option) {
    if (typeof option.action === 'function') {
      option.action.apply(null, [option.value]);
      this.collapseAllGroups();
      if (lastFocus) lastFocus.focus();
    } else if (option.button) {
      option.button.click(); // TODO: test
      this.collapseAllGroups();
      if (lastFocus) lastFocus.focus();
    }
  }
  _scrollHandler() {
    this.collapseAllGroups();
    if (lastFocus) lastFocus.focus();
  }
  _windowFocusHandler(event) {
    if (event.target.localName !== 'menu-item') lastFocus = event.target;
  }
  _menuItemFocusedHandler(event) {
    let item = event.path[0];
    let expanded = [item.$group];
    let parent = item.$parent;
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
  _mouseupHandler(event) {
    let elem = event.path[0];
    if (elem.localName == 'menu-item') {
      this.runAction(elem.option);
    } else if (elem === this) {
      if (this._hoveredItem) {
        this.runAction(this._hoveredItem.option);
      } else if (!this._hoveredGroup) {
        this.collapseAllGroups();
        if (lastFocus) lastFocus.focus();
      }
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
    //   this.collapseAll();
    // }
  }
  _mousemoveHandler(event) {
    this._x = event.clientX;
    this._y = event.clientY;
    this._v = Math.abs(event.movementY) - Math.abs(event.movementX);
    let groups = this.$groups;
    for (let i = groups.length; i--;) {
      if (groups[i].expanded) {
        let rect = groups[i].getBoundingClientRect();
        if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
          this._hover(groups[i]);
          this._hoveredGroup = groups[i];
          return groups[i];
        }
      }
    }
    this._hoveredItem = null;
    this._hoveredGroup = null;
  }
  _hover(group) {
    let items = group.querySelectorAll('menu-item');
    for (let i = items.length; i--;) {
      let rect = items[i].getBoundingClientRect();
      if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
        let force = group.horizontal;
        this._focus(items[i], force);
        this._hoveredItem = items[i];
        return items[i];
      }
    }
    this._hoveredItem = null;
    this._hoveredItem = null;
  }
  _focus(item, force) {
    if (item !== previousOption) {
      clearTimeout(timeoutOpen);
      clearTimeout(timeoutReset);
      if (this._v > 0 || item.parentNode !== previousParent || force || !item.option.options) {
        previousOption = item;
        item.focus();
      } else {
        timeoutOpen = setTimeout(function() {
          previousOption = item;
          item.focus();
        }.bind(this), WAIT_TIME);
      }
      previousParent = item.parentNode;
      timeoutReset = setTimeout(function() {
        previousOption = null;
        previousParent = null;
      }.bind(this), WAIT_TIME + 1);
    }
  }
  _expandedChangedHandler(event) {
    if (event.path[0].expanded) this._setGroupPosition(event.path[0]);
    for (let i = this.$groups.length; i--;) {
      if (this.$groups[i].expanded) {
        return this.expanded = true;
      }
    }
    return this.expanded = false;
  }
  _setGroupPosition(group) {
    if (!group.$parent) return;
    let rect = group.getBoundingClientRect();
    let pRect = group.$parent.getBoundingClientRect();
    switch (group.position) {
      case 'pointer':
        group._x = this._x - 2 || pRect.x;
        group._y = this._y - 2 || pRect.y;
        break;
      case 'bottom':
        group._x = pRect.x;
        group._y = pRect.bottom;
        break;
      case 'right':
        group._x = pRect.right;
        group._y = pRect.y;
        if (group._x + rect.width > window.innerWidth) {
          group._x = pRect.x - rect.width;
        }
        break;
      case 'top':
      default:
        group._x = pRect.x;
        group._y = pRect.y;
        break;
    }
    group._x = Math.min(group._x, window.innerWidth - rect.width);
    group._y = Math.min(group._y, window.innerHeight - rect.height);
    group.style.left = group._x + 'px';
    group.style.top = group._y + 'px';
  }
  _scrollAnimateGroupHandler() {
    if (!this.expanded) return;
    let group = this._hoveredGroup;
    if (group) {
      let rect = group.getBoundingClientRect();
      if (rect.height > window.innerHeight) {
        if (this._y < 100 && rect.top < 0) {
          let scrollSpeed = (100 - this._y) / 5000;
          let overflow = rect.top;
          group._y = group._y - Math.ceil(overflow * scrollSpeed) + 1;
        } else if (this._y > window.innerHeight - 100 && rect.bottom > window.innerHeight) {
          let scrollSpeed = (100 - (window.innerHeight - this._y)) / 5000;
          let overflow = (rect.bottom - window.innerHeight);
          group._y = group._y - Math.ceil(overflow * scrollSpeed) - 1;
        }
        group.style.left = group._x + 'px';
        group.style.top = group._y + 'px';
      }
    }
    requestAnimationFrame(this._scrollAnimateGroupHandler);
  }
}

MenuLayer.Register();

MenuLayer.singleton = new MenuLayer();

document.body.appendChild(MenuLayer.singleton);
