import { IoElement, RegisterIoElement } from '../../core/element.js';
import { IoProperty } from '../../core/internals/property.js';
import { IoField } from './field.js';
import { IoLayerSingleton } from '../../core/layer.js';
import { IoThemeSingleton } from '../../core/theme.js';

@RegisterIoElement
export class IoNumber extends IoField {
  static get Style() {
    return /* css */`
      :host {
        cursor: text;
        user-select: text;
        -webkit-user-select: text;
        -webkit-touch-callout: default;
        min-width: var(--io-field-height);
        border-color: var(--io-color-border-inset);
        color: var(--io-color-field);
        background-color: var(--io-background-color-field);
        box-shadow: var(--io-shadow-inset);
        flex-basis: 4.3em;
      }
      :host:before,
      :host:after {
        content: ' ';
        white-space: pre;
        visibility: hidden;
      }
      :host:before {
        content: '-';
      }
      :host:not([positive]):before {
        content: ' ';
      }
      :host[aria-invalid] {
        border: var(--io-border-error);
        background-image: var(--io-gradient-error);
      }
    `;
  }

  @IoProperty('textbox')
  declare role: string;

  @IoProperty(0)
  declare value: number;

  @IoProperty(1)
  declare conversion: number;

  @IoProperty(0.0001)
  declare step: number;

  @IoProperty(-Infinity)
  declare min: number;

  @IoProperty(Infinity)
  declare max: number;

  @IoProperty(false)
  declare ladder: boolean;

  @IoProperty(true)
  declare contenteditable: boolean;

  @IoProperty({value: 'number', reflect: 'prop'})
  declare type: string;

  @IoProperty({value: 'pattern="[0-9]*"', reflect: 'prop'})
  declare pattern: string;

  @IoProperty({value: 'numeric', reflect: 'prop'})
  declare inputmode: string;

  @IoProperty({value: 'false', reflect: 'prop'})
  declare spellcheck: string;

