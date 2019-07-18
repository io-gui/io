import {html, IoElement} from "../../io.js";
import {IoNumber} from "../../io-elements-core.js";
import {IoMathLayer} from "./math-layer.js";

export class IoFloat extends IoNumber {
  _onClick(event) {
    super._onClick(event);
    this._expandLadder();
  }
  _onValueSet(event) {
    this.set('value', event.detail.value);
  }
  _onBlur(event) {
    super._onBlur(event);
    IoLadder.singleton.removeEventListener('value-set', this._onValueSet);
    IoMathLayer.singleton.clickable = true;
    IoMathLayer.singleton.expanded = false;
  }
  _expandLadder() {
    IoLadder.singleton.expanded = true;
    IoLadder.singleton.min = this.min;
    IoLadder.singleton.max = this.max;
    IoLadder.singleton.step = this.step;
    IoLadder.singleton.value = this.value;
    IoLadder.singleton.addEventListener('value-set', this._onValueSet);
    IoMathLayer.singleton.clickable = false;
    IoMathLayer.singleton.setElementPosition(IoLadder.singleton, 'bottom', this.getBoundingClientRect()); // TODO: disable nudge?
  }
}

IoFloat.Register();

export class IoLadder extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        position: relative;
      }
      :host > span {
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
      }
      :host > :nth-child(1) {
        border-top-left-radius: var(--io-border-radius);
        border-top-right-radius: var(--io-border-radius);
      }
      :host > :nth-child(8) {
        border-bottom-left-radius: var(--io-border-radius);
        border-bottom-right-radius: var(--io-border-radius);
      }
      :host > .io-up1, :host > .io-down1{
        opacity: 0.3;
      }
      :host > .io-up2, :host > .io-down2 {
        opacity: 0.20;
      }
      :host > .io-up3, :host > .io-down3 {
        opacity: 0.12;
      }
      :host > .io-up4, :host > .io-down4 {
        opacity: 0.05;
      }
      :host > .io-up1 { top: -4em; }
      :host > .io-up2 { top: -6em; }
      :host > .io-up3 { top: -8em; }
      :host > .io-up4 { top: -10em; }
      :host > .io-down1 { top: 0em; }
      :host > .io-down2 { top: 2em; }
      :host > .io-down3 { top: 4em; }
      :host > .io-down4 { top: 6em; }
      :host > span:hover {
        background-color: var(--io-background-color);
        opacity: 1;
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
      :host > span.hidden {
        display: none;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      '_step': Number
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
    this._onPointerDown(event);
    window.addEventListener('mousemove', this._onMousemove);
    window.addEventListener('mouseup', this._onMouseup);
    IoMathLayer.singleton.style.cursor = 'ew-resize';
    IoMathLayer.singleton.clickable = true;
    this._valStart = this.value;
    this._xStart = event.clientX;
  }
  _onMousemove(event) {
    const newValue = this._valStart + Math.round((event.clientX - this._xStart) / 5) * this._step;
    this.set('value', Math.max(this.min, Math.min(this.max, newValue)));
  }
  _onMouseup(event) {
    window.removeEventListener('mousemove', this._onMousemove);
    window.removeEventListener('mouseup', this._onMouseup);
    IoMathLayer.singleton.style.cursor = '';
    IoMathLayer.singleton.clickable = false;
    this._step = 0;
    this.expanded = false;
  }
  _onTouchstart(event) {
    this._onPointerDown(event);
    this.addEventListener('touchmove', this._onTouchmove);
    this.addEventListener('touchend', this._onTouchend);
    this._valStart = this.value;
    this._xStart = event.changedTouches[0].clientX;
  }
  _onTouchmove(event) {
    event.preventDefault();
    const newValue = this._valStart + Math.round((event.changedTouches[0].clientX - this._xStart) / 5) * this._step;
    this.set('value', Math.max(this.min, Math.min(this.max, newValue)));
  }
  _onTouchend(event) {
    event.preventDefault();
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
    this._step = 0;
    this.expanded = false;
  }
  _onPointerDown(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const item = event.composedPath()[0];
    this._step = Number(item.textContent);
  }
  stepChanged() {
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
    ])
  }
}

IoLadder.Register();

IoLadder.singleton = new IoLadder();
IoMathLayer.singleton.appendChild(IoLadder.singleton);
IoLadder.singleton.addEventListener('expanded-changed', IoMathLayer.singleton.onChildExpanded);
