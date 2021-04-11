import {ProtoChain} from './protoChain.js';
import {Node} from '../node.js';

// const NATIVE_HTML_EVENTS = [ 'abort', 'animationend', 'animationiteration', 'animationstart', 'auxclick', 'beforecopy',
// 'beforecut', 'beforepaste', 'beforexrselect', 'blur', 'cancel', 'canplay', 'canplaythrough', 'change', 'click', 'close',
// 'contextmenu', 'copy', 'cuechange', 'cut', 'dblclick', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart',
// 'drop', 'durationchange', 'emptied', 'ended', 'error', 'focus', 'formdata', 'fullscreenchange', 'fullscreenerror',
// 'gotpointercapture', 'input', 'invalid', 'keydown', 'keypress', 'keyup', 'load', 'loadeddata', 'loadedmetadata', 'loadstart',
// 'lostpointercapture', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel',
// 'paste', 'pause', 'play', 'playing', 'pointercancel', 'pointerdown', 'pointerenter', 'pointerleave', 'pointermove', 'pointerout',
// 'pointerover', 'pointerrawupdate', 'pointerup', 'progress', 'ratechange', 'reset', 'resize', 'scroll', 'search', 'seeked',
// 'seeking', 'select', 'selectionchange', 'selectstart', 'stalled', 'submit', 'suspend', 'timeupdate', 'toggle', 'transitioncancel',
// 'transitionend', 'transitionrun', 'transitionstart', 'volumechange', 'waiting', 'webkitanimationend', 'webkitanimationiteration',
// 'webkitanimationstart', 'webkitfullscreenchange', 'webkitfullscreenerror', 'webkittransitionend', 'wheel'];

type ProtoListenerType = keyof Node | EventListenerOrEventListenerObject | ProtoListenerArrayType;
type ProtoListenerArrayType = [keyof Node | EventListenerOrEventListenerObject, AddEventListenerOptions | undefined];

type PropListener = [EventListenerOrEventListenerObject, AddEventListenerOptions | undefined];
type PropListeners = Record<string, PropListener>;

export class ProtoListeners {
  [listener: string]: ProtoListenerArrayType;
  constructor(protochain: ProtoChain) {
    for (let i = protochain.length; i--;) {
      const listeners = (protochain[i] as any).Listeners as Record<string, ProtoListenerType>;
      for (let l in listeners) {
        const listener = (listeners[l] instanceof Array) ? listeners[l] :[listeners[l]];
        this[l] = listener as ProtoListenerArrayType;
      }
    }
  }
}

/**
 * Event Dispatcher.
 */