  constructor(properties: Record<string, any> = {}) {
    super(properties);
    Object.defineProperty(this, '_pointer', {enumerable: false, writable: true, value: 'touch'});
  }
  _onPointerdown(event: PointerEvent) {
    if (this._pointer === 'touch') event.preventDefault();
    this.addEventListener('pointermove', this._onPointermove);
    this.addEventListener('pointerup', this._onPointerup);
    if (document.activeElement === this as unknown as Element && event.button === 0) return;
    this._pointer = event.pointerType;
  }
  _onPointerup(event: PointerEvent) {
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerup', this._onPointerup);
    if (this.ladder || event.button === 1) {
      if (this._pointer === 'touch') {
        event.preventDefault();
        (document.activeElement as HTMLElement).blur();
      } else {
        if (document.activeElement !== this as unknown as Element) {
          this.focus();
          this.setCaretPosition(this.textNode.length);
        }
      }
      this._expandLadder();
    } else {
      if (document.activeElement !== this as unknown as Element) {
        this.focus();
        this.setCaretPosition(this.textNode.length);
      }
    }
  }
  _onFocus(event: FocusEvent) {
    super._onFocus(event);
    if (this._pointer === 'touch') {
      IoNumberLadderSingleton.expanded = false;
    }
  }
  _onBlur(event: FocusEvent) {
    super._onBlur(event);
    this._setFromTextNode();
    this.scrollTop = 0;
    this.scrollLeft = 0;
    // TODO: unhack race condition
    setTimeout(() => {
      if ((document.activeElement as Element).parentElement !== IoNumberLadderSingleton as unknown as Element) {
        IoNumberLadderSingleton.expanded = false;
      }
    });
  }
  _expandLadder() {
    IoNumberLadderSingleton.src = this;
    IoNumberLadderSingleton.expanded = true;
  }
  _onKeydown(event: KeyboardEvent) {
    const rng = (window.getSelection() as Selection).getRangeAt(0);
    const start = rng.startOffset;
    const end = rng.endOffset;
    const length = this.childNodes[0] ? this.childNodes[0].length : 0;
    const rngInside = rng.startContainer === rng.endContainer && (rng.startContainer === this.childNodes[0] || rng.startContainer === this as unknown as Node);

    if (event.which === 27 || event.which === 13 || event.which === 32) { //  esc || enter || space
      event.preventDefault();
      this._setFromTextNode();
    } else if (event.which === 36) { // home
      this.textNode = this.min;
      this._setFromTextNode();
    } else if (event.which === 35) { // end
      this.textNode = this.max;
      this._setFromTextNode();
    } else if (event.which === 33) { // pgup
      const valueNumber = Number(this.textNode);
      if (!isNaN(valueNumber) && Math.abs(valueNumber) < Infinity) {
        this.textNode = Number(this.textNode) + this.step;
      } else {
        this.textNode = this.step;
      }
      this._setFromTextNode();
    } else if (event.which === 34) { // pgdown
      const valueNumber = Number(this.textNode);
      if (!isNaN(valueNumber) && Math.abs(valueNumber) < Infinity) {
        this.textNode = Number(this.textNode) - this.step;
      } else {
        this.textNode = -this.step;
      }
      this._setFromTextNode();
    } else if (event.which === 37) { // left
      if (event.ctrlKey || (rngInside && start === end && start === 0)) {
        event.preventDefault();
        this.focusTo('left');
      }
    } else if (event.which === 38) { // up
      if (IoNumberLadderSingleton.expanded) {
        const upStep = IoNumberLadderSingleton.querySelector('.io-up1');
        if (upStep) upStep.focus();
      } else if (event.ctrlKey || (rngInside && start === end && start === 0)) {
        event.preventDefault();
        this.focusTo('up');
      }
    } else if (event.which === 39) { // right
      if (event.ctrlKey || (rngInside && start === end && start === length)) {
        event.preventDefault();
        this.focusTo('right');
      }
    } else if (event.which === 40) { // down
      if (IoNumberLadderSingleton.expanded) {
        const downStep = IoNumberLadderSingleton.querySelector('.io-down1');
        if (downStep) downStep.focus();
      } else if (event.ctrlKey || (rngInside && start === end && start === length)) {
        event.preventDefault();
        this.focusTo('down');
      }
    }
  }
  _onKeyup(event: KeyboardEvent) {
    if (event.which === 17) { // ctrl
      this._expandLadder();
    } else if (event.which === 27 || event.which === 13 || event.which === 32) { // esc || enter || space
      IoLayerSingleton.expanded = false;
    }
  }
  _setFromTextNode() {
    const valueText = this.textNode;
    let valueNumber = Number(valueText) / this.conversion;
    valueNumber = Math.min(this.max, Math.max(this.min, valueNumber));
    valueNumber = Math.round(valueNumber / this.step) * this.step;
    const d = Math.max(0, Math.min(100, -Math.floor(Math.log(this.step) / Math.LN10)));
    valueNumber = Number(valueNumber.toFixed(d));
    if (!isNaN(valueNumber)) this.inputValue(valueNumber);
    else this.textNode = 'NaN';
  }
  init() {
    this.changed();
  }
  changed() {
    this.setAttribute('value', this.value);
    this.setAttribute('aria-valuenow', this.value);
    this.setAttribute('aria-valuemin', this.min);
    this.setAttribute('aria-valuemax', this.max);
    this.setAttribute('aria-valuestep', this.step);
    if (typeof this.value !== 'number' || isNaN(this.value)) {
      this.setAttribute('aria-invalid', 'true');
    } else {
      this.removeAttribute('aria-invalid');
    }
    let value = this.value;
    let valueText;
    if (typeof value === 'number' && !isNaN(value)) {
      value *= this.conversion;
      let d = -Math.floor(Math.log(this.step * this.conversion) / Math.LN10);
      d = Math.max(0, Math.min(100, d));
      value = Number(value.toFixed(d));
      valueText = String(value);
    } else {
      valueText = 'NaN';
    }
    this.setAttribute('value', valueText);
    this.setAttribute('positive', this.value >= 0);
    this.textNode = valueText;
  }
}

let lastFocus: Element | null = null;
{
  window.addEventListener('focusin', () => {
    lastFocus = document.activeElement;
  }, {capture: false});
  window.addEventListener('blur', () => {
    setTimeout(() => {
      if (document.activeElement === document.body) {
        lastFocus = null;
      }
    });
  }, {capture: true});
}

