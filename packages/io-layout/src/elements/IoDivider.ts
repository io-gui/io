import { Register, ReactiveProperty, IoElement, IoElementProps, Property, ListenerDefinition } from 'io-core';

export type IoDividerProps = IoElementProps & {
  orientation: 'vertical' | 'horizontal',
  index: number,
};

@Register
export class IoDivider extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        position: relative;
        flex: 0 0 var(--io_spacing3);
        background-color: var(--io_colorLight);
        border-style: solid;
        border-width: 0 var(--io_borderWidth);
        border-color: var(--io_color);
        cursor: col-resize;
        @apply --unselectable;
      }
      :host[pressed] {
        border-color: var(--io_borderColorBlue);
        background-color: var(--io_bgColorBlue);
      }
      :host[pressed]:before,
      :host[pressed]:after {
        background-color: var(--io_colorWhite);
      }
      :host:before,
      :host:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 1;
        opacity: 0;
      }
      :host:before {
        width: var(--io_fieldHeight);
        height: var(--io_spacing);
        background-color: var(--io_color);
        transform: translate(-50%, -50%) rotate(90deg);
        border-radius: var(--io_spacing);
        opacity: 0.5;
      }
      :host[orientation='vertical']:before {
        transform: translate(-50%, -50%);
      }
      :host:after {
        width: var(--io_fieldHeight);
        height: var(--io_fieldHeight);
        background-color: var(--io_color);
        transform: translate(-50%, -50%) rotate(45deg);
        border-radius: 25%;
      }
      :host[orientation='vertical'] {
        cursor: row-resize;
        border-width: var(--io_borderWidth) 0;
      }
      :host:hover {
        border-style: dashed;
      }
      :host:hover:before {
        opacity: 1;
      }
    `;
  }

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare pressed: boolean;

  @ReactiveProperty({value: 'horizontal', type: String, reflect: true})
  declare orientation: 'horizontal' | 'vertical';

  @Property(Number)
  declare index: number;

  static get Listeners() {
    return {
      'pointerdown': 'onPointerdown',
      'touchstart': ['onTouchstart', {passive: false}] as ListenerDefinition,
    };
  }

  constructor(args: IoDividerProps) { super(args); }

  onPointerdown(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.addEventListener('pointermove', this.onPointermove);
    this.addEventListener('pointerleave', this.onPointerleave);
    this.addEventListener('pointerup', this.onPointerup);
    this.setPointerCapture(event.pointerId);
    this.pressed = true;
  }
  onPointermove(event: PointerEvent) {
    event.preventDefault();
    this.dispatch('io-divider-move', {
      index: this.index,
      clientX: event.clientX,
      clientY: event.clientY,
    }, true);
  }
  onPointerleave(event: PointerEvent) {
    event.preventDefault();
    this.removeEventListener('pointermove', this.onPointermove);
    this.removeEventListener('pointerleave', this.onPointerleave);
    this.removeEventListener('pointerup', this.onPointerup);
    this.pressed = false;
  }
  onPointerup(event: PointerEvent) {
    event.preventDefault();
    this.removeEventListener('pointermove', this.onPointermove);
    this.removeEventListener('pointerleave', this.onPointerleave);
    this.removeEventListener('pointerup', this.onPointerup);
    this.releasePointerCapture(event.pointerId);
    this.pressed = false;
    this.dispatch('io-divider-move-end', {
      index: this.index,
      clientX: event.clientX,
      clientY: event.clientY,
    }, true);
  }
  onTouchstart(event: TouchEvent) {
    this.addEventListener('touchmove', this.onTouchmove, {passive: false});
    this.addEventListener('touchend', this.onTouchend);
  }
  onTouchmove(event: TouchEvent) {
    event.preventDefault();
  }
  onTouchend() {
    this.removeEventListener('touchmove', this.onTouchmove);
    this.removeEventListener('touchend', this.onTouchend);
  }
}
export const ioDivider = function(arg0: IoDividerProps) {
  return IoDivider.vConstructor(arg0);
};
