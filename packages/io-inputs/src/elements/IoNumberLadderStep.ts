import { Register, ReactiveProperty, span, VDOMElement, Property } from 'io-gui';
import { IoField, IoFieldProps } from './IoField';

export type IoNumberLadderStepProps = IoFieldProps & {
  value?: number,
  label?: string,
};

@Register
export class IoNumberLadderStep extends IoField {
  static vConstructor: (arg0?: IoNumberLadderStepProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        pointer-events: all;
        display: inline-block;
        cursor: ew-resize;
        text-align: center;
        background-color: var(--io_bgColorStrong) !important;
        color: var(--io_color);
        align-self: stretch;
        touch-action: none;
        width: 6em;
      }
      :host:before {
        float: left;
        content: '<';
        opacity: 0.25;
      }
      :host:after {
        float: right;
        content: '>';
        opacity: 0.25;
      }
    `;
  }

  @ReactiveProperty({value: 1, type: Number})
  declare value: number;

  @ReactiveProperty({value: '', type: String})
  declare label: string;

  @Property('spinbutton')
  declare role: string;

  constructor(args: IoNumberLadderStepProps = {}) { super(args); }

  onKeydown(event: KeyboardEvent) {
    let stepMove = 0;
    if (event.key === 'Escape' || event.key === ' ') {
      this.dispatchEvent('ladder-step-collapse', {}, true);
    } else if (event.key === 'ArrowLeft' || event.key === 'Backspace') {
      event.preventDefault();
      stepMove = this.value * -1;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.dispatchEvent('io-focus-to', {source: this, direction: 'up'}, true);
    } else if (event.key === 'ArrowRight' || event.key === 'Enter') {
      event.preventDefault();
      stepMove = this.value * 1;
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.dispatchEvent('io-focus-to', {source: this, direction: 'down'}, true);
    }
    if (stepMove !== 0) {
      this.dispatchEvent('ladder-step-change', {step: Number(stepMove.toFixed(5)), round: event.shiftKey}, true);
    }
  }
  onPointerdown(event: PointerEvent) {
    this.setPointerCapture(event.pointerId);
    this.addEventListener('pointermove', this.onPointermove);
    this.addEventListener('pointerup', this.onPointerup);
    this._startX = event.clientX;
  }
  onPointermove(event: PointerEvent) {
    const deltaX = event.clientX - this._startX;
    if (Math.abs(deltaX) > 5) {
      const expMove = Math.pow(deltaX / 5, 2) * deltaX < 0 ? -1: 1;
      const roundMove = deltaX > 0 ? Math.floor(expMove) : Math.ceil(expMove);
      const stepMove = this.value * roundMove;
      this._startX = event.clientX;
      this.dispatchEvent('ladder-step-change', {step: Number(stepMove.toFixed(5)), round: event.shiftKey}, true);
    }
  }
  onPointerup(event: PointerEvent) {
    this.releasePointerCapture(event.pointerId);
    this.removeEventListener('pointermove', this.onPointermove);
    this.removeEventListener('pointerup', this.onPointerup);
    this.dispatchEvent('ladder-step-collapse', {}, true);
  }
  ready() {
    this.changed();
  }
  changed() {
    this.render([
      span(this.label)
    ]);
    this.setAttribute('aria-label', this.label);
    this.setAttribute('aria-valuestep', this.label);
  }
}
export const ioNumberLadderStep = IoNumberLadderStep.vConstructor;