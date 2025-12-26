var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveProperty, span, Property } from 'io-core';
import { IoField } from './IoField.js';
//TODO: Dont extend IoField.
let IoNumberLadderStep = class IoNumberLadderStep extends IoField {
    static get Style() {
        return /* css */ `
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
    constructor(args) { super(args); }
    onKeydown(event) {
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
                this.dispatch('io-focus-to', { source: this, command: event.key }, true);
                break;
            case 'ArrowRight':
                event.preventDefault();
                stepMove = this.value * 1;
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.dispatch('io-focus-to', { source: this, command: event.key }, true);
                break;
        }
        if (stepMove !== 0) {
            this.dispatch('ladder-step-change', { step: Number(stepMove.toFixed(5)), round: event.shiftKey }, true);
        }
    }
    onPointerdown(event) {
        this.setPointerCapture(event.pointerId);
        this.addEventListener('pointermove', this.onPointermove);
        this.addEventListener('pointerup', this.onPointerup);
        this.startX = event.clientX;
    }
    onPointermove(event) {
        const deltaX = event.clientX - this.startX;
        if (Math.abs(deltaX) > 5) {
            const expMove = Math.pow(deltaX / 5, 2) * deltaX < 0 ? -1 : 1;
            const roundMove = deltaX > 0 ? Math.floor(expMove) : Math.ceil(expMove);
            const stepMove = this.value * roundMove;
            this.startX = event.clientX;
            this.dispatch('ladder-step-change', { step: Number(stepMove.toFixed(5)), round: event.shiftKey }, true);
        }
    }
    onPointerup(event) {
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
};
__decorate([
    ReactiveProperty({ value: 1, type: Number })
], IoNumberLadderStep.prototype, "value", void 0);
__decorate([
    ReactiveProperty({ value: '', type: String })
], IoNumberLadderStep.prototype, "label", void 0);
__decorate([
    Property('spinbutton')
], IoNumberLadderStep.prototype, "role", void 0);
IoNumberLadderStep = __decorate([
    Register
], IoNumberLadderStep);
export { IoNumberLadderStep };
export const ioNumberLadderStep = function (arg0) {
    return IoNumberLadderStep.vConstructor(arg0);
};
//# sourceMappingURL=IoNumberLadderStep.js.map