@RegisterIoElement
export class IoNumberLadderStep extends IoField {
  static get Style() {
    return /* css */`
      :host {
        pointer-events: all;
        display: inline-block;
        cursor: ew-resize;
        text-align: center;
        background-color: var(--io-background-color-light);
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

  @IoProperty(1)
  declare value: number;

  @IoProperty({value: 'number', reflect: 'prop'})
  declare type: string;

  @IoProperty('spinbutton')
  declare role: string;

  _onKeydown(event: KeyboardEvent) {
    let stepMove = 0;
    if (event.key === 'Escape' || event.key === ' ') {
      this.dispatchEvent('ladder-step-collapse', {}, true);
    } else if (event.key === 'ArrowLeft' || event.key === 'Backspace') {
      event.preventDefault();
      stepMove = this.value * -1;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusTo('up');
    } else if (event.key === 'ArrowRight' || event.key === 'Enter') {
      event.preventDefault();
      stepMove = this.value * 1;
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusTo('down');
    }
    if (stepMove !== 0) {
      this.dispatchEvent('ladder-step-change', {step: Number(stepMove.toFixed(5)), round: event.shiftKey}, true);
    }
  }
  _onPointerdown(event: PointerEvent) {
    this.setPointerCapture(event.pointerId);
    this.addEventListener('pointermove', this._onPointermove);
    this.addEventListener('pointerup', this._onPointerup);
    this._startX = event.clientX;
  }
  _onPointermove(event: PointerEvent) {
    const deltaX = event.clientX - this._startX;
    if (Math.abs(deltaX) > 5) {
      const expMove = Math.pow(deltaX / 5, 2) * deltaX < 0 ? -1: 1;
      const roundMove = deltaX > 0 ? Math.floor(expMove) : Math.ceil(expMove);
      const stepMove = this.value * roundMove;
      this._startX = event.clientX;
      this.dispatchEvent('ladder-step-change', {step: Number(stepMove.toFixed(5)), round: event.shiftKey}, true);
    }
  }
  _onPointerup(event: PointerEvent) {
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
}

@RegisterIoElement
export class IoNumberLadder extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        position: absolute;
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
      :host:not([expanded]) > io-number-ladder-step {
        opacity: 0.5;
      }
      :host > io-number-ladder-step:nth-child(-n+5) {
        box-shadow: 0 -1px 4px rgba(0,0,0,0.2);
      }
      :host > io-number-ladder-step:nth-child(n+6) {
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
        transform: translateY(calc(3 * var(--io-field-height)));
      }
      :host:not([expanded]) > .io-up3 {
        transform: translateY(calc(2 * var(--io-field-height)));
      }
      :host:not([expanded]) > .io-up2 {
        transform: translateY(calc(1 * var(--io-field-height)));
      }
      :host:not([expanded]) > .io-down2 {
        transform: translateY(calc(-1 * var(--io-field-height)));
      }
      :host:not([expanded]) > .io-down3 {
        transform: translateY(calc(-2 * var(--io-field-height)));
      }
      :host:not([expanded]) > .io-down4 {
        transform: translateY(calc(-3 * var(--io-field-height)));
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
      :host > io-number-ladder-step:hover,
      :host > io-number-ladder-step:focus {
        background-color: var(--io-background-color-light);
        border-color: var(--io-color-focus);
        transition: opacity 0.2s;
        opacity: 1;
      }
      :host > .io-number-ladder-empty {
        height: var(--io-field-height);
      }
      :host > .io-number-ladder-center {
        height: calc(1.5 * var(--io-field-height));
      }
    `;
  }

  @IoProperty('list')
  declare role: string;

  @IoProperty(undefined)
  declare src: any;

