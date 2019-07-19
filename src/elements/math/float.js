import {html, IoElement} from "../../io.js";
import {IoNumber} from "../../io-elements-core.js";
import {IoMathLayer} from "./math-layer.js";

export class IoFloat extends IoNumber {
  static get Listeners() {
    return {
      'touchstart': '_onTouchstart',
      'touchend': '_onTouchend',
    };
  }
  _onTouchstart(event) {
    this._x = event.changedTouches[0].clientX;
    this._y = event.changedTouches[0].clientY;
  }
  _onTouchend(event) {
    if (event.cancelable) event.preventDefault();
    const dx = event.changedTouches[0].clientX - this._x;
    const dy = event.changedTouches[0].clientY - this._y;
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
      if (IoLadder.singleton.expanded) {
        this.focus();
      }
      document.activeElement.blur();
      IoMathLayer.singleton.clickblock = true;
      IoLadder.singleton.opaque = true;
      this._expandLadder();
    }
  }
  _onClick(event) {
    super._onClick(event);
    this._expandLadder();
  }
  _onFocus(event) {
    super._onFocus(event);
    IoMathLayer.singleton.clickblock = false;
  }
  _onBlur(event) {
    super._onBlur(event);
    IoMathLayer.singleton.expanded = false;
  }
  _onValueSet(event) {
    this.set('value', event.detail.value);
  }
  _expandLadder() {
    IoLadder.singleton.expanded = true;
    IoLadder.singleton.min = this.min;
    IoLadder.singleton.max = this.max;
    IoLadder.singleton.step = this.step;
    IoLadder.singleton.value = this.value;
    // TODO: unhack
    if (IoLadder.singleton._target) {
      IoLadder.singleton.removeEventListener('value-set', IoLadder.singleton._target._onValueSet);
    }
    IoLadder.singleton._target = this;
    IoLadder.singleton.addEventListener('value-set', this._onValueSet);

    // TODO: disable nudge?
    IoMathLayer.singleton.setElementPosition(IoLadder.singleton, 'bottom', this.getBoundingClientRect());
    IoMathLayer.singleton.srcElement = this;
  }
}

IoFloat.Register();

