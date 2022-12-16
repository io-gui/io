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
        flex: 1 1 auto;
      }
    `;
  }

  @Property({type: MenuOptions, observe: true})
  declare options: MenuOptions;

  declare private _observer: MutationObserver;
  private _scrollThrottle?: ReturnType<typeof setTimeout>;
  private _scrollToThrottle?: ReturnType<typeof setTimeout>;
  private _pauseScroll = false;

  static get Listeners() {
    return {
      'scroll': ['_onScroll', {capture: true, passive: true}],
    };
  }

  init() {
    this._observer = new MutationObserver(this._onDomMutation);
    this._observer.observe(this as unknown as HTMLElement, {attributes: false, childList: true, subtree: true});
  }

  connectedCallback() {
    super.connectedCallback();
    this._scrollToAnchor(false);
  }

  protected _onDomMutation() {
    this.throttle(this._onDomMutationThrottled);
  }
  protected _onDomMutationThrottled() {
    this.changed();
  }

  protected _onScroll() {
    clearTimeout(this._scrollThrottle);
    this._scrollThrottle = setTimeout(() => {
      // Prevent unfinished scroll animation from detatched element to trigger menu selection.
      if (!this.isConnected) return;
      delete this._scrollThrottle;
      const top = this.scrollTop;
      let closestID = '';
      this._elements = [...this.querySelectorAll('[id]')];

      for (let i = 0; i < this._elements.length; i++) {
        const elem = this._elements[i];
        const menuItem = this.options.getItem(elem.id, true);
        if (menuItem?.mode === 'anchor') {
          const elemTop = elem.offsetTop;
          closestID = closestID || this._elements[i].id;
          if (elemTop >= (top - 1)) {
            closestID = elem.id;
            break;
          }
        }
      }

      this._pauseScroll = true;

      if (closestID) {
        const menuItem = this.options.getItem(closestID, true);
        if (menuItem?.mode === 'anchor') menuItem.selected = true;
      }
      setTimeout(() => { this._pauseScroll = false; });
    }, 500);
  }

  protected _scrollTo(element?: HTMLElement, smooth?: boolean) {
    if (this._pauseScroll === true) return;
    clearTimeout(this._scrollToThrottle);
    this._scrollToThrottle = setTimeout(() => {
      delete this._scrollToThrottle;
      if (element) {
        this.scrollTo({
          top: element.offsetTop,
          behavior: smooth ? 'smooth' : 'auto'
        });
      } else {
        this.scrollTo(0, 0);
      }
    });
  }

  protected _scrollToAnchor(smooth = false) {
    const anchor = this.options.anchor;

    debug: {
      if (anchor && typeof anchor !== 'string') {
        console.warn('IoScroller: anchor option first is not a string!');
      }
    }

    if (typeof anchor !== 'string') return;
    if (anchor) {
      const element = this.querySelector('#' + anchor);
      if (element) {
        this._scrollTo(element, smooth);
      }
    }
  }

  changed() {
    this._scrollToAnchor(true);
  }

  dispose() {
    super.dispose();
    this._observer.disconnect();
  }
}
