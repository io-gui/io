import { Register, IoElement, ReactiveProperty, IoOverlaySingleton as Overlay, IoElementProps, VDOMElement, WithBinding } from 'io-gui';
import { MenuOptions } from '../nodes/MenuOptions.js';
import { IoMenuOptions } from './IoMenuOptions.js';

export type IoContextMenuProps = IoElementProps & {
  options?: MenuOptions,
  expanded?: WithBinding<boolean>,
  button?: number,
};

/**
 * An invisible element that inserts a floating menu when its `parentElement` is clicked. Menu position is set by the pointer by default but it can be configured to expand to the side of the parent element by setting the `position` property. Default `button` property for menu expansion is `0` (left mouse button), but it can be configured for other buttons. You can have multiple `IoContextMenu` instances under the same `parentElement` as long as the `button` properties are different.
 **/
@Register
export class IoContextMenu extends IoElement {
  static vConstructor: (arg0?: IoContextMenuProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;

  @ReactiveProperty({type: MenuOptions})
  declare options: MenuOptions;

  @ReactiveProperty({value: false, reflect: true})
  declare expanded: boolean;

  @ReactiveProperty(0)
  declare button: number;

  static get ReactiveProperties(): any {
    return {
      $options: null,
    };
  }

  constructor(args: IoContextMenuProps = {}) { super(args); }

  connectedCallback() {
    super.connectedCallback();
    Overlay.addEventListener('pointermove', this.onOverlayPointermove);
    this.$parent = this.parentElement;
    this.$parent.addEventListener('pointerdown', this.onPointerdown);
    this.$parent.addEventListener('click', this.onClick);
    this.$parent.addEventListener('contextmenu', this.onContextmenu);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.$options && this.$options.parentElement) Overlay.removeChild(this.$options);
    Overlay.removeEventListener('pointermove', this.onOverlayPointermove);
    this.$parent.removeEventListener('pointerdown', this.onPointerdown);
    this.$parent.removeEventListener('contextmenu', this.onContextmenu);
    this.$parent.removeEventListener('pointermove', this.onPointermove);
    this.$parent.removeEventListener('pointerup', this.onPointerup);
    this.$parent.removeEventListener('click', this.onClick);
    delete this.$parent;
  }
  getBoundingClientRect() {
    return this.$parent.getBoundingClientRect();
  }
  onContextmenu(event: MouseEvent) {
    if (this.button === 2) event.preventDefault();
  }
  onPointerdown(event: PointerEvent) {
    this.$options.style.left = `${event.clientX}px`;
    this.$options.style.top = `${event.clientY}px`;
    this.$parent.addEventListener('pointermove', this.onPointermove);
    this.$parent.addEventListener('pointerup', this.onPointerup);

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
      this.$options?.querySelector('io-menu-item')?.onPointerupAction(event);
    }
    this.$parent.removeEventListener('pointermove', this.onPointermove);
    this.$parent.removeEventListener('pointerup', this.onPointerup);
  }
  onOverlayPointermove(event: PointerEvent) {
    if (this.expanded) this.onPointermove(event);
  }
  onClick(event: MouseEvent) {
    if (event.button === this.button && event.button !== 2) this.expanded = true;
  }
  collapse() {
    Overlay.collapse();
  }
  optionsChanged() {
    if (this.$options) {
      Overlay.removeChild(this.$options);
      this.$options.template([]);
      this.$options.dispose();
    }
    this.$options = new IoMenuOptions({
      expanded: this.bind('expanded'),
      options: this.options,
      $parent: this,
    });
    Overlay.appendChild(this.$options);
  }
}
export const ioContextMenu = IoContextMenu.vConstructor;