import { Register, Property, IoElement, IoElementProps, IoOverlaySingleton, ThemeSingleton, span, VDOMElement, WithBinding, Default } from 'io-gui';
import { IoNumber } from './IoNumber';
import { ioNumberLadderStep } from './IoNumberLadderStep';

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

export type IoNumberLadderProps = IoElementProps & {
  src?: IoNumber,
  expanded?: WithBinding<boolean>,
};

/**
 * Interactive number ladder.
 * When dragged horizontally, it changes the value in step increments.
 * Dragging speed affects the rate of change exponentially.
 * Up/down arrow keys change the step focus while left/right change the value in step increments.
 * Escape key collapses the ladder and restores the focus to previously focused element.
 * If shift key is pressed, value is rounded to the nearest step incement.
 **/
@Register
class IoNumberLadder extends IoElement {
  static vConstructor: (arg0?: IoNumberLadderProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        position: absolute;
        pointer-events: none;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        box-shadow: unset;
      }
      :host:not([expanded]) {
        visibility: hidden;
      }
      :host > io-number-ladder-step {
        box-shadow: var(--io_shadow);
      }
      :host > .io-up1,
      :host > .io-up2,
      :host > .io-up3,
      :host > .io-up4 {
        box-shadow: 0px -2px 6px var(--io_shadowColor), 0 -1px 3px var(--io_shadowColor);
      }
      :host > .io-down1,
      :host > .io-down2,
      :host > .io-down3,
      :host > .io-down4 {
        box-shadow: 0px 2px 6px var(--io_shadowColor), 0 1px 3px var(--io_shadowColor);
      }
      :host > .io-up1,
      :host > .io-down1{
        z-index: 4;
        transition: transform 0.1s;
      }
      :host > .io-up2,
      :host > .io-down2 {
        z-index: 3;
        transition: transform 0.2s;
      }
      :host:not([expanded]) > .io-up4 {
        transform: translateY(calc(3 * var(--io_fieldHeight)));
      }
      :host:not([expanded]) > .io-up3 {
        transform: translateY(calc(2 * var(--io_fieldHeight)));
      }
      :host:not([expanded]) > .io-up2 {
        transform: translateY(calc(1 * var(--io_fieldHeight)));
      }
      :host:not([expanded]) > .io-down2 {
        transform: translateY(calc(-1 * var(--io_fieldHeight)));
      }
      :host:not([expanded]) > .io-down3 {
        transform: translateY(calc(-2 * var(--io_fieldHeight)));
      }
      :host:not([expanded]) > .io-down4 {
        transform: translateY(calc(-3 * var(--io_fieldHeight)));
      }
      :host > .io-up3,
      :host > .io-down3 {
        z-index: 2;
        transition: transform 0.4s;
      }
      :host > .io-up4,
      :host > .io-down4 {
        z-index: 1;
        transition: transform 0.8s;
      }
      :host > io-number-ladder-step:hover,
      :host > io-number-ladder-step:focus {
        background-color: var(--io_bgColorStrong);
        border-color: var(--io_colorBlue);
      }
      :host > .io-number-ladder-empty {
        height: var(--io_fieldHeight);
      }
      :host > .io-number-ladder-center {
        height: calc(1.5 * var(--io_fieldHeight));
      }
    `;
  }
  // TODO: rename
  @Property({value: undefined, type: IoElement})
  declare src?: IoNumber;

  @Property({value: false, type: Boolean, reflect: true})
  declare expanded: boolean;

  @Default('listbox')
  declare role: string;

  static get Listeners() {
    return {
      'ladder-step-change': '_onLadderStepChange',
      'ladder-step-collapse': '_onLadderStepCollapse',
      'focusin': 'onFocusIn',
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

  constructor(args: IoNumberLadderProps = {}) { super(args); }

  onFocusIn(event: FocusEvent) {
    event.stopPropagation();
  }
  onFocusTo(event: CustomEvent) {
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
    super.onFocusTo(event);
  }
  _onLadderStepChange(event: CustomEvent) {
    const src = this.src;
    if (src) {
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
  expandedChanged() {
    const src = this.src;
    if (this.expanded) {
      if (src) {
        const rect = src.getBoundingClientRect();
        const selfRect = this.getBoundingClientRect();
        // NOTE: layerRect fix for Safari zoom.
        const layerRect = IoOverlaySingleton.getBoundingClientRect();
        this.style.top = rect.bottom - layerRect.top + 'px';
        this.style.left = rect.left - layerRect.left + 'px';
        this.style.marginTop = - (selfRect.height / 2 + ThemeSingleton.lineHeight / 2 + ThemeSingleton.spacing) + 'px';
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
    const hiddenItem = span({class: 'io-number-ladder-empty'});

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
      (range >= upStep4) ? ioNumberLadderStep({class: 'io-up4', value: upStep4, label: String(upLabel4)}) : hiddenItem,
      (range >= upStep3) ? ioNumberLadderStep({class: 'io-up3', value: upStep3, label: String(upLabel3)}) : hiddenItem,
      (range >= upStep2) ? ioNumberLadderStep({class: 'io-up2', value: upStep2, label: String(upLabel2)}) : hiddenItem,
      (range >= upStep1) ? ioNumberLadderStep({class: 'io-up1', value: upStep1, label: String(upLabel1)}) : hiddenItem,
      span({class: 'io-number-ladder-center'}),
      (this.step <= downStep1) ? ioNumberLadderStep({class: 'io-down1', value: downStep1, label: String(downLabel1)}) : hiddenItem,
      (this.step <= downStep2) ? ioNumberLadderStep({class: 'io-down2', value: downStep2, label: String(downLabel2)}) : hiddenItem,
      (this.step <= downStep3) ? ioNumberLadderStep({class: 'io-down3', value: downStep3, label: String(downLabel3)}) : hiddenItem,
      (this.step <= downStep4) ? ioNumberLadderStep({class: 'io-down4', value: downStep4, label: String(downLabel4)}) : hiddenItem,
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
IoOverlaySingleton.appendChild(IoNumberLadderSingleton as unknown as HTMLElement);
