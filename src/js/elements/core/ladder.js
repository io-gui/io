import { IoElement, RegisterIoElement } from '../../components/io-element.js';
import { IoItem } from './item.js';
import { IoLayerSingleton } from './layer.js';
let lastFocus = null;
{
    window.addEventListener('focusin', () => {
        lastFocus = document.activeElement;
    }, { capture: false });
    window.addEventListener('blur', () => {
        setTimeout(() => {
            if (document.activeElement === document.body) {
                lastFocus = null;
            }
        });
    }, { capture: true });
}
/*
 * Extends `IoElement`. Implements `IoLadderStep` and `IoItem`.
 *
 * Interactive number ladder. When dragged horizontally, it changes the value in step increments. Dragging speed affects the rate of change exponentially. Up/down arrow keys change the step focus while left/right change the value in step increments. Escape key collapses the ladder and restores the focus to previously focused element. If shift key is pressed, value is rounded to the nearest step incement.
 *
 * <io-element-demo element="io-ladder" expanded properties='{"value": 0, "step": 0.0001, "conversion": 1, "min": -10000, "max": 10000, "expanded": true}'></io-element-demo>
 **/
export class IoLadderStep extends IoItem {
    static get Style() {
        return /* css */ `
    :host {
      pointer-events: all;
      display: inline-block;
      cursor: ew-resize;
      text-align: center;
      background-color: var(--io-background-color-highlight);
      color: var(--io-color);
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
    static get Properties() {
        return {
            role: 'spinbutton',
            type: {
                value: 'number',
                reflect: 1,
            },
        };
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
            this.setAttribute('aria-valuenow', this.parentElement.value);
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
    applyAria() {
        super.applyAria();
        this.setAttribute('aria-valuemax', this.parentElement.max);
        this.setAttribute('aria-valuemin', this.parentElement.min);
        this.setAttribute('aria-valuenow', this.parentElement.value);
    }
}
RegisterIoElement(IoLadderStep);
export class IoLadder extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      position: relative;
      pointer-events: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      display: flex;
      flex-direction: column;
    }
    :host:not([expanded]) {
      visibility: hidden;
    }
    :host:not([expanded]) > io-ladder-step {
      opacity: 0.5;
    }
    :host > io-ladder-step:nth-child(-n+5) {
      box-shadow: 0 -1px 4px rgba(0,0,0,0.2);
    }
    :host > io-ladder-step:nth-child(n+6) {
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    }
    :host > .io-up1,
    :host > .io-down1{
      z-index: 4;
      transition: opacity 0.1s, transform 0.1s;
    }
    :host > .io-up2,
    :host > .io-down2 {
      z-index: 3;
      opacity: 0.8;
      transition: opacity 0.2s, transform 0.2s;
    }
    :host:not([expanded]) > .io-up4 {
      transform: translateY(calc(3 * var(--io-item-height)));
    }
    :host:not([expanded]) > .io-up3 {
      transform: translateY(calc(2 * var(--io-item-height)));
    }
    :host:not([expanded]) > .io-up2 {
      transform: translateY(calc(1 * var(--io-item-height)));
    }
    :host:not([expanded]) > .io-down2 {
      transform: translateY(calc(-1 * var(--io-item-height)));
    }
    :host:not([expanded]) > .io-down3 {
      transform: translateY(calc(-2 * var(--io-item-height)));
    }
    :host:not([expanded]) > .io-down4 {
      transform: translateY(calc(-3 * var(--io-item-height)));
    }
    :host > .io-up3,
    :host > .io-down3 {
      z-index: 2;
      opacity: 0.6;
      transition: opacity 0.4s, transform 0.4s;
    }
    :host > .io-up4,
    :host > .io-down4 {
      z-index: 1;
      opacity: 0.4;
      transition: opacity 0.8s, transform 0.8s;
    }
    :host > io-ladder-step:hover,
    :host > io-ladder-step:focus {
      background-color: var(--io-background-color-highlight);
      border-color: var(--io-color-focus);
      transition: opacity 0.2s;
      opacity: 1;
    }
    :host > .io-ladder-empty {
      height: var(--io-item-height);
    }
    :host > .io-ladder-center {
      height: calc(1.5 * var(--io-item-height));
    }
    `;
    }
    static get Properties() {
        return {
            src: null,
            conversion: 1,
            expanded: {
                type: Boolean,
                reflect: 1,
            },
            min: -Infinity,
            max: Infinity,
            step: 0.0001,
            role: 'list',
        };
    }
    static get Listeners() {
        return {
            'ladder-step-change': '_onLadderStepChange',
            'ladder-step-collapse': '_onLadderStepCollapse',
            'focusin': '_onFocusIn',
        };
    }
    get value() {
        return this.src ? this.src.value : 0;
    }
    _onFocusIn(event) {
        event.stopPropagation();
    }
    _onFocusTo(event) {
        event.stopPropagation();
        const srcStep = event.composedPath()[0];
        const src = this.src;
        const dir = event.detail.dir;
        if (src) {
            if ((srcStep === this.querySelector('.io-up1') && dir === 'down') ||
                (srcStep === this.querySelector('.io-down1') && dir === 'up')) {
                src.focus();
                src.selectionStart = src.selectionEnd = src.textNode.length;
                return;
            }
        }
        super._onFocusTo(event);
    }
    _onLadderStepChange(event) {
        const src = this.src;
        if (this.src) {
            const step = event.detail.step;
            const value = event.detail.round ? (Math.round(this.value / step) * step) : this.value;
            let newValue = Math.min(this.max, Math.max(this.min, value + step));
            newValue = Number(newValue.toFixed(5));
            src.set('value', newValue);
        }
    }
    _onLadderStepCollapse() {
        this.set('expanded', false);
    }
    srcChanged() {
        const src = this.src;
        if (src)
            this.setProperties({
                min: src.min,
                max: src.max,
                step: src.step,
                conversion: src.conversion,
            });
    }
    expandedChanged() {
        const src = this.src;
        if (this.expanded) {
            if (src) {
                const rect = src.getBoundingClientRect();
                // NOTE: layerRect fix for Safari zoom.
                const layerRect = IoLayerSingleton.getBoundingClientRect();
                this.style.top = rect.bottom - layerRect.top + 'px';
                this.style.left = rect.left - layerRect.left + 'px';
                this.style.position = 'absolute';
                this.style.marginTop = 'calc(-5.25 * var(--io-item-height))';
            }
            else {
                this.removeAttribute('style');
            }
        }
        else {
            if (src && src._pointerType !== 'touch') {
                src.focus();
            }
            else if (lastFocus) {
                lastFocus.focus();
            }
        }
        this.dispatchEvent('expanded', { value: this.expanded }, true);
    }
    changed() {
        const range = this.max - this.min;
        const hiddenItem = ['span', { class: 'io-ladder-empty' }];
        // TODO: unhack
        let step = this.step / 10000;
        while (step < .1)
            step = step * 10;
        const upStep4 = 10000 * step;
        const upStep3 = 1000 * step;
        const upStep2 = 100 * step;
        const upStep1 = 10 * step;
        const downStep1 = 1 * step;
        const downStep2 = .1 * step;
        const downStep3 = .01 * step;
        const downStep4 = .001 * step;
        const upLabel4 = Number((upStep4 * this.conversion).toFixed(6));
        const upLabel3 = Number((upStep3 * this.conversion).toFixed(6));
        const upLabel2 = Number((upStep2 * this.conversion).toFixed(6));
        const upLabel1 = Number((upStep1 * this.conversion).toFixed(6));
        const downLabel1 = Number((downStep1 * this.conversion).toFixed(6));
        const downLabel2 = Number((downStep2 * this.conversion).toFixed(6));
        const downLabel3 = Number((downStep3 * this.conversion).toFixed(6));
        const downLabel4 = Number((downStep4 * this.conversion).toFixed(6));
        this.template([
            (range >= upStep4) ? ['io-ladder-step', { class: 'io-up4', value: upStep4, label: String(upLabel4) }] : hiddenItem,
            (range >= upStep3) ? ['io-ladder-step', { class: 'io-up3', value: upStep3, label: String(upLabel3) }] : hiddenItem,
            (range >= upStep2) ? ['io-ladder-step', { class: 'io-up2', value: upStep2, label: String(upLabel2) }] : hiddenItem,
            (range >= upStep1) ? ['io-ladder-step', { class: 'io-up1', value: upStep1, label: String(upLabel1) }] : hiddenItem,
            ['span', { class: 'io-ladder-center' }],
            (this.step <= downStep1) ? ['io-ladder-step', { class: 'io-down1', value: downStep1, label: String(downLabel1) }] : hiddenItem,
            (this.step <= downStep2) ? ['io-ladder-step', { class: 'io-down2', value: downStep2, label: String(downLabel2) }] : hiddenItem,
            (this.step <= downStep3) ? ['io-ladder-step', { class: 'io-down3', value: downStep3, label: String(downLabel3) }] : hiddenItem,
            (this.step <= downStep4) ? ['io-ladder-step', { class: 'io-down4', value: downStep4, label: String(downLabel4) }] : hiddenItem,
        ]);
        const steps = this.querySelectorAll('io-ladder-step');
        for (let i = steps.length; i--;)
            steps[i].applyAria();
    }
}
RegisterIoElement(IoLadder);
export const IoLadderSingleton = new IoLadder();
IoLayerSingleton.appendChild(IoLadderSingleton);
//# sourceMappingURL=ladder.js.map