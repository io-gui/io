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
      this.dispatchEvent('ladder-step-change', {value: Number(stepMove.toFixed(d))}, true);
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
      let d = Math.max(0, Math.min(100, -Math.round(Math.log(this.value) / Math.LN10)));
      this.dispatchEvent('ladder-step-change', {value: Number(stepMove.toFixed(d))}, true);
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
        opacity: 0.92;
        transition: opacity 0.1s;
      }
      :host > .io-up2,
      :host > .io-down2 {
        opacity: 0.48;
        transition: opacity 0.2s;
      }
      :host > .io-up3,
      :host > .io-down3 {
        opacity: 0.24;
        transition: opacity 0.4s;
      }
      :host > .io-up4,
      :host > .io-down4 {
        opacity: 0.05;
        transition: opacity 0.8s;
      }
      :host > io-ladder-step:focus,
      :host > io-ladder-step:hover {
        background-color: var(--io-background-color-light);
        border-color: var(--io-color-focus);
        transition: opacity 0.2s;
        opacity: 1;
      }
      :host[opaque] > io-ladder-step {
        opacity: 1;
      }
      :host > span.hidden {
        visibility: hidden;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      opaque: Boolean,
    };
  }
  static get Properties() {
    return {
      value: Number,
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
    // console.log(event);
    // TODO: rtestore focus;
  }
  _onLadderStepChange(event) {
    event.stopImmediatePropagation();
    const newValue = this.value + event.detail.value;
    this.set('value', Math.max(this.min, Math.min(this.max, newValue)));
  }
  _onLadderStepCollapse() {
    event.stopImmediatePropagation();
    this.expanded = false;
  }
  expandedChanged() {
    if (!this.expanded) {
      this.srcElement = undefined;
      this.opaque = false;
      // TODO: rtestore focus;
    }
  }
  changed() {
    const range = this.max - this.min;
    this.template([
      (range > 1000) ? ['io-ladder-step', {class: 'io-up4', value: 1000}] : null,
      (range > 100) ? ['io-ladder-step', {class: 'io-up3', value: 100}] : null,
      (range > 10) ? ['io-ladder-step', {class: 'io-up2', value: 10}] : null,
      (range > 1) ? ['io-ladder-step', {class: 'io-up1', value: 1}] : null,
      ['span', {class: 'io-item hidden'}],
      (this.step < 0.1) ? ['io-ladder-step', {class: 'io-down1', value: .1}] : null,
      (this.step < 0.01) ? ['io-ladder-step', {class: 'io-down2', value: .01}] : null,
      (this.step < 0.001) ? ['io-ladder-step', {class: 'io-down3', value: .001}] : null,
      (this.step < 0.0001) ? ['io-ladder-step', {class: 'io-down4', value: .0001}] : null,
    ]);
  }
}

IoLadder.Register();

export const IoLadderSingleton = new IoLadder();
IoLayerSingleton.appendChild(IoLadderSingleton);
IoLadderSingleton.addEventListener('expanded-changed', IoLayerSingleton.onChildExpanded);
