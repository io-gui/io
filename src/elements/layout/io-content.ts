import { IoElement, RegisterIoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';

@RegisterIoElement
export class IoContent extends IoElement {
  static get Style() {
    return /* css */`
    --io-content: {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      flex: 1 1 auto;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      -webkit-tap-highlight-color: transparent;
    }
    :host {
      @apply --io-content;
    }
    :host:not([visible]) {
      display: none;
    }
    `;
  }

  static get Listeners() {
    return {
      'scroll': ['_onScroll', {capture: true, passive: true}],
    };
  }

  @Property('')
  declare anchor: string;

  @Property({value: true, reflect: true})
  declare visible: boolean;

  declare private _observer: MutationObserver;
  private _scrollThrottle?: ReturnType<typeof setTimeout>;
  private _scrollToThrottle?: ReturnType<typeof setTimeout>;
  private _pauseScroll = false;
  private _elements: HTMLElement[] = [];

  init() {
    this._observer = new MutationObserver(this._onMutation);
    this._observer.observe(this as unknown as HTMLElement, {attributes: false, childList: true, subtree: false});
  }

  dispose() {
    super.dispose();
    this._observer.disconnect();
  }

  connectedCallback() {
    super.connectedCallback();
    this._scrollTo(this.anchor, false);
  }

  anchorChanged() {
    this._scrollTo(this.anchor, true);
  }

  protected _onMutation() {
    this._elements = [...this.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')];
    this._scrollTo(this.anchor, false);
  }

  protected _onScroll() {
    clearTimeout(this._scrollThrottle);
    this._scrollThrottle = setTimeout(() => {
      delete this._scrollThrottle;
      const top = this.scrollTop || this.children[0].scrollTop;
      const bottom = top + this.getBoundingClientRect().height / 2;
      let anchor = '';
      for (let i = this._elements.length; i--;) {
        if (this.scrollTop === 0) break;
        const elem = this._elements[i];
        const nextElem = this._elements[i + 1];
        const elemTop = elem.offsetTop;
        const elemBottom = nextElem ? nextElem.offsetTop : elemTop;
        if ((elemTop < top - 5) && (elemBottom < bottom) && i !== this._elements.length - 1) {
          break;
        }
        anchor = elem.id;
      }
      this._pauseScroll = true;
      this.anchor = anchor;
      setTimeout(() => {
        this._pauseScroll = false;
      });
    }, 200);
  }
  protected _scrollTo(anchor: string, smooth?: boolean) {
    if (this._pauseScroll === true) return;
    clearTimeout(this._scrollToThrottle);
    this._scrollToThrottle = setTimeout(() => {
      delete this._scrollToThrottle;
      if (anchor === '') {
        this.scrollTo(0, 0);
      } else {
        const elem = this.querySelector('#' + anchor.toLowerCase());
        elem?.scrollIntoView({behavior: smooth ? 'smooth' : 'auto'});
      }
    });
  }
}