class EventDispatcher {
  private readonly __node: Node;
  private __protoListeners: ProtoListeners;
  private __propListeners: PropListeners = {};
  private __activeListeners: Record<string, EventListenerOrEventListenerObject[]> = {};
  // private __inactiveListeners: Record<string, EventListenerOrEventListenerObject[]> = {};
  private readonly __listenerOptions: WeakMap<EventListenerOrEventListenerObject, AddEventListenerOptions | undefined> = new WeakMap();
  private __connected: boolean = false;
  /**
   * Creates Event Dispatcher.
   */
  constructor(node: Node, protoListeners: ProtoListeners) {
    this.__node = node;
    this.__protoListeners = protoListeners;
    Object.defineProperty(this, '__node',            {enumerable: false, writable: false});
    Object.defineProperty(this, '__protoListeners',  {enumerable: false});
    Object.defineProperty(this, '__propListeners',   {enumerable: false});
    Object.defineProperty(this, '__activeListeners', {enumerable: false});
    Object.defineProperty(this, '__listenerOptions', {enumerable: false, writable: false});
    Object.defineProperty(this, '__connected',       {enumerable: false});
  }
  /**
   * Sets listeners from inline properties (filtered form properties map by 'on-' prefix).
   * @param {Object} properties - Properties.
   */
  setPropListeners(properties: Record<string, ProtoListenerType>) {
    // TODO: Unset propListeners, test.
    const listeners = this.__propListeners;

    const newListeners: PropListeners = {};
    for (let prop in properties) {
      if (prop.startsWith('on-')) {
        const type = prop.slice(3, prop.length);
        const listener = (properties[prop] instanceof Array)
          ? [(properties[prop] as ProtoListenerArrayType)[0], (properties[prop] as ProtoListenerArrayType)[1]]
          : [properties[prop]];
        if (typeof listener[0] !== 'function') listener[0] = this.__node[listener[0] as keyof Node];
        newListeners[type] = listener as PropListener;
      }
    }

    for (let type in newListeners) {
      if (listeners[type]) {
        this.__node.removeEventListener(type, listeners[type][0], listeners[type][1]);
      }
      listeners[type] = newListeners[type];
      if (this.__connected) {
        this.__node.addEventListener(type, listeners[type][0], newListeners[type][1]);
      }
    }
  }
  /**
   * Connects all event listeners.
   */
  connect() {
    debug: { if (this.__connected) console.error('EventDispatcher: already connected!') }
    this.__connected = true;

    for (let type in this.__protoListeners) {
      const isFunction = typeof this.__protoListeners[type][0] === 'function';
      const listener = isFunction ? this.__protoListeners[type][0] : this.__node[this.__protoListeners[type][0] as keyof Node];
      this.addEventListener(type, listener, this.__protoListeners[type][1]);
    }

    for (let type in this.__propListeners) {
      this.addEventListener(type, this.__propListeners[type][0], this.__propListeners[type][1]);
    }

    // // TODO: sort out!
    // for (let type in this.__inactiveListeners) {
    //   for (let j = this.__inactiveListeners[type].length; j--;) {
    //     const listener = this.__inactiveListeners[type][j];
    //     // const i = this.__activeListeners[type].indexOf(listener);
    //     // if (i === -1) {
    //       const options = this.__listenerOptions.get(listener);
    //       this.addEventListener(type, listener, options);
    //     // }
    //     this.__inactiveListeners[type].splice(j, 1);
    //   }
    // }
  }
  /**
   * Disconnects all event listeners.
   */
  disconnect() {
    debug: { if (!this.__connected) console.error('EventDispatcher: already disconnected!') }
    this.__connected = false;

    for (let l in this.__protoListeners) {
      const isFunction = typeof this.__protoListeners[l][0] === 'function';
      const listener = isFunction ? this.__protoListeners[l][0] : this.__node[this.__protoListeners[l][0] as keyof Node];
      this.removeEventListener(l, listener, this.__protoListeners[l][1]);
    }

    for (let l in this.__propListeners) {
      this.removeEventListener(l, this.__propListeners[l][0], this.__propListeners[l][1]);
    }

    // // TODO: sort out!
    // for (let type in this.__activeListeners) {
    //   this.__inactiveListeners[type] = this.__inactiveListeners[type] || [];
    //   for (let j = this.__activeListeners[type].length; j--;) {
    //     const listener = this.__activeListeners[type][j];
    //     const options = this.__listenerOptions.get(listener);
    //     this.removeEventListener(type, listener, options);
    //     this.__inactiveListeners[type].push(listener);
    //   }
    // }
  }
  /**
   * Proxy for `addEventListener` method.
   * Adds an event listener.
   */
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions) {
    this.__activeListeners[type] = this.__activeListeners[type] || [];
    const i = this.__activeListeners[type].indexOf(listener);
    if (i === -1) {
      if (this.__node.__isIoElement) {
        HTMLElement.prototype.addEventListener.call(this.__node, type, listener, options);
      }
      this.__activeListeners[type].push(listener);
      this.__listenerOptions.set(listener, options);
    }
  }
  /**
   * Proxy for `removeEventListener` method.
   * Removes an event listener.
   */
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions) {
    if (this.__activeListeners[type] !== undefined) {
      const i = this.__activeListeners[type].indexOf(listener);
      // TODO `listener === undefined` removing all listeners needs iterator.
      // TODO `options === undefined` should get options from `__listenerOptions`.
      if (i !== - 1 || listener === undefined) {
        if (this.__node.__isIoElement) {
          HTMLElement.prototype.removeEventListener.call(this.__node, type, listener, options);
        }
        this.__activeListeners[type].splice(i, 1);
      }
    }
  }
  /**
   * Shorthand for custom event dispatch.
   */
  dispatchEvent(type: string, detail: Record<string, any> = {}, bubbles: boolean = true, src: HTMLElement | any = this.__node) {
    if ((src instanceof HTMLElement || src === window)) {
      HTMLElement.prototype.dispatchEvent.call(src, new CustomEvent(type, {detail: detail, bubbles: bubbles, composed: true, cancelable: true}));
    } else {
      const active = this.__activeListeners;
      if (active[type] !== undefined) {
        const array = active[type].slice(0);
        for (let i = 0; i < array.length; i ++) {
          (array[i] as Function).call(src, {detail: detail, target: src, path: [src]});
          // TODO: consider bubbling.
        }
      }
    }
  }
  /**
   * Disconnects all event listeners and removes all references.
   * Use this when node is no longer needed.
   */
  dispose() {
    // TODO: test
    if (this.__connected) this.disconnect();
  }
}

export {EventDispatcher};