  @IoProperty({value: false, reflect: 'prop'})
  declare expanded: boolean;

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
  get min() {
    return this.src ? this.src.min : -Infinity;
  }
  get max() {
    return this.src ? this.src.max : Infinity;
  }
  get step() {
    return this.src ? this.src.step : 0.0001;
  }
  get conversion() {
    return this.src ? this.src.conversion : 1;
  }
  _onFocusIn(event: FocusEvent) {
    event.stopPropagation();
  }
  _onFocusTo(event: CustomEvent) {
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
  _onLadderStepChange(event: CustomEvent) {
    const src = this.src;
    if (this.src) {
      const step = event.detail.step;
      const value = event.detail.round ? (Math.round(this.value / step) * step) : this.value;
      let newValue = Math.min(this.max, Math.max(this.min, value + step));
      newValue = Number(newValue.toFixed(5));
      src.inputValue(newValue);
    }
  }
  _onLadderStepCollapse() {
    this.setProperty('expanded', false);
  }
  srcChanged() {
    const src = this.src;
    if (src) this.setProperties({
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
        const selfRect = this.getBoundingClientRect();
        // NOTE: layerRect fix for Safari zoom.
        const layerRect = IoLayerSingleton.getBoundingClientRect();
        this.style.top = rect.bottom - layerRect.top + 'px';
        this.style.left = rect.left - layerRect.left + 'px';
        this.style.marginTop = - (selfRect.height / 2 + IoThemeSingleton.ioLineHeight / 2 + IoThemeSingleton.ioSpacing) + 'px';
      } else {
        this.removeAttribute('style');
      }
    } else {
      if (src && src._pointerType !== 'touch') {
        src.focus();
      } else if (lastFocus) {
        (lastFocus as HTMLElement).focus();
      }
    }
    this.dispatchEvent('expanded', {value: this.expanded}, true);
  }
  changed() {
    const range = this.max - this.min;
    const hiddenItem = ['span', {class: 'io-number-ladder-empty'}];

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

    const upLabel4 = Number((upStep4 * this.conversion).toFixed(6));
    const upLabel3 = Number((upStep3 * this.conversion).toFixed(6));
    const upLabel2 = Number((upStep2 * this.conversion).toFixed(6));
    const upLabel1 = Number((upStep1 * this.conversion).toFixed(6));
    const downLabel1 = Number((downStep1 * this.conversion).toFixed(6));
    const downLabel2 = Number((downStep2 * this.conversion).toFixed(6));
    const downLabel3 = Number((downStep3 * this.conversion).toFixed(6));
    const downLabel4 = Number((downStep4 * this.conversion).toFixed(6));

    this.template([
      (range >= upStep4) ? ['io-number-ladder-step', {class: 'io-up4', value: upStep4, label: String(upLabel4)}] : hiddenItem,
      (range >= upStep3) ? ['io-number-ladder-step', {class: 'io-up3', value: upStep3, label: String(upLabel3)}] : hiddenItem,
      (range >= upStep2) ? ['io-number-ladder-step', {class: 'io-up2', value: upStep2, label: String(upLabel2)}] : hiddenItem,
      (range >= upStep1) ? ['io-number-ladder-step', {class: 'io-up1', value: upStep1, label: String(upLabel1)}] : hiddenItem,
      ['span', {class: 'io-number-ladder-center'}],
      (this.step <= downStep1) ? ['io-number-ladder-step', {class: 'io-down1', value: downStep1, label: String(downLabel1)}] : hiddenItem,
      (this.step <= downStep2) ? ['io-number-ladder-step', {class: 'io-down2', value: downStep2, label: String(downLabel2)}] : hiddenItem,
      (this.step <= downStep3) ? ['io-number-ladder-step', {class: 'io-down3', value: downStep3, label: String(downLabel3)}] : hiddenItem,
      (this.step <= downStep4) ? ['io-number-ladder-step', {class: 'io-down4', value: downStep4, label: String(downLabel4)}] : hiddenItem,
    ]);

    this.setAttribute('aria-valuemin', this.min);
    this.setAttribute('aria-valuemax', this.max);
    this.setAttribute('aria-valuenow', this.value);
    this.setAttribute('aria-valuestep', this.step);
    this.setAttribute('aria-invalid', (typeof this.value !== 'number' || isNaN(this.value))  ? 'true' : false);

    const steps = this.querySelectorAll('io-number-ladder-step');
    for (let i = steps.length; i--;) {
      steps[i].setAttribute('aria-valuemin', this.min);
      steps[i].setAttribute('aria-valuemax', this.max);
      steps[i].setAttribute('aria-valuenow', this.value);
      steps[i].changed();
    }
  }
}

export const IoNumberLadderSingleton = new IoNumberLadder();
IoLayerSingleton.appendChild(IoNumberLadderSingleton as unknown as HTMLElement);
