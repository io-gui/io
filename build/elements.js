import { html, IoElement, debounce } from './core.js';
import { IoPointerMixin } from './mixins.js';

class IoButton extends IoElement {
  static get style() {
    return html`<style>:host {cursor: pointer;white-space: nowrap;-webkit-tap-highlight-color: transparent;}:host:hover {background: rgba(255,255,255,0.1);}:host[pressed] {background: rgba(0,0,0,0.2);}</style>`;
  }
  static get properties() {
    return {
      value: null,
      label: String,
      pressed: {
        type: Boolean,
        reflect: true
      },
      action: Function,
      tabindex: 1
    };
  }
  static get listeners() {
    return {
      'keydown': '_onDown',
      'mousedown': '_onDown',
      'touchstart': '_onDown'
    };
  }
  _onAction(event) {
    event.stopPropagation();
    if (event.which === 13 || event.which === 32 || event.type !== 'keyup') {
      event.preventDefault();
      if (this.pressed && typeof this.action === 'function') this.action(this.value);
      this.pressed = false;
      this.dispatchEvent('io-button-clicked', {value: this.value, action: this.action});
    }
  }
  _onDown(event) {
    event.stopPropagation();
    if (event.which !== 9) event.preventDefault();
    if (event.which === 13 || event.which === 32 || event.type !== 'keydown') {
      this.pressed = true;
      document.addEventListener('mouseup', this._onUp);
      document.addEventListener('touchend', this._onUp);
      this.addEventListener('keyup', this._onAction);
      this.addEventListener('mouseup', this._onAction);
      this.addEventListener('touchend', this._onAction);
      this.addEventListener('mouseleave', this._onLeave);
    }
  }
  _onUp(event) {
    event.stopPropagation();
    this.pressed = false;
    document.removeEventListener('mouseup', this._onUp);
    document.removeEventListener('touchend', this._onUp);
    this.removeEventListener('keyup', this._onAction);
    this.removeEventListener('mouseup', this._onAction);
    this.removeEventListener('touchend', this._onAction);
    this.removeEventListener('mouseleave', this._onLeave);
  }
  _onLeave() {
    this.pressed = false;
  }
  update() {
    this.render([['span', this.label]]);
  }
}

IoButton.Register();

class IoBoolean extends IoButton {
  static get properties() {
    return {
      value: {
        type: Boolean,
        reflect: true
      },
      true: 'true',
      false: 'false'
    };
  }
  constructor(props) {
    super(props);
    this.__props.action.value = this.toggle;
  }
  toggle() {
    this.set('value', !this.value);
  }
  update() {
    this.render([['span', this.value ? this.true : this.false]]);
  }
}

IoBoolean.Register();

let previousOption;
let previousParent;
let timeoutOpen;
let timeoutReset;
let WAIT_TIME = 1200;
let lastFocus;

// TODO: make long (scrolling) menus work with touch
// TODO: implement search

