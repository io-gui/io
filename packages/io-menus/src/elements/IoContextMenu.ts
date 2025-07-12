import { Register, IoElement, ReactiveProperty, IoOverlaySingleton as Overlay, IoElementProps, WithBinding } from 'io-gui';
import { MenuOptions } from '../nodes/MenuOptions.js';
import { IoMenuOptions } from './IoMenuOptions.js';
import { onOverlayPointerdown, onOverlayPointermove, onOverlayPointeup } from './IoMenuItem.js';

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

  @ReactiveProperty({type: MenuOptions})
  declare options: MenuOptions;

  @ReactiveProperty({value: false, reflect: true})
  declare expanded: boolean;

  @ReactiveProperty(0)
  declare button: number;

  declare $options: IoMenuOptions;
  declare _contextTimeout: number;

  static get ReactiveProperties(): any {
    return {
      $options: null,
    };
  }

  constructor(args: IoContextMenuProps = {}) {
    super(args);
    this.$options = new IoMenuOptions({
      expanded: this.bind('expanded'),
      options: this.bind('options'),
      $parent: this,
    });
  }

  init() {
    this.collapse = this.collapse.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    Overlay.appendChild(this.$options as HTMLElement);
    this.parentElement!.addEventListener('pointerdown', this.onPointerdown);
    this.parentElement!.addEventListener('click', (this as any).onClick);
    this.parentElement!.addEventListener('contextmenu', this.onContextmenu);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    Overlay.removeChild(this.$options as HTMLElement);
    this.parentElement!.removeEventListener('pointerdown', this.onPointerdown);
    this.parentElement!.removeEventListener('click', (this as any).onClick);
    this.parentElement!.removeEventListener('contextmenu', this.onContextmenu);
  }
  getBoundingClientRect() {
    return this.parentElement!.getBoundingClientRect();
  }
  onContextmenu(event: MouseEvent) {
    if (this.button === 2) event.preventDefault();
  }
  onPointerdown(event: PointerEvent) {
    event.stopPropagation();

    this.$options.style.left = `${event.clientX}px`;
    this.$options.style.top = `${event.clientY}px`;

    this.parentElement!.addEventListener('pointermove', this.onPointermove);
    this.parentElement!.addEventListener('pointerleave', this.onPointerleave);
    this.parentElement!.addEventListener('pointerup', this.onPointerup);

    clearTimeout(this._contextTimeout);
    if (event.pointerType !== 'touch') {
      if (event.button === this.button) {
        this.setPointerCapture(event.pointerId);
        this.expanded = true;
        // TODO: keyboard focus navigation
      }
    } else {
      // iOS Safari contextmenu event emulation.
      event.preventDefault();
      this._contextTimeout = setTimeout(() => {
        this.setPointerCapture(event.pointerId);
        this.expanded = true;
        // TODO: keyboard focus navigation
      }, 150);
    }
    onOverlayPointerdown.call(this, event);
  }
  onPointermove(event: PointerEvent) {
    event.stopPropagation();
    clearTimeout(this._contextTimeout);
    if (event.pointerType === 'touch') {
      // Let touch scroll the document.
      if (!this.expanded) return;
    }
    onOverlayPointermove.call(this, event);
  }
  onPointerup(event: PointerEvent) {
    clearTimeout(this._contextTimeout);
    this.releasePointerCapture(event.pointerId);
    this.parentElement!.removeEventListener('pointermove', this.onPointermove);
    this.parentElement!.removeEventListener('pointerleave', this.onPointerleave);
    this.parentElement!.removeEventListener('pointerup', this.onPointerup);
    onOverlayPointeup.call(this, event);
  }
  onPointerleave(event: PointerEvent) {
    this.releasePointerCapture(event.pointerId);
    this.parentElement!.removeEventListener('pointermove', this.onPointermove);
    this.parentElement!.removeEventListener('pointerleave', this.onPointerleave);
    this.parentElement!.removeEventListener('pointerup', this.onPointerup);
  }
  collapse() {
    Overlay.collapse();
  }
}
export const ioContextMenu = function(arg0?: IoContextMenuProps) {
  return IoContextMenu.vConstructor(arg0);
};