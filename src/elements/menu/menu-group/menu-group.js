import {Io, html} from "../../../iocore.js";
import {MenuLayer} from "../menu-layer/menu-layer.js";
import {MenuItem} from "../menu-item/menu-item.js";

export class MenuGroup extends Io {
  static get style() {
    return html`
      <style>
        :host {
          display: none;
          flex-direction: column;
          position: absolute;
          transform: translateZ(0);
          top: 0;
          left: 0;
          background: white;
          white-space: nowrap;
          padding: 0.125em 0 0.25em 0;
          border: 1px solid #666;
          box-shadow: 1px 1px 2px rgba(0,0,0,0.33);
          min-width: 6em;
        }
        :host[expanded] {
          display: flex;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      options: {
        type: Array
      },
      expanded: {
        type: Boolean,
        notify: true,
        reflect: true
      },
      position: {
        type: String,
        value: 'right'
      },
      $parent: {
        type: HTMLElement
      },
      $options: {
        type: Array
      }
    };
  }
  constructor(props) {
    super(props);
    let frag = document.createDocumentFragment();
    for (let i = 0; i < this.options.length; i++) {
      this.$options[i] = new MenuItem({option: this.options[i], $parent: this});
      frag.appendChild(this.$options[i]);
    }
    this.appendChild(frag);
  }
}

MenuGroup.Register();