export class IoLadder extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        position: relative;
        pointer-event: none;
      }
      :host > span {
        pointer-event: all;
        position: absolute;
        display: inline-block;
        cursor: ew-resize;
        border: var(--io-inset-border);
        text-align: center;
        background-color: var(--io-background-color);
        color: var(--io-color);
        padding: var(--io-spacing);
        box-shadow: var(--io-shadow);
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        width: 3em;
        height: 1.375em;
        transform: translateZ(0);
      }
      :host > :nth-child(1) {
        border-top-left-radius: var(--io-border-radius);
        border-top-right-radius: var(--io-border-radius);
      }
      :host > :nth-child(8) {
        border-bottom-left-radius: var(--io-border-radius);
        border-bottom-right-radius: var(--io-border-radius);
      }
      :host > .io-up1,
      :host > .io-down1{
        transition: transform 0.10s;
        opacity: 0.3;
      }
      :host > .io-up2,
      :host > .io-down2 {
        transition: transform 0.15s;
        opacity: 0.20;
      }
      :host > .io-up3,
      :host > .io-down3 {
        transition: transform 0.20s;
        opacity: 0.12;
      }
      :host > .io-up4,
      :host > .io-down4 {
        transition: transform 0.25s;
        opacity: 0.05;
      }
      :host > .io-up4 { transform: translateY(-4em); }
      :host > .io-up3 { transform: translateY(-4em); }
      :host > .io-up2 { transform: translateY(-4em); }
      :host > .io-up1 { transform: translateY(-4em); }
      :host > .io-down1 { transform: translateY(0em); }
      :host > .io-down2 { transform: translateY(0em); }
      :host > .io-down3 { transform: translateY(0em); }
      :host > .io-down4 { transform: translateY(0em); }
      :host[expanded] > .io-up4 { transform: translateY(-10em); }
      :host[expanded] > .io-up3 { transform: translateY(-8em); }
      :host[expanded] > .io-up2 { transform: translateY(-6em); }
      :host[expanded] > .io-up1 { transform: translateY(-4em); }
      :host[expanded] > .io-down1 { transform: translateY(0em); }
      :host[expanded] > .io-down2 { transform: translateY(2em); }
      :host[expanded] > .io-down3 { transform: translateY(4em); }
      :host[expanded] > .io-down4 { transform: translateY(6em); }
      :host > span:hover {
        background-color: var(--io-background-color);
        opacity: 1;
      }
      :host:not([expanded]) > span {
        transition: transform 0s;
      }
      :host[_step="1000"] > .io-up4,
      :host[_step="100"] > .io-up3,
      :host[_step="10"] > .io-up2,
      :host[_step="1"] > .io-up1,
      :host[_step="0.1"] > .io-down1,
      :host[_step="0.01"] > .io-down2,
      :host[_step="0.001"] > .io-down3,
      :host[_step="0.0001"] > .io-down4 {
        background-color: var(--io-background-color-light);
        opacity: 1;
      }
      :host[opaque] > span {
        opacity: 1;
      }
      :host > span.hidden {
        display: none;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      _step: Number,
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
      step: 0.0001,
    };
  }
  static get Listeners() {
    return {
      'mousedown': '_onMousedown',
      'touchstart': '_onTouchstart',
    };
  }
  _onMousedown(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    window.addEventListener('mousemove', this._onMousemove);
    window.addEventListener('mouseup', this._onMouseup);
    const item = event.composedPath()[0];
    this._step = Number(item.textContent);
    this._clickblockRestore = IoMathLayer.singleton.clickblock;
    IoMathLayer.singleton.clickblock = true;
    IoMathLayer.singleton.style.cursor = 'ew-resize';
    this._value = this.value;
    this._x = event.clientX;
  }
  _onMousemove(event) {
    const newValue = this._value + Math.round((event.clientX - this._x) / 10) * this._step;
    this.set('value', Math.max(this.min, Math.min(this.max, newValue)));
  }
  _onMouseup() {
    window.removeEventListener('mousemove', this._onMousemove);
    window.removeEventListener('mouseup', this._onMouseup);
    IoMathLayer.singleton.clickblock = this._clickblockRestore;
    IoMathLayer.singleton.style.cursor = '';
    this._step = 0;
  }
  _onTouchstart(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.addEventListener('touchmove', this._onTouchmove);
    this.addEventListener('touchend', this._onTouchend);
    const item = event.composedPath()[0];
    this._step = Number(item.textContent);
    this._value = this.value;
    this._x = event.changedTouches[0].clientX;
  }
  _onTouchmove(event) {
    event.preventDefault();
    const newValue = this._value + Math.round((event.changedTouches[0].clientX - this._x) / 5) * this._step;
    this.set('value', Math.max(this.min, Math.min(this.max, newValue)));
  }
  _onTouchend(event) {
    event.preventDefault();
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
    this._step = 0;
  }
  expandedChanged() {
    if (!this.expanded) {
      this.srcElement = undefined;
      this.opaque = false;
    }
  }
  changed() {
    this.querySelector('.io-up4').classList.toggle('hidden', (this.max - this.min) < 1000);
    this.querySelector('.io-up3').classList.toggle('hidden', (this.max - this.min) < 100);
    this.querySelector('.io-up2').classList.toggle('hidden', (this.max - this.min) < 10);
    this.querySelector('.io-up1').classList.toggle('hidden', (this.max - this.min) < 1);
    this.querySelector('.io-down1').classList.toggle('hidden', this.step > 0.1);
    this.querySelector('.io-down2').classList.toggle('hidden', this.step > 0.01);
    this.querySelector('.io-down3').classList.toggle('hidden', this.step > 0.001);
    this.querySelector('.io-down4').classList.toggle('hidden', this.step > 0.0001);
  }
  constructor(props) {
    super(props);
    this.template([
      ['span', {class: 'io-up4'}, '1000'],
      ['span', {class: 'io-up3'}, '100'],
      ['span', {class: 'io-up2'}, '10'],
      ['span', {class: 'io-up1'}, '1'],
      ['span', {class: 'io-down1'}, '.1'],
      ['span', {class: 'io-down2'}, '.01'],
      ['span', {class: 'io-down3'}, '.001'],
      ['span', {class: 'io-down4'}, '.0001'],
    ]);
  }
}

IoLadder.Register();

IoLadder.singleton = new IoLadder();
IoMathLayer.singleton.appendChild(IoLadder.singleton);
IoLadder.singleton.addEventListener('expanded-changed', IoMathLayer.singleton.onChildExpanded);
