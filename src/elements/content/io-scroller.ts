import { IoElement, RegisterIoElement } from '../../core/element.js';
import { MenuOptions } from '../menus/models/menu-options.js';
import { Property } from '../../core/internals/property.js';

@RegisterIoElement
export class IoScroller extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        flex-direction: column;
        overflow-y: auto;
        position: relative;
        max-height: 100%;
        justify-self: stretch;
        align-self: stretch;
        flex: 1 1 auto;
      }
    `;
  }

  @Property({type: MenuOptions, observe: true})
  declare options: MenuOptions;

  declare private _observer: MutationObserver;
  private _scrollToThrottle?: ReturnType<typeof setTimeout>;
  private _anchor?: string;

  init() {
    this._observer = new MutationObserver(this._onDomMutation);
    this._observer.observe(this as unknown as HTMLElement, {attributes: false, childList: true, subtree: true});
  }
  connectedCallback() {
    super.connectedCallback();
    this.optionsMutated();
  }
  protected _onDomMutation() {
    this.throttle(this._onDomMutationThrottled);
  }
  protected _onDomMutationThrottled() {
    this._scrollToAnchor();
  }

  protected _scrollToAnchor(smooth = false) {
    const hasScrollbar = this.scrollHeight > this.clientHeight;
    if (!hasScrollbar) return;

    const anchor = this._anchor;

    debug: {
      if (anchor && typeof anchor !== 'string') {
        console.warn('IoScroller: anchor option first is not a string!');
      }
    }

    if (typeof anchor !== 'string') return;
    if (anchor) {
      const element = this.querySelector('#' + anchor);
      if (element) {
        this._scrollToElement(element, smooth);
      }
    }
  }

  protected _scrollToElement(element?: HTMLElement, smooth?: boolean) {
    clearTimeout(this._scrollToThrottle);
    this._scrollToThrottle = setTimeout(() => {
      delete this._scrollToThrottle;
      if (element) {
        this.scrollTo({top: element.offsetTop, behavior: smooth ? 'smooth' : 'auto'});
      } else {
        this.scrollTo(0, 0);
      }
    });
  }

  optionsMutated() {
    const anchor = this.options.anchor;
    if (anchor !== this._anchor) {
      this._anchor = anchor;
      this._scrollToAnchor();
    }
  }

  dispose() {
    super.dispose();
    this._observer.disconnect();
  }
}
