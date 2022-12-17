import { IoElement, RegisterIoElement } from '../../core/element.js';
import {IoOverlaySingleton as Overlay} from '../../core/overlay.js';
import {IoMenuOptions} from './io-menu-options.js';
import {getMenuDescendants, IoMenuItem} from './io-menu-item.js';

/**
 * An invisible element that inserts a floating menu when its `parentElement` is clicked. Menu position is set by the pointer by default but it can be configured to expand to the side of the parent element by setting the `position` property. Default `button` property for menu expansion is `0` (left mouse button), but it can be configured for other buttons. You can have multiple `IoContextMenu` instances under the same `parentElement` as long as the `button` properties are different.
 *
 * <io-element-demo element="io-context-menu"
 *   height="256px"
 *   properties='{
 *   "value": "hello world",
 *   "button": 0,
 *   "options": ["one", "two", "three"],
 *   "expanded": false,
 *   "position": "pointer",
 *   "selectable": false
 * }' config='{
 *   "position": ["io-option-menu", {"options": ["pointer", "up", "right", "down", "left"]}], "type:object": ["io-object"]
 * }'></io-element-demo>
 **/
@RegisterIoElement
export class IoContextMenu extends IoElement {
  static get Properties(): any {
    return {
      value: null,
      options: {
        type: Array,
        observe: true,
      },
      expanded: Boolean,
      position: 'pointer',
      button: 0,
      selectable: false,
      $options: null,
    };
  }
  connectedCallback() {
    super.connectedCallback();
    Overlay.addEventListener('pointermove', this._onOverlayPointermove);
    this._parent = this.parentElement;
    this._parent.style.userSelect = 'none';
    this._parent.style.webkitUserSelect = 'none';
    this._parent.style.webkitTouchCallout = 'default';
    this._parent.addEventListener('pointerdown', this._onPointerdown);
    this._parent.addEventListener('click', this._onClick);
    this._parent.addEventListener('contextmenu', this._onContextmenu);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.$options && this.$options.parentElement) Overlay.removeChild(this.$options);
    Overlay.removeEventListener('pointermove', this._onOverlayPointermove);
    this._parent.style.userSelect = null;
    this._parent.style.webkitUserSelect = null;
    this._parent.style.webkitTouchCallout = null;
    this._parent.removeEventListener('pointerdown', this._onPointerdown);
    this._parent.removeEventListener('contextmenu', this._onContextmenu);
    this._parent.removeEventListener('pointermove', this._onPointermove);
    this._parent.removeEventListener('pointerup', this._onPointerup);
    this._parent.removeEventListener('click', this._onClick);
    delete this._parent;
  }
  getBoundingClientRect() {
    return this._parent.getBoundingClientRect();
  }
  _onItemClicked(event: CustomEvent) {
    const item = event.composedPath()[0] as HTMLElement;
    const d = event.detail;
    if (item !== (this as any)) {
      event.stopImmediatePropagation();
      if (d.value !== undefined && d.selectable !== false) this.inputValue(d.value);
      this.dispatchEvent('item-clicked', d, true);
      this.throttle(this._onCollapse);
    }
  }
  _onContextmenu(event: MouseEvent) {
    if (this.button === 2) event.preventDefault();
  }
  _onPointerdown(event: PointerEvent) {
    Overlay.x = event.clientX;
    Overlay.y = event.clientY;
    this._parent.addEventListener('pointermove', this._onPointermove);
    this._parent.addEventListener('pointerup', this._onPointerup);
    clearTimeout(this._contextTimeout);
    if (event.pointerType !== 'touch') {
      if (event.button === this.button) {
        this.expanded = true;
        Overlay.skipCollapse = true;
      }
    } else {
      // iOS Safari contextmenu event emulation.
      event.preventDefault();
      this._contextTimeout = setTimeout(() => {
        this.expanded = true;
        Overlay.skipCollapse = true;
      }, 150);
    }
  }
  _onPointermove(event: PointerEvent) {
    clearTimeout(this._contextTimeout);
    if (this.expanded && this.$options) {
      const item = this.$options.querySelector('io-menu-item');
      if (item) item._onPointermove(event);
    }
  }
  _onPointerup(event: PointerEvent) {
    clearTimeout(this._contextTimeout);
    if (this.expanded && this.$options) {
      const item = this.$options.querySelector('io-menu-item');
      if (item) item._onPointerup(event, {nocollapse: true});
    }
    this._parent.removeEventListener('pointermove', this._onPointermove);
    this._parent.removeEventListener('pointerup', this._onPointerup);
  }
  _onOverlayPointermove(event: PointerEvent) {
    if (this.expanded) this._onPointermove(event);
  }
  _onClick(event: MouseEvent) {
    if (event.button === this.button && event.button !== 2) this.expanded = true;
  }
  _onCollapse() {
    this.expanded = false;
  }
  expandedChanged() {
    if (this.expanded) {
      if (!this.$options) {
        this.$options = new IoMenuOptions({
          $parent: this,
          'on-item-clicked': this._onItemClicked,
        });
      }
      if (this.$options.parentElement !== Overlay) {
        Overlay.appendChild(this.$options);
      }
      this.$options.setProperties({
        // value: this.bind('value'),
        expanded: this.bind('expanded'),
        options: this.options,
        // selectable: this.selectable,
        position: this.position,
      });
    } else {
      const descendants = getMenuDescendants(this as unknown as IoMenuItem); // TODO fix
      for (let i = descendants.length; i--;) {
        descendants[i].expanded = false;
      }
    }
  }
}
