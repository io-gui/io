const _clickmask = document.createElement('div');
_clickmask.style = "position: fixed; top:0; left:0; bottom:0; right:0; z-index:2147483647;";

import {Pointer} from "../core/pointer.js";
import {Vector2} from "../core/vector2.js";

export const IoPointerMixin = (superclass) => class extends superclass {
  static get properties() {
    return {
      pointers: {
        value: [],
        type: Array
      },
      listeners: {
        'mousedown': '_mousedownHandler',
        'touchstart': '_touchstartHandler',
        'mousemove': '_mousehoverHandler'
      }
    };
  }
  constructor(params) {
    super(params);
    this._clickmask = _clickmask;
  }
  getPointers(event, reset) {
    let touches = event.touches ? event.touches : [event];
    let foundPointers = [];
    let rect = this.getBoundingClientRect();
    for (let i = 0; i < touches.length; i++) {
      if (touches[i].target === event.target || event.touches === undefined) {
        let position = new Vector2({
          x: touches[i].clientX - rect.left,
          y: touches[i].clientY - rect.top
        });
        if (this.pointers[i] === undefined) this.pointers[i] = new Pointer({start: position});
        let newPointer = new Pointer({position: position});
        let pointer = newPointer.getClosest(this.pointers);
        if (reset) pointer.start.set(position);
        pointer.update(newPointer);
        foundPointers.push(pointer);
      }
    }
    for (let i = this.pointers.length; i--;) {
      if(foundPointers.indexOf(this.pointers[i]) === -1) {
        this.pointers.splice(i, 1);
      }
    }
  }
  _mousedownHandler(event) {
    event.preventDefault();
    this.focus();
    this.getPointers(event, true);
    this._fire('io-pointer-start', event, this.pointers);
    window.addEventListener('mousemove', this._mousemoveHandler);
    window.addEventListener('mouseup', this._mouseupHandler);
    if (_clickmask.parentNode !== document.body) {
      document.body.appendChild(_clickmask);
    }
  }
  _mousemoveHandler(event) {
    this.getPointers(event);
    this._fire('io-pointer-move', event, this.pointers);
  }
  _mouseupHandler(event) {
    this.getPointers(event);
    this._fire('io-pointer-end', event, this.pointers);
    window.removeEventListener('mousemove', this._mousemoveHandler);
    window.removeEventListener('mouseup', this._mouseupHandler);
    if (_clickmask.parentNode === document.body) {
      document.body.removeChild(_clickmask);
    }
  }
  _mousehoverHandler(event) {
    this.getPointers(event);
    this._fire('io-pointer-hover', event, this.pointers);
  }
  _touchstartHandler(event) {
    event.preventDefault();
    this.focus();
    this.getPointers(event, true);
    this._fire('io-pointer-hover', event, this.pointers);
    this._fire('io-pointer-start', event, this.pointers);
    this.addEventListener('touchmove', this._touchmoveHandler);
    this.addEventListener('touchend', this._touchendHandler);
  }
  _touchmoveHandler(event) {
    event.preventDefault();
    this.getPointers(event);
    this._fire('io-pointer-move', event, this.pointers);
  }
  _touchendHandler(event) {
    event.preventDefault();
    this.removeEventListener('touchmove', this._touchmoveHandler);
    this.removeEventListener('touchend', this._touchendHandler);
    this._fire('io-pointer-end', event, this.pointers);

  }
  _fire(eventName, event, pointer) {
    this.fire(eventName, {event: event, pointer: pointer}, false);
  }
};
