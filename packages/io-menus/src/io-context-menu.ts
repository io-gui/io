import { Register, IoElement, Property, IoOverlaySingleton as Overlay, IoElementArgs, VDOMElement, ArgsWithBinding } from 'io-gui';
import { MenuOptions } from './models/menu-options.js';
import { IoMenuOptions } from './io-menu-options.js';

export type IoContextMenuArgs = IoElementArgs & ArgsWithBinding<{
  options?: MenuOptions;
  expanded?: boolean;
  button?: number;
}>;

/**
 * An invisible element that inserts a floating menu when its `parentElement` is clicked. Menu position is set by the pointer by default but it can be configured to expand to the side of the parent element by setting the `position` property. Default `button` property for menu expansion is `0` (left mouse button), but it can be configured for other buttons. You can have multiple `IoContextMenu` instances under the same `parentElement` as long as the `button` properties are different.
 **/
@Register
export class IoContextMenu extends IoElement {
  static vConstructor: (arg0?: IoContextMenuArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;

  @Property({type: MenuOptions})
  declare options: MenuOptions;

  @Property({value: false, reflect: true})
  declare expanded: boolean;

  @Property(0)
  declare button: number;

  static get Properties(): any {
    return {
      $options: null,
    };
  }

  constructor(args: IoContextMenuArgs = {}) { super(args); }

  connectedCallback() {
    super.connectedCallback();
    Overlay.addEventListener('pointermove', this._onOverlayPointermove);
    this._parent = this.parentElement;
    this._parent.addEventListener('pointerdown', this.onPointerdown);
    this._parent.addEventListener('click', this._onClick);
    this._parent.addEventListener('contextmenu', this.onContextmenu);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.$options && this.$options.parentElement) Overlay.removeChild(this.$options);
    Overlay.removeEventListener('pointermove', this._onOverlayPointermove);
    this._parent.removeEventListener('pointerdown', this.onPointerdown);
    this._parent.removeEventListener('contextmenu', this.onContextmenu);
    this._parent.removeEventListener('pointermove', this.onPointermove);
    this._parent.removeEventListener('pointerup', this.onPointerup);
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
      this.dispatchEvent('item-clicked', d, true);
      this.throttle(this._onCollapse);
    }
  }
  onContextmenu(event: MouseEvent) {
    if (this.button === 2) event.preventDefault();
  }
  onPointerdown(event: PointerEvent) {
    Overlay.x = event.clientX;
    Overlay.y = event.clientY;
    this._parent.addEventListener('pointermove', this.onPointermove);
    this._parent.addEventListener('pointerup', this.onPointerup);

    clearTimeout(this._contextTimeout);
    if (event.pointerType !== 'touch') {
      if (event.button === this.button) {
        this.setPointerCapture(event.pointerId);
        this.expanded = true;
      }
    } else {
      // iOS Safari contextmenu event emulation.
      event.preventDefault();
      this._contextTimeout = setTimeout(() => {
        this.setPointerCapture(event.pointerId);
        this.expanded = true;
      }, 150);
    }
  }
  onPointermove(event: PointerEvent) {
    clearTimeout(this._contextTimeout);
    if (this.expanded) {
      this.$options?.querySelector('io-menu-item')?.onPointermoveAction(event);
    }
  }
  onPointerup(event: PointerEvent) {
    clearTimeout(this._contextTimeout);
    this.releasePointerCapture(event.pointerId);
    if (this.expanded) {
      this.$options?.querySelector('io-menu-item')?.onPointerupAction(event, true);
    }
    this._parent.removeEventListener('pointermove', this.onPointermove);
    this._parent.removeEventListener('pointerup', this.onPointerup);
  }
  _onOverlayPointermove(event: PointerEvent) {
    if (this.expanded) this.onPointermove(event);
  }
  _onClick(event: MouseEvent) {
    if (event.button === this.button && event.button !== 2) this.expanded = true;
  }
  _onCollapse() {
    this.expanded = false;
  }
  optionsChanged() {
    if (this.$options) {
      Overlay.removeChild(this.$options);
      this.$options.template([]);
      this.$options.dispose();
    }
    this.$options = new IoMenuOptions({
      expanded: this.bind('expanded'),
      inlayer: true,
      options: this.options,
      direction: 'pointer',
      $parent: this,
      '@item-clicked': this._onItemClicked,
    });
    Overlay.appendChild(this.$options);
  }
  // expandedChanged() {
  //   if (this.$options && !this.expanded) {
  //     const descendants = getMenuDescendants(this.$options as unknown as IoMenuItem); // TODO fix
  //     for (let i = descendants.length; i--;) {
  //       descendants[i].expanded = false;
  //     }
  //   }
  // }
}
export const ioContextMenu = IoContextMenu.vConstructor;