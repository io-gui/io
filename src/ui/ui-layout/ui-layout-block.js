import {html} from "../../io/ioutil.js"
import {Io} from "../../io/io.js"
import {UiLayoutTab} from "./ui-layout-tab.js"

export class UiLayoutBlock extends Io {
  static get style() {
    return html`
      <style>
        :host  {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          background: #ffc;
        }
        :host > .ui-layout-tabs {
          border-bottom: 1px solid black;
          margin-top: 0.2em;
        }
        :host > .ui-layout-tabs > ui-layout-tab {
          margin-left: 0.2em;
          padding: 0 0.5em 0 0.5em;
          border: 1px solid black;
          background: #ddd;
        }
        :host > .ui-layout-tabs > ui-layout-tab[selected] {
          padding-bottom: 1px;
          border-bottom: 0;
        }
        :host > .ui-layout-content {
          background: #ddd;
          display: flex;
          flex: 1;
        }
        :host > .ui-layout-content > * {
          flex: 1;
        }
        :host > .ui-layout-drop-highlight {
          position: absolute;
          background: rgba(0, 0, 0, 0.25);
          width: 100%;
          height: 100%;
        }
        :host:not([dropzone]) > .ui-layout-drop-highlight {
          pointer-events: none;
          opacity: 0;
        }
        :host[dropzone=top] > .ui-layout-drop-highlight {
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 99.9px, transparent 100px);
        }
        :host[dropzone=bottom] > .ui-layout-drop-highlight {
          background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 99.9px, transparent 100px);
        }
        :host[dropzone=left] > .ui-layout-drop-highlight {
          background: linear-gradient(to right, rgba(0, 0, 0, 0.5) 99.9px, transparent 100px);
        }
        :host[dropzone=right] > .ui-layout-drop-highlight {
          background: linear-gradient(to left, rgba(0, 0, 0, 0.5) 99.9px, transparent 100px);
        }
      </style>
    `;
  }
  static get properties() {
    return {
      data: {
        type: Object
      },
      elements: {
        type: Object
      },
      tabs: {
        value: [],
        type: Array
      },
      selected: {
        type: String,
        observer: '_update'
      },
      dropzone: {
        type: String,
        reflectToAttribute: true
      },
      // listeners: {
      //   'dragover': '_dragoverHandler'
      // }
    }
  }
  // constructor(props) {
  //   super(props);
  //   if (this.selected === '')
  //       this.selected = this.tabs[0];
  // }
  // _dragoverHandler(event) {
  //   if (UiLayoutTab.dragged) UiLayoutTab.dragged.droptarget = this;
  //   let rect = this.getBoundingClientRect();
  //   let x = 2 * (((event.clientX - rect.x) / rect.width) - 0.5);
  //   let y = 2 * (((event.clientY - rect.y) / rect.height) - 0.5);
  //   if (event.clientY - rect.y < 20) this.dropzone = 'tabs';
  //   else if (Math.abs(y) < 0.5 && Math.abs(x) < 0.5) this.dropzone = 'center';
  //   else if (y < -Math.abs(x)) this.dropzone = 'top';
  //   else if (y > +Math.abs(x)) this.dropzone = 'bottom';
  //   else if (x < -Math.abs(y)) this.dropzone = 'left';
  //   else if (x > +Math.abs(y)) this.dropzone = 'right';
  //   else this.dropzone = 'center';
  // }
  _selectHandler(elem) {
    this.selected = elem;
    this.data.selected = elem;
    this.dispatchEvent(new CustomEvent('layout-changed', {
      detail: this.data,
      bubbles: true,
      composed: true
    }));
  }
  _update() {
    const Elem = (entry, i) => ['ui-layout-tab', {
        value: entry,
        action: this._selectHandler,
        selected: entry === this.selected
      }, entry];
    this.render([
      ['div', {class: 'ui-layout-tabs'}, [
        this.tabs.map(Elem),
      ]],
      ['div', {class: 'ui-layout-content'}, [
        this.tabs.indexOf(this.selected) !== -1 ? this.elements[this.selected] : null
      ]],
      ['div', {class: 'ui-layout-drop-highlight'}]
    ]);
  }
}


window.customElements.define('ui-layout-block', UiLayoutBlock);
