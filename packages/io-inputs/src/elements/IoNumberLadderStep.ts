import { Register, ReactiveProperty, span, Property } from 'io-gui';
import { IoField, IoFieldProps } from './IoField.js';

export type IoNumberLadderStepProps = IoFieldProps & {
  value?: number,
  label?: string,
};

//TODO: Dont extend IoField.
@Register
export class IoNumberLadderStep extends IoField {
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
      :host:focus {
        background-color: var(--io_bgColor) !important;
      }
      /* TODO: use icons */
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

  declare private startX: number;

  constructor(args: IoNumberLadderStepProps = {}) { super(args); }

  onKeydown(event: KeyboardEvent) {
    // TODO: fix ladder focus handling. Wrap around.
    let stepMove = 0;
    switch (event.key) {
      case 'Enter':
      case 'Escape':
      case ' ':
        this.dispatch('ladder-step-collapse', {}, true);
        break;
      case 'ArrowLeft':
      case 'Backspace':
        event.preventDefault();
        stepMove = this.value * -1;
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.dispatch('io-focus-to', {source: this, command: event.key}, true);
        break;
      case 'ArrowRight':
        event.preventDefault();
        stepMove = this.value * 1;
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.dispatch('io-focus-to', {source: this, command: event.key}, true);
        break;
    }
    if (stepMove !== 0) {
      this.dispatch('ladder-step-change', {step: Number(stepMove.toFixed(5)), round: event.shiftKey}, true);
    }
  }
  onPointerdown(event: PointerEvent) {
    this.setPointerCapture(event.pointerId);
    this.addEventListener('pointermove', this.onPointermove);
    this.addEventListener('pointerup', this.onPointerup);
    this.startX = event.clientX;
  }
  onPointermove(event: PointerEvent) {
    const deltaX = event.clientX - this.startX;
    if (Math.abs(deltaX) > 5) {
      const expMove = Math.pow(deltaX / 5, 2) * deltaX < 0 ? -1: 1;
      const roundMove = deltaX > 0 ? Math.floor(expMove) : Math.ceil(expMove);
      const stepMove = this.value * roundMove;
      this.startX = event.clientX;
      this.dispatch('ladder-step-change', {step: Number(stepMove.toFixed(5)), round: event.shiftKey}, true);
    }
  }
  onPointerup(event: PointerEvent) {
    this.releasePointerCapture(event.pointerId);
    this.removeEventListener('pointermove', this.onPointermove);
    this.removeEventListener('pointerup', this.onPointerup);
    this.dispatch('ladder-step-collapse', {}, true);
  }
  ready() {
    this.changed();
  }
  changed() {
    this.render([span(this.label)]);
    this.setAttribute('aria-label', this.label);
    this.setAttribute('aria-valuestep', this.label);
  }
}
export const ioNumberLadderStep = function(arg0?: IoNumberLadderStepProps) {
  return IoNumberLadderStep.vConstructor(arg0);
};