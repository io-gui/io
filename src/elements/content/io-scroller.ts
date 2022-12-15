import { IoElement, RegisterIoElement } from '../../core/element.js';
import { MenuOptions } from '../menus/models/menu-options.js';
import { Property } from '../../core/internals/property.js';

@RegisterIoElement
export class IoScroller extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        align-items: flex-start;
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

  @Property('last')
  declare select: 'first' | 'last';

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
    this._scrollToSelected(false);
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
      delete this._scrollThrottle;
      const top = this.scrollTop;
      // const bottom = top + this.getBoundingClientRect().height;
      let closestID = '';
      this._elements = [...this.querySelectorAll('[id]')];

      for (let i = 0; i < this._elements.length; i++) {
        const elem = this._elements[i];
        const menuItem = this.options.getItem(elem.id, true);
        if (menuItem) {
          const elemTop = elem.offsetTop;
          // const elemBottom = elem.offsetTop + elem.offsetHeight;
          closestID = closestID || this._elements[i].id;
          // TODO: this caused issues when element had more height than the parent.
          // if (elemTop >= (top - 1) && elemBottom <= (bottom + 1)) {
          if (elemTop >= (top - 1)) {
            closestID = elem.id;
            break;
          }
        }

      }

      this._pauseScroll = true;

      if (closestID) {
        const menuItem = this.options.getItem(closestID, true);
        if (menuItem) menuItem.selected = true;
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

  protected _scrollToSelected(smooth = false) {
    const selected = this.select === 'first' ? this.options.first : this.options.last;

    debug: {
      if (selected && typeof selected !== 'string') {
        console.warn('IoScroller: selected option first is not a string!');
      }
    }

    if (typeof selected !== 'string') return;
    if (selected) {
      const element = this.querySelector('#' + selected);
      if (element) {
        // this._pauseScroll = false;
        this._scrollTo(element, smooth);
      }
    }
  }

  changed() {
    this._scrollToSelected(true);
  }

  dispose() {
    super.dispose();
    this._observer.disconnect();
  }
}
