import {IoElement, html} from "../../io.js";
import {IoItem} from "./item.js";
import {IoLayerSingleton} from "./layer.js";

class IoLadderStep extends IoItem {
  static get Style() {
    return html`<style>
      :host {
        pointer-events: all;
        display: inline-block;
        cursor: ew-resize;
        text-align: center;
        background-color: var(--io-background-color-light);
        align-self: stretch;
      }
      :host:before,
      :host:after {
        visibility: visible;
        opacity: 0.1;
      }
      :host:before {
        content: '< ';
      }
      :host:after {
        content: ' >';
      }
    </style>`;
  }
  _onKeydown(event) {
    let stepMove = 0;
    if (event.key === 'Escape') {
      this.dispatchEvent('ladder-step-collapse', {}, true);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      stepMove = this.value * -1;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusTo('up');
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      stepMove = this.value * 1;
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusTo('down');
    }
    if (stepMove !== 0) {
      let d = Math.max(0, Math.min(100, -Math.round(Math.log(this.value) / Math.LN10)));
      this.dispatchEvent('ladder-step-change', {step: Number(stepMove.toFixed(d)), round: event.shiftKey}, true);
    }
  }
  _onPointerDown(event) {
    this.setPointerCapture(event.pointerId);
    this.addEventListener('pointermove', this._onPointerMove);
    this.addEventListener('pointerup', this._onPointerUp);
    event.preventDefault();
    this._startX = event.clientX;
  }
  _onPointerMove(event) {
    const deltaX = event.clientX - this._startX;
    if (Math.abs(deltaX) > 5) {
      const expMove = Math.pow(deltaX / 5, 3);
      const roundMove = deltaX > 0 ? Math.floor(expMove) : Math.ceil(expMove);
      let stepMove = this.value * roundMove;
      // let d = Math.max(0, Math.min(100, -Math.round(Math.log(this.value) / Math.LN10)));
      // this.dispatchEvent('ladder-step-change', {step: Number(stepMove.toFixed(d)), round: event.shiftKey}, true);
      this.dispatchEvent('ladder-step-change', {step: Number(stepMove), round: event.shiftKey}, true);
      this._startX = event.clientX;
    }
  }
  _onPointerUp(event) {
    this.releasePointerCapture(event.pointerId);
    this.removeEventListener('pointermove', this._onPointerMove);
    this.removeEventListener('pointerup', this._onPointerUp);
  }
}

IoLadderStep.Register();

let lastFocus = null;
window.addEventListener('focusin', _onWindowFocusIn, {capture: false});
function _onWindowFocusIn() {
  lastFocus = document.activeElement;
}

class IoLadder extends IoElement {
  static get Style() {
    return html`<style>
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
        opacity: 0;
      }
      :host > .io-up1,
      :host > .io-down1{
        transition: opacity 0.1s;
      }
      :host > .io-up2,
      :host > .io-down2 {
        transition: opacity 0.2s;
      }
      :host > .io-up3,
      :host > .io-down3 {
        transition: opacity 0.4s;
      }
      :host > .io-up4,
      :host > .io-down4 {
        transition: opacity 0.8s;
      }
      :host > io-ladder-step:focus,
      :host > io-ladder-step:hover {
        background-color: var(--io-background-color-light);
        border-color: var(--io-color-focus);
        transition: opacity 0.2s;
        opacity: 1;
      }
      :host > span.hidden {
        visibility: hidden;
      }
    </style>`;
  }
  static get Properties() {
    return {
      value: Number,
      conversion: 1,
      expanded: {
        type: Boolean,
        reflect: 1,
      },
      min: -Infinity,
      max: Infinity,
      step: 0.0001,
    };
  }
  static get Listeners() {
    return {
      'ladder-step-change': '_onLadderStepChange',
      'ladder-step-collapse': '_onLadderStepCollapse',
      'focusin': '_onFocusIn',
    };
  }
  _onFocusIn(event) {
    event.stopImmediatePropagation();
    if (lastFocus) this._lastFocus = lastFocus;
  }
  _onLadderStepChange(event) {
    event.stopImmediatePropagation();
    const step = event.detail.step;
    const value = event.detail.round ? (Math.round(this.value / step) * step) : this.value;

    let newValue = Math.min(this.max, Math.max(this.min, value + step));

    this.set('value', Number(newValue.toFixed(5)));
  }
  _onLadderStepCollapse() {
    event.stopImmediatePropagation();
    this.set('expanded', false);
  }
  expandedChanged() {
    if (!this.expanded) {
      if (this._lastFocus) this._lastFocus.focus();
      this.srcElement = undefined;
      this._lastFocus = undefined;
    }
  }
  changed() {
    const range = this.max - this.min;
    const hiddenItem = ['span', {class: 'io-item hidden'}];

    // TODO: unhack
    let step = this.step / 10000;
    while (step < .1) step = step * 10;

    const upStep4 = 10000 * step;
    const upStep3 = 1000 * step;
    const upStep2 = 100 * step;
    const upStep1 = 10 * step;
    const downStep1 = 1 * step;
    const downStep2 = .1 * step;
    const downStep3 = .01 * step;
    const downStep4 = .001 * step;

    const upLabel4 = Number((upStep4 * this.conversion).toFixed(0));
    const upLabel3 = Number((upStep3 * this.conversion).toFixed(0));
    const upLabel2 = Number((upStep2 * this.conversion).toFixed(0));
    const upLabel1 = Number((upStep1 * this.conversion).toFixed(0));
    const downLabel1 = Number((downStep1 * this.conversion).toFixed(1));
    const downLabel2 = Number((downStep2 * this.conversion).toFixed(2));
    const downLabel3 = Number((downStep3 * this.conversion).toFixed(3));
    const downLabel4 = Number((downStep4 * this.conversion).toFixed(4));

    this.template([
      (range >= upStep4) ? ['io-ladder-step', {class: 'io-up4', value: upStep4, label: upLabel4}] : hiddenItem,
      (range >= upStep3) ? ['io-ladder-step', {class: 'io-up3', value: upStep3, label: upLabel3}] : hiddenItem,
      (range >= upStep2) ? ['io-ladder-step', {class: 'io-up2', value: upStep2, label: upLabel2}] : hiddenItem,
      (range >= upStep1) ? ['io-ladder-step', {class: 'io-up1', value: upStep1, label: upLabel1}] : hiddenItem,
      hiddenItem,
      (this.step <= downStep1) ? ['io-ladder-step', {class: 'io-down1', value: downStep1, label: downLabel1}] : hiddenItem,
      (this.step <= downStep2) ? ['io-ladder-step', {class: 'io-down2', value: downStep2, label: downLabel2}] : hiddenItem,
      (this.step <= downStep3) ? ['io-ladder-step', {class: 'io-down3', value: downStep3, label: downLabel3}] : hiddenItem,
      (this.step <= downStep4) ? ['io-ladder-step', {class: 'io-down4', value: downStep4, label: downLabel4}] : hiddenItem,
    ]);
  }
}

IoLadder.Register();

export const IoLadderSingleton = new IoLadder();
IoLadderSingleton.style.position = 'absolute';
IoLadderSingleton.style.marginTop = 'calc(-5 * var(--io-item-height))';
IoLayerSingleton.appendChild(IoLadderSingleton);
IoLadderSingleton.addEventListener('expanded-changed', IoLayerSingleton.onChildExpanded);
