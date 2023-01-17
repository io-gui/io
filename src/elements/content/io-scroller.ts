import { IoElement, RegisterIoElement } from '../../core/element.js';
import { MenuOptions } from '../menus/models/menu-options.js';
import { Property } from '../../core/internals/property.js';

@RegisterIoElement
export class IoScroller extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
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
  private _scroll?: string;

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

    const scroll = this._scroll;

    debug: {
      if (scroll && typeof scroll !== 'string') {
        console.warn('IoScroller: scroll option first is not a string!');
      }
    }

    if (typeof scroll !== 'string') return;
    if (scroll) {
      const element = this.querySelector('#' + scroll);
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
    const scroll = this.options.scroll;
    if (scroll !== this._scroll) {
      this._scroll = scroll;
      this._scrollToAnchor();
    }
  }

  dispose() {
    super.dispose();
    this._observer.disconnect();
  }
}