class IoMenuLayer extends IoElement {
  static get style() {
    return html`<style>:host {display: block;visibility: hidden;position: fixed;top: 0;left: 0;bottom: 0;right: 0;z-index: 100000;background: rgba(0, 0, 0, 0.2);user-select: none;overflow: hidden;}:host[expanded] {visibility: visible;}</style>`;
  }
  static get properties() {
    return {
      expanded: {
        type: Boolean,
        reflect: true,
        observer: '_onScrollAnimateGroup'
      },
      $groups: Array
    };
  }
  static get listeners() {
    return {
      'mouseup': '_onMouseup',
      'mousemove': '_onMousemove',
    };
  }
  constructor(props) {
    super(props);
    this._hoveredItem = null;
    this._hoveredGroup = null;
    this._x = 0;
    this._y = 0;
    this._v = 0;
    window.addEventListener('scroll', this._onScroll);
    window.addEventListener('focusin', this._onWindowFocus);
  }
  registerGroup(group) {
    this.$groups.push(group);
    group.addEventListener('focusin', this._onMenuItemFocused);
    group.addEventListener('mouseup', this._onMouseup);
    group.addEventListener('keydown', this._onKeydown);
    group.addEventListener('expanded-changed', this._onExpandedChanged);
  }
  unregisterGroup(group) {
    this.$groups.splice(this.$groups.indexOf(group), 1);
    group.removeEventListener('focusin', this._onMenuItemFocused);
    group.removeEventListener('mouseup', this._onMouseup);
    group.removeEventListener('keydown', this._onKeydown);
    group.removeEventListener('expanded-changed', this._onExpandedChanged);
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
  _onScroll() {
    this.collapseAllGroups();
    if (lastFocus) lastFocus.focus();
  }
  _onWindowFocus(event) {
    if (event.target.localName !== 'io-menu-item') lastFocus = event.target;
  }
  _onMenuItemFocused(event) {
    let item = event.path[0];
    let expanded = [item.$group];
    let parent = item.$parent;
    while (parent) {
      expanded.push(parent);
      item.__menuroot = parent; // TODO: unhack
      parent = parent.$parent;
    }
    for (let i = this.$groups.length; i--;) {
      if (expanded.indexOf(this.$groups[i]) === -1) {
        this.$groups[i].expanded = false;
      }
    }
  }
  _onTouchmove(event) {
    this._onMousemove(event);
  }
  _onTouchend(event) {
    this._onMouseup(event);
  }
  _onMousemove(event) {
    this._x = event.clientX;
    this._y = event.clientY;
    this._v = (2 * this._v + Math.abs(event.movementY) - Math.abs(event.movementX)) / 3;
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
  _onMouseup(event) {
    let elem = event.path[0];
    if (elem.localName === 'io-menu-item') {
      this.runAction(elem.option);
      elem.__menuroot.dispatchEvent('io-menu-item-clicked', elem.option);
    } else if (elem === this) {
      if (this._hoveredItem) {
        this.runAction(this._hoveredItem.option);
        this._hoveredItem.__menuroot.dispatchEvent('io-menu-item-clicked', this._hoveredItem.option);
      } else if (!this._hoveredGroup) {
        this.collapseAllGroups();
        if (lastFocus) lastFocus.focus();
      }
    }
  }
  _onKeydown(event) {
    event.preventDefault();
    if (event.path[0].localName !== 'io-menu-item') return;

    let elem = event.path[0];
    let group = elem.$parent;
    let siblings = [...group.querySelectorAll('io-menu-item')] || [];
    let children = elem.$group ? [...elem.$group.querySelectorAll('io-menu-item')]  : [];
    let index = siblings.indexOf(elem);

    let command = '';

    if (!group.horizontal) {
      if (event.key == 'ArrowUp') command = 'prev';
      if (event.key == 'ArrowRight') command = 'in';
      if (event.key == 'ArrowDown') command = 'next';
      if (event.key == 'ArrowLeft') command = 'out';
    } else {
      if (event.key == 'ArrowUp') command = 'out';
      if (event.key == 'ArrowRight') command = 'next';
      if (event.key == 'ArrowDown') command = 'in';
      if (event.key == 'ArrowLeft') command = 'prev';
    }
    if (event.key == 'Tab') command = 'next';
    if (event.key == 'Escape') command = 'exit';
    if (event.key == 'Enter' || event.which == 32) command = 'action';

    switch (command) {
      case 'action':
        this._onMouseup(event); // TODO: test
        break;
      case 'prev':
        siblings[(index + siblings.length - 1) % (siblings.length)].focus();
        break;
      case 'next':
        siblings[(index + 1) % (siblings.length)].focus();
        break;
      case 'in':
        if (children.length) children[0].focus();
        break;
      case 'out':
        if (group && group.$parent) group.$parent.focus();
        break;
      case 'exit':
        this.collapseAllGroups();
        break;
      default:
        break;
    }
  }
  _hover(group) {
    let items = group.querySelectorAll('io-menu-item');
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
      if (this._v > 1 || item.parentNode !== previousParent || force) {
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
  _onExpandedChanged(event) {
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
     // TODO: unhack horizontal long submenu bug.
    if (group.position === 'bottom' && rect.height > (window.innerHeight - this._y)) group.position = 'right';
    //
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
      default:
        group._x = pRect.right;
        group._y = pRect.y;
        if (group._x + rect.width > window.innerWidth) {
          group._x = pRect.x - rect.width;
        }
        break;
    }
    group._x = Math.min(group._x, window.innerWidth - rect.width);
    group._y = Math.min(group._y, window.innerHeight - rect.height);
    group.style.left = group._x + 'px';
    group.style.top = group._y + 'px';
  }
  _onScrollAnimateGroup() {
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
    requestAnimationFrame(this._onScrollAnimateGroup);
  }
}

IoMenuLayer.Register();

IoMenuLayer.singleton = new IoMenuLayer();

document.body.appendChild(IoMenuLayer.singleton);

// TODO: implement working mousestart/touchstart UX
// TODO: implement keyboard modifiers maybe. Touch alternative?
class IoMenu extends IoElement {
  static get properties() {
    return {
      options: Array,
      expanded: Boolean,
      position: 'pointer',
      listener: 'click'
    };
  }
  constructor(props) {
    super(props);
    this.render([
      ['io-menu-group', {
        id: 'group',
        $parent: this,
        options: this.bind('options'),
        position: this.bind('position'),
        expanded: this.bind('expanded')
      }]
    ]);
    this.$.group.__parent = this;
  }
  connectedCallback() {
    super.connectedCallback();
    this._parent = this.parentElement;
    this._parent.addEventListener(this.listener, this._onExpand);
    IoMenuLayer.singleton.appendChild(this.$['group']);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._parent.removeEventListener(this.listener, this._onExpand);
    IoMenuLayer.singleton.removeChild(this.$['group']);
  }
  getBoundingClientRect() {
    return this._parent.getBoundingClientRect();
  }
  _onExpand(event) {
    event.preventDefault();
    let evt = event.touches ? event.touches[0] : event;
    IoMenuLayer.singleton.collapseAllGroups();
    IoMenuLayer.singleton._x = evt.clientX;
    IoMenuLayer.singleton._y = evt.clientY;
    this.expanded = true;
  }
}

IoMenu.Register();

class IoMenuGroup extends IoElement {
  static get style() {
    return html`<style>:host {display: none;flex-direction: column;white-space: nowrap;user-select: none;}:host[horizontal] {flex-direction: row;}:host:not([nested]) {background: white;padding: 0.125em 0 0.25em 0;border: 1px solid #666;box-shadow: 1px 1px 2px rgba(0,0,0,0.33);position: absolute;transform: translateZ(0);top: 0;left: 0;min-width: 6em;}:host[expanded],:host[nested] {display: flex;}:host[nested] > io-menu-item {padding: 0.25em 0.5em;}:host[nested] > io-menu-item > :not(.menu-label) {display: none;}</style>`;
  }
  static get properties() {
    return {
      options: Array,
      expanded: {
        type: Boolean,
        reflect: true
      },
      position: 'right',
      horizontal: {
        type: Boolean,
        reflect: true
      },
      nested: {
        type: Boolean,
        reflect: true
      },
      $parent: HTMLElement
    };
  }
  static get listeners() {
    return {
      'focusin': '_onFocus'
    };
  }
  update() {
    const Item = (elem, i) => ['io-menu-item', {
      $parent: this,
      option: typeof this.options[i] === 'object' ? this.options[i] : {value: this.options[i], label: this.options[i]},
      position: this.horizontal ? 'bottom' : 'right'
    }];
    this.render([this.options.map(Item)]);
  }
  connectedCallback() {
    super.connectedCallback();
    this.nested = this.parentNode !== IoMenuLayer.singleton;
    IoMenuLayer.singleton.registerGroup(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    IoMenuLayer.singleton.unregisterGroup(this);
  }
  _onFocus(event) {
    let item = event.path[0];
    IoMenuLayer.singleton._hoveredGroup = this;
    if (item.localName === 'io-menu-item') {
      IoMenuLayer.singleton._hoveredItem = item;
      if (item.option.options) this.expanded = true;
    }
  }
}

IoMenuGroup.Register();

class IoMenuItem extends IoElement {
  static get style() {
    return html`<style>:host {display: flex;flex-direction: row;cursor: pointer;padding: 0.125em 0.5em 0.125em 1.7em;line-height: 1em;}:host > * {pointer-events: none;}:host > .menu-icon {width: 1.25em;margin-left: -1.25em;line-height: 1em;}:host > .menu-label {flex: 1}:host > .menu-hint {opacity: 0.5;padding: 0 0.5em;}:host > .menu-more {opacity: 0.5;margin: 0 -0.25em 0 0.25em;}</style>`;
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
    };
  }
  static get menuroot() {
    return this;
  }
  update() {
    if (this.option.options) {
      let grpProps = {options: this.option.options, $parent: this, position: this.position};
      if (!this.$group) {
        this.$group = new IoMenuGroup(grpProps);
      } else {
        this.$group.setProperties(grpProps); // TODO: test
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
        IoMenuLayer.singleton.removeChild(this.$group);
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
    event.preventDefault();
    IoMenuLayer.singleton._onTouchmove(event);
  }
  _onTouchend(event) {
    event.preventDefault();
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
    IoMenuLayer.singleton._onTouchend(event);
  }
  _onFocus() {
    if (this.$group) {
      if (!this.$group.parentNode) {
        IoMenuLayer.singleton.appendChild(this.$group);
      }
      this.$group.expanded = true;
    }
  }
}

IoMenuItem.Register();

const selection = window.getSelection();
const range = document.createRange();

class IoString extends IoElement {
  static get style() {
    return html`<style>:host {overflow: hidden;text-overflow: ellipsis;}:host:focus {overflow: hidden;text-overflow: clip;}</style>`;
  }
  static get properties() {
    return {
      value: String,
      tabindex: 0,
      contenteditable: true
    };
  }
  static get listeners() {
    return {
      'focus': '_onFocus',
      'blur': '_onBlur',
      'keydown': '_onKeydown'
    };
  }
  _onFocus() {
    debounce(this._select);
  }
  _select() {
    range.selectNodeContents(this);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  _onBlur() {
    this.set('value', this.innerText);
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }
  _onKeydown(event) {
    if (event.which == 13) {
      event.preventDefault();
      this.set('value', this.innerText);
    }
  }
  update() {
    this.innerText = String(this.value).replace(new RegExp(' ', 'g'), '\u00A0');
  }
}

IoString.Register();

class IoNumber extends IoString {
  static get properties() {
    return {
      value: Number,
      step: 0.001,
      min: -Infinity,
      max: Infinity
    };
  }
  _onBlur() {
    let value = Math.round(Number(this.innerText) / this.step) * this.step;
    if (!isNaN(value)) this.set('value', value);
    this.update();
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }
  _onKeydown(event) {
    if (event.which == 13) {
      event.preventDefault();
      let value = Math.round(Number(this.innerText) / this.step) * this.step;
      if (!isNaN(value)) this.set('value', value);
      this.update();
    }
  }
  update() {
    let value = this.value;
    if (typeof value == 'number' && !isNaN(value)) {
      value = Math.min(this.max, Math.max(this.min, (Math.round(value / this.step) * this.step)));
      value = value.toFixed(-Math.round(Math.log(this.step) / Math.LN10));
    }
    this.innerText = String(parseFloat(value));
  }
}

IoNumber.Register();

class IoObject extends IoElement {
  static get style() {
    return html`<style>:host {display: flex;flex-direction: column;flex: 0 0;line-height: 1em;}:host > div {display: flex;flex-direction: row;}:host > div > span {padding: 0 0.2em 0 0.5em;flex: 0 0 auto;}:host > io-number {color: rgb(28, 0, 207);}:host > io-string {color: rgb(196, 26, 22);}:host > io-boolean {color: rgb(170, 13, 145);}:host > io-option {color: rgb(32,135,0);}</style>`;
  }
  static get properties() {
    return {
      value: Object,
      props: Array,
      configs: Object,
      expanded: {
        type: Boolean,
        reflect: true
      },
      label: String
    };
  }
  static get listeners() {
    return {
      'value-set': '_onValueSet'
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('io-object-mutated', this._onIoObjectMutated);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('io-object-mutated', this._onIoObjectMutated);
  }
  _onIoObjectMutated(event) {
    let key = event.detail.key;
    if (event.detail.object === this.value) {
      if (key && this.$[key]) {
        this.$[key].__props.value.value = this.value[key];
        this.$[key].update();
      } else if (!key || key === '*') {
        for (let k in this.$) {
          this.$[k].update();
        }
      }
    }
  }
  _onValueSet(event) {
    if (event.path[0] === this) return;
    if (event.detail.object) return; // TODO: fix
    event.stopPropagation();
    let key = event.path[0].id;
    if (key && typeof key === 'string') {
      if (this.value[key] !== event.detail.value) {
        this.value[key] = event.detail.value;
      }
      let detail = Object.assign({object: this.value, key: key}, event.detail);
      this.dispatchEvent('io-object-mutated', detail, false, window);
      this.dispatchEvent('value-set', detail, true); // TODO
    }
  }
  getPropConfigs(keys) {
    let configs = {};

    let proto = this.value.__proto__;
    while (proto) {
      let c = IoObjectConfig[proto.constructor.name];
      if (c) configs = Object.assign(configs, c);
      c = this.configs[proto.constructor.name];
      if (c) configs = Object.assign(configs, c);
      proto = proto.__proto__;
    }

    let propConfigs = {};

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = this.value[key];
      let type = typeof value;
      let cstr = (value && value.constructor) ? value.constructor.name : 'null';

      if (type == 'function') continue;

      propConfigs[key] = {};

      if (configs.hasOwnProperty('type:' + type)) {
        propConfigs[key] = configs['type:' + type];
      }
      if (configs.hasOwnProperty('constructor:'+cstr)) {
        propConfigs[key] = configs['constructor:'+cstr];
      }
      if (configs.hasOwnProperty('key:' + key)) {
        propConfigs[key] = configs['key:' + key];
      }
      if (configs.hasOwnProperty('value:' + String(value))) {
        propConfigs[key] = configs['value:' + String(value)];
      }
    }
    return propConfigs;
  }
  update() {
    let label = this.label || this.value.constructor.name;
    let elements = [];
    if (this.expanded) {
      let keys = [...Object.keys(this.value), ...Object.keys(this.value.__proto__)];
      let proplist = this.props.length ? this.props : keys;
      let configs = this.getPropConfigs(proplist);
      for (let key in configs) {
        // TODO: remove props keyword
        let config = Object.assign({tag: configs[key].tag, value: this.value[key], id: key}, configs[key].props);
        if (this.value.__props && this.value.__props[key] && this.value.__props[key].config) {
          // TODO: test
          config = Object.assign(config, this.value.__props[key].config);
        }
        elements.push(['div', [['span', config.label || key + ':'], [config.tag, config]]]);
      }
    }
    this.render([['io-boolean', {true: '▾' + label, false: '▸' + label, value: this.bind('expanded')}], elements]);
  }
}

const IoObjectConfig = {
  'Object' : {
    'type:string': {tag: 'io-string', props: {}},
    'type:number': {tag: 'io-number', props: {step: 0.0001}},
    'type:boolean': {tag: 'io-boolean', props: {}},
    'type:object': {tag: 'io-object', props: {}},
    'value:null': {tag: 'io-string', props: {}},
    'value:undefined': {tag: 'io-string', props: {}}
  }
};

IoObject.Register();

class IoOption extends IoButton {
  static get properties() {
    return {
      value: null,
      action: Function,
      options: Array
    };
  }
  _onAction(event) {
    if (event.which == 13 || event.which == 32 || event.type == 'mouseup' || event.type == 'touchend') {
      event.preventDefault();
    }
  }
  _onUp(event) {
    super._onUp(event);
    this.$['menu'].expanded = true;
    let firstItem = this.$['menu'].$['group'].querySelector('io-menu-item');
    if (firstItem) firstItem.focus();
  }
  _onMenu(event) {
    this.$['menu'].expanded = false;
    this.set('value', event.detail.value);
    if (typeof this.action === 'function') {
      this.action(this.value);
    }
  }
  update() {
    let label = this.value;
    if (label instanceof Object) label = label.__proto__.constructor.name;
    if (this.options) {
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].value == this.value) {
          label = this.options[i].label || label;
          break;
        }
      }
    }
    this.__props.label.value = label;
    this.render([
      ['span', String(label)],
      ['io-menu', {
        id: 'menu',
        options: this.options,
        position: 'bottom',
        listener: 'click',
        listeners: {'io-menu-item-clicked': this._onMenu}}]
    ]);
  }
}

IoOption.Register();

class IoSlider extends IoPointerMixin(IoElement) {
  static get style() {
    return html`<style>:host {display: inline-block;cursor: ew-resize;min-width: 6em;min-height: 1.22em;position: relative;vertical-align: bottom;}:host > .io-slider-slit {position: absolute;width: 100%;height: 0.2em;top: calc(50% - 0.1em);}:host > .io-slider-knob {position: absolute;width: 0.4em;margin-left: -0.2em;height: 100%;background: #999;left: calc(50%);}</style>`;
  }
  static get properties() {
    return {
      value: Number,
      step: 0.01,
      min: 0,
      max: 100,
      pointermode: 'relative',
      tabindex: 0
    };
  }
  static get listeners() {
    return {
      'io-pointer-move': '_onPointerMove'
    };
  }
  _onPointerMove(event) {
    let rect = this.getBoundingClientRect();
    let x = event.detail.pointer[0].position.x / rect.width;
    let pos = Math.max(0,Math.min(1, x));
    // TODO: implement step
    this.set('value', this.min + (this.max - this.min) * pos);
  }
  update() {
    let pos = 100 * (this.value - this.min) / (this.max - this.min);
    this.render([
      ['div', {className: 'io-slider-slit', style: {
          background: 'linear-gradient(to right, #2cf, #2f6 ' + pos + '%, #333 ' + (pos + 1) + '%)'}}],
      ['div', {className: 'io-slider-knob', style: {left: pos + '%'}}]
    ]);
  }
}

IoSlider.Register();

class IoDemo extends IoElement {
  static get style() {
    return html`<style>:host div.row > io-string,:host div.row > io-boolean,:host div.row > io-number {border: 1px solid #eee;}:host div.demo > io-option,:host div.demo > io-object {display: inline-block;border: 1px solid #eee;vertical-align: top;}:host div.demo {margin: 1em;}:host .menubar {background: #fec;}:host div.menuarea {padding: 1em;background: #fec;}:host div.header, span.rowlabel {color: rgba(128, 122, 255, 0.75);}:host span.rowlabel {text-align: right;padding-right: 0.2em;;}:host div.row > *{flex: 1;margin: 2px;}:host .narrow {display: flex;width: 22em;}</style>`;
  }
  static get properties() {
    return {
      number: 1337,
      string: "hello",
      boolean: true,
      null: null,
      NaN: NaN,
      undefined: undefined,
      array: [1,2]
    };
  }
  constructor() {
    super();
    let suboptions1 = [
      {label: 'sub_sub_one', value: 1, action: console.log},
      {label: 'sub_sub_two', value: 2, action: console.log},
      {label: 'sub_sub_three', value: 3, action: console.log},
      {label: 'sub_sub_four', value: 4, action: console.log},
      {label: 'sub_sub_five', value: 5, action: console.log}
    ];
    let suboptions0 = [
      {label: 'sub_one', options: suboptions1},
      {label: 'sub_two', options: suboptions1},
      {label: 'sub_three', options: suboptions1},
      {label: 'sub_four', options: suboptions1},
      {label: 'sub_five', options: suboptions1}
    ];
    let longOptions = [];
    for (let i = 0; i < 1000; i++) {
      let r = Math.random();
      longOptions[i] = {label: String(r), value: r, action: console.log, icon: 'ξ', hint: 'log'};
    }
    this.menuoptions = [
      {label: 'one', options: suboptions0},
      {label: 'two', value: 2, action: console.log},
      {label: 'three', value: 3, action: console.log},
      {label: 'four', value: 4, action: console.log},
      {label: 'five', options: suboptions0},
      {label: 'long', options: longOptions, hint: 'list', icon: '⚠'}
    ];
    this.render([
      ['div', {className: 'demo'}, [
        ['div', {className: 'row narrow header'}, [
          ['span', {className: 'rowlabel'}],
          ['span', 'string'],
          ['span', 'number'],
          ['span', 'boolean'],
        ]],
        ['div', {className: 'row narrow'}, [
          ['span', {className: 'rowlabel'}, 'string'],
          ['io-string', {value: this.bind('string')}],
          ['io-number', {value: this.bind('string')}],
          ['io-boolean', {type: 'boolean', value: this.bind('string')}],
        ]],
        ['div', {className: 'row narrow'}, [
          ['span', {className: 'rowlabel'}, 'number'],
          ['io-string', {value: this.bind('number')}],
          ['io-number', {value: this.bind('number')}],
          ['io-boolean', {type: 'boolean', value: this.bind('number')}],
        ]],
        ['div', {className: 'row narrow'}, [
          ['span', {className: 'rowlabel'}, 'boolean'],
          ['io-string', {value: this.bind('boolean')}],
          ['io-number', {value: this.bind('boolean')}],
          ['io-boolean', {type: 'boolean', value: this.bind('boolean')}],
        ]],
        ['div', {className: 'row narrow'}, [
          ['span', {className: 'rowlabel'}, 'NaN'],
          ['io-string', {value: this.bind('NaN')}],
          ['io-number', {value: this.bind('NaN')}],
          ['io-boolean', {type: 'boolean', value: this.bind('NaN')}],
        ]],
        ['div', {className: 'row narrow'}, [
          ['span', {className: 'rowlabel'}, 'null'],
          ['io-string', {value: this.bind('null')}],
          ['io-number', {value: this.bind('null')}],
          ['io-boolean', {type: 'boolean', value: this.bind('null')}],
        ]],
        ['div', {className: 'row narrow'}, [
          ['span', {className: 'rowlabel'}, 'undefined'],
          ['io-string', {value: this.bind('undefined')}],
          ['io-number', {value: this.bind('undefined')}],
          ['io-boolean', {type: 'boolean', value: this.bind('undefined')}],
        ]],
      ]],
      ['div', {className: 'demo'}, [
        ['span', {className: 'rowlabel'}, 'io-option'],
        ['io-option', {options: [
          {label: 'one', value: 1},
          {label: 'two', value: 2},
          {label: 'three', value: 3},
          {label: 'four', value: 4}
        ], value: 1}],
      ]],
      ['div', {className: 'demo'}, [
        ['span', {className: 'rowlabel'}, 'io-object'],
        ['io-object', {label: 'Obj', value: {
          "number": 1337,
          "string": 'hello',
          "boolean": true,
          "null": null,
          "NaN": NaN,
          "undef": undefined,
          "array": [1,2,3,4,"apple"]
        }, expanded: true, labeled: true}]
      ]],
      ['io-menu-group', {className: 'menubar', options: this.menuoptions, horizontal: true}],
      ['div', {className: 'demo menuarea'}, [
        ['h3', 'io-menu (click)'],
        ['io-menu', {options: this.menuoptions, position: 'pointer'}]
      ]],
      ['div', {className: 'demo menuarea'}, [
        ['h3', 'io-menu (contextmenu)'],
        ['io-menu', {options: this.menuoptions, position: 'pointer', listener: 'contextmenu'}]
      ]]
    ]);
  }
}

IoDemo.Register();

export { IoBoolean, IoButton, IoMenu, IoMenuItem, IoMenuGroup, IoMenuLayer, IoNumber, IoObject, IoOption, IoSlider, IoString, IoDemo };
