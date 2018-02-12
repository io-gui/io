const clickmask = document.createElement('div');
clickmask.style = "position: fixed; top:0; left:0; bottom:0; right:0; z-index:2147483647;"

export class Vector2 extends Object {
  constructor(vector = {}) {
    super();
    this.x = vector.x || 0;
    this.y = vector.y || 0;
  }
  set(vector) {
    this.x = vector.x;
    this.y = vector.y;
    return this ;
  }
  sub(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this ;
  }
  distanceTo(vector) {
    var dx = this.x - vector.x, dy = this.y - vector.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  getClosest(array) {
    let closest = array[0];
    for (var i = 1; i < array.length; i++) {
      if (this.distanceTo(array[i]) < this.distanceTo(closest)) {
        closest = array[i];
      }
    }
    return closest;
  }
}

export class Pointer extends Object {
  constructor(pointer = {}) {
    super();
    this.position = new Vector2(pointer.position);
    this.previous = new Vector2(pointer.previous);
    this.movement = new Vector2(pointer.movement);
    this.distance = new Vector2(pointer.distance);
    this.start = new Vector2(pointer.start);
  }
  getClosest(array) {
    let closest = array[0];
    for (var i = 1; i < array.length; i++) {
      if (this.position.distanceTo(array[i].position) < this.position.distanceTo(closest.position)) {
        closest = array[i];
      }
    }
    return closest;
  }
  update(pointer) {
    this.previous.set(this.position);
    this.movement.set(pointer.position).sub(this.position);
    this.distance.set(pointer.position).sub(this.start);
    this.position.set(pointer.position);
  }
}

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
    }
  }
  getPointers(event, reset) {
    let touches = event.touches ? event.touches : [event];
    let foundPointers = [];
    for (var i = 0; i < touches.length; i++) {
      if (touches[i].target === event.target || event.touches === undefined) {
        let position = new Vector2({
          x: touches[i].clientX,
          y: touches[i].clientY
        });
        if (this.pointers[i] === undefined) this.pointers[i] = new Pointer({start: position});
        let newPointer = new Pointer({position: position});
        let pointer = newPointer.getClosest(this.pointers);
        pointer.update(newPointer);
        foundPointers.push(pointer);
      }
    }
    for (i = this.pointers.length; i--;) {
      if(foundPointers.indexOf(this.pointers[i]) === -1) {
        this.pointers.splice(i, 1);
      }
    }
  }
  _mousedownHandler(event) {
    event.preventDefault();
    this.focus();
    this.getPointers(event, true);
    this._dispatchEvent('io-pointer-start', event, this.pointers);
    window.addEventListener('mousemove', this._mousemoveHandler);
    window.addEventListener('mouseup', this._mouseupHandler);
    if (clickmask.parentNode !== document.body) {
      document.body.appendChild(clickmask);
    }
  }
  _mousemoveHandler(event) {
    this.getPointers(event);
    this._dispatchEvent('io-pointer-move', event, this.pointers);
  }
  _mouseupHandler(event) {
    this.getPointers(event);
    this._dispatchEvent('io-pointer-end', event, this.pointers);
    window.removeEventListener('mousemove', this._mousemoveHandler);
    window.removeEventListener('mouseup', this._mouseupHandler);
    if (clickmask.parentNode === document.body) {
      document.body.removeChild(clickmask);
    }
  }
  _mousehoverHandler(event) {
    this.getPointers(event);
    this._dispatchEvent('io-pointer-hover', event, this.pointers);
  }
  _touchstartHandler(event) {
    event.preventDefault();
    this.focus();
    this.getPointers(event, true);
    this._dispatchEvent('io-pointer-hover', event, this.pointers);
    this._dispatchEvent('io-pointer-start', event, this.pointers);
    this.addEventListener('touchmove', this._touchmoveHandler);
    this.addEventListener('touchend', this._touchendHandler);
  }
  _touchmoveHandler(event) {
    event.preventDefault();
    this.getPointers(event);
    this._dispatchEvent('io-pointer-move', event, this.pointers);
  }
  _touchendHandler(event) {
    event.preventDefault();
    this.removeEventListener('touchmove', this._touchmoveHandler);
    this.removeEventListener('touchend', this._touchendHandler);
    this._dispatchEvent('io-pointer-end', event, this.pointers);

  }
  _dispatchEvent(eventName, event, pointer) {
    this.dispatchEvent(new CustomEvent(eventName, {
      detail: {event: event, pointer: pointer},
      bubbles: false,
      composed: true
    }));
  }
}
