var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, IoField } from 'io-gui';
let IoNumberLadderStep = class IoNumberLadderStep extends IoField {
    static get Style() {
        return /* css */ `
      :host {
        pointer-events: all;
        display: inline-block;
        cursor: ew-resize;
        text-align: center;
        background-color: var(--io_bgColorStrong);
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
    _onKeydown(event) {
        let stepMove = 0;
        if (event.key === 'Escape' || event.key === ' ') {
            this.dispatchEvent('ladder-step-collapse', {}, true);
        }
        else if (event.key === 'ArrowLeft' || event.key === 'Backspace') {
            event.preventDefault();
            stepMove = this.value * -1;
        }
        else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.focusTo('up');
        }
        else if (event.key === 'ArrowRight' || event.key === 'Enter') {
            event.preventDefault();
            stepMove = this.value * 1;
        }
        else if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.focusTo('down');
        }
        if (stepMove !== 0) {
            this.dispatchEvent('ladder-step-change', { step: Number(stepMove.toFixed(5)), round: event.shiftKey }, true);
        }
    }
    _onPointerdown(event) {
        this.setPointerCapture(event.pointerId);
        this.addEventListener('pointermove', this._onPointermove);
        this.addEventListener('pointerup', this._onPointerup);
        this._startX = event.clientX;
    }
    _onPointermove(event) {
        const deltaX = event.clientX - this._startX;
        if (Math.abs(deltaX) > 5) {
            const expMove = Math.pow(deltaX / 5, 2) * deltaX < 0 ? -1 : 1;
            const roundMove = deltaX > 0 ? Math.floor(expMove) : Math.ceil(expMove);
            const stepMove = this.value * roundMove;
            this._startX = event.clientX;
            this.dispatchEvent('ladder-step-change', { step: Number(stepMove.toFixed(5)), round: event.shiftKey }, true);
        }
    }
    _onPointerup(event) {
        this.releasePointerCapture(event.pointerId);
        this.removeEventListener('pointermove', this._onPointermove);
        this.removeEventListener('pointerup', this._onPointerup);
        this.dispatchEvent('ladder-step-collapse', {}, true);
    }
    init() {
        this.changed();
    }
    changed() {
        super.changed();
        this.setAttribute('aria-valuestep', this.value);
    }
};
__decorate([
    Property({ value: 1, type: Number })
], IoNumberLadderStep.prototype, "value", void 0);
__decorate([
    Property({ value: 'number', type: String, reflect: true })
], IoNumberLadderStep.prototype, "type", void 0);
__decorate([
    Property({ value: 'spinbutton', type: String })
], IoNumberLadderStep.prototype, "role", void 0);
IoNumberLadderStep = __decorate([
    Register
], IoNumberLadderStep);
export { IoNumberLadderStep };
//# sourceMappingURL=io-number-ladder-step.js.map