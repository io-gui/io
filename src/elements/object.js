import {html, IoElement} from "../classes/element.js";
import {ProtoConfig} from "../core/protoConfig.js";

const __configMap = new WeakMap();

export class IoObject extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        flex: 0 0;
        line-height: 1em;
      }
      :host > div.io-object-group {
        font-weight: bold;
      }
      :host > div.io-object-prop {
        display: flex !important;
        flex-direction: row;
      }
      :host > div > span {
        padding: 0 0.2em 0 0.5em;
        flex: 0 0 auto;
      }
      :host > div > io-number {
        color: rgb(28, 0, 207);
      }
      :host > div > io-string {
        color: rgb(196, 26, 22);
      }
      :host > div > io-boolean {
        color: rgb(170, 13, 145);
      }
      :host > div > io-option {
        color: rgb(32,135,0);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: Object,
      config: Object,
      expanded: {
        type: Boolean,
        reflect: true
      },
      label: String
    };
  }
  constructor(props) {
    super(props);
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('io-object-mutated', this._onIoObjectMutated);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('io-object-mutated', this._onIoObjectMutated);
  }
  _onIoObjectMutated(event) {
    let key = event.detail.key;
    if (event.detail.object === this.value) {
      if (key && this.$[key]) {
        this.$[key].__props.value.value = this.value[key];
        this.$[key].changed();
      } else if (!key || key === '*') {
        for (let k in this.$) {
          this.$[k].__props.value.value = this.value[k];
          this.$[k].changed();
        }
      }
    }
  }
  _onValueSet(event) {
    const path = event.composedPath();
    if (path[0] === this) return;
    if (event.detail.object) return; // TODO: unhack
    event.stopPropagation();
    let key = path[0].id;
    if (key !== null) {
      this.value[key] = event.detail.value;
      let detail = Object.assign({object: this.value, key: key}, event.detail);
      this.dispatchEvent('io-object-mutated', detail, false, window);
      this.dispatchEvent('value-set', detail, false); // TODO
    }
  }
  valueChanged() {
    if (__configMap.has(this.value)) {
      this.config = __configMap.get(this.value);
    } else {
      this.config = this.__proto__.__config.getConfig(this.value);
      __configMap.set(this.value, this.config);
    }
  }
  changed() {
    const types = this.config.types;
    const groups = this.config.groups;
    const label = this.label || this.value.constructor.name;
    const elements = [['io-boolean', {true: '▾' + label, false: '▸' + label, value: this.bind('expanded')}]];
    if (this.expanded) {
      for (let g in groups) {
        if (Object.keys(groups).length > 1) elements.push(['div', {className: 'io-object-group'}, g]);
        for (let p in groups[g]) {
          const k = groups[g][p];
          if (types[k]) {
            const tag = types[k][0];
            const protoConfig = types[k][1];
            const itemConfig = {id: k, value: this.value[k], 'on-value-set': this._onValueSet};
            elements.push(['div', {className: 'io-object-prop'}, [['span', types.label || k + ':'], [tag, Object.assign(itemConfig, protoConfig)]]]);
          }
        }

      }
    }
    this.template(elements);
  }
  static get config() {
    return {
      types: {
        'Object': {
          'type:string': ['io-string', {}],
          'type:number': ['io-number', {step: 0.01}],
          'type:boolean': ['io-boolean', {}],
          'type:object': ['io-object', {}],
          'value:null': ['io-string', {}],
          'value:undefined': ['io-string', {}],
        },
      },
      groups: {
        'Object': {
          // 'properties': ['key:time'],
          // 'meshes': ['constructor:Mesh'],
          // 'truestrings': ['value:true', 'value:false'],
          // 'hidden': ['type:function'],
        },
        'Node': {
          'properties': [
            'nodeValue', 'nodeType', 'nodeName', 'baseURI',
          ],
          'hierarchy': [
            'isConnected', 'ownerDocument', 'parentNode', 'parentElement', 'childNodes',
            'firstChild', 'lastChild', 'previousSibling', 'nextSibling',
          ],
          'hidden': [
            'ELEMENT_NODE', 'ATTRIBUTE_NODE', 'TEXT_NODE', 'CDATA_SECTION_NODE',
            'ENTITY_REFERENCE_NODE', 'ENTITY_NODE', 'PROCESSING_INSTRUCTION_NODE',
            'COMMENT_NODE', 'DOCUMENT_NODE', 'DOCUMENT_TYPE_NODE', 'DOCUMENT_FRAGMENT_NODE',
            'NOTATION_NODE', 'DOCUMENT_POSITION_DISCONNECTED', 'DOCUMENT_POSITION_PRECEDING',
            'DOCUMENT_POSITION_FOLLOWING', 'DOCUMENT_POSITION_CONTAINS', 'DOCUMENT_POSITION_CONTAINED_BY',
            'DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC',
            'normalize', 'cloneNode', 'isEqualNode', 'isSameNode', 'compareDocumentPosition', 'contains',
            'lookupPrefix', 'lookupNamespaceURI', 'isDefaultNamespace', 'insertBefore', 'appendChild',
            'replaceChild', 'removeChild', 'hasChildNodes', 'getRootNode', 'textContent',
          ],
        },
        'Element': {
          'properties': [
            'id', 'className',
            'classList', 'attributes', 'localName', 'tagName', 'namespaceURI', 'prefix',
          ],
          'hierarchy': [
            'shadowRoot', 'previousElementSibling', 'nextElementSibling', 'children',
            'firstElementChild', 'lastElementChild', 'childElementCount', 'slot', 'assignedSlot',
          ],
          'style': [
            'attributeStyleMap',
          ],
          'hidden': [
            'innerHTML', 'outerHTML',
            'onbeforecopy', 'onbeforecut', 'onbeforepaste',
            'oncopy', 'oncut', 'onpaste', 'onsearch', 'onselectstart',
            'onwebkitfullscreenchange', 'onwebkitfullscreenerror',
          ],
          'layout': [
            'scrollTop', 'scrollLeft', 'scrollWidth', 'scrollHeight', 'clientTop', 'clientLeft', 'clientWidth', 'clientHeight',
          ],
        },
        'HTMLElement': {
          'properties': [
            'title', 'hidden', 'tabIndex', 'draggable', 'contentEditable', 'isContentEditable',
          ],
          'style': [
            'style',
          ],
          'layout': [
            'offsetParent', 'offsetTop', 'offsetLeft', 'offsetWidth', 'offsetHeight',
          ],
          'hidden': [
            'dataset', 'accessKey', 'nonce',
            'innerText', 'outerText',
            'onabort', 'onblur', 'oncancel', 'oncanplay',
            'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncontextmenu', 'oncuechange', 'ondblclick', 'ondrag',
            'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange', 'onemptied',
            'onended', 'onerror', 'onfocus', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onload',
            'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove',
            'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onpause', 'onplay', 'onplaying', 'onprogress',
            'onratechange', 'onreset', 'onresize', 'onscroll', 'onseeked', 'onseeking', 'onselect', 'onstalled', 'onsubmit',
            'onsuspend', 'ontimeupdate', 'ontoggle', 'onvolumechange', 'onwaiting', 'onwheel', 'onauxclick',
            'ongotpointercapture', 'onlostpointercapture', 'onpointerdown', 'onpointermove', 'onpointerup', 'onpointercancel',
            'onpointerover', 'onpointerout', 'onpointerenter', 'onpointerleave',
          ],
          'language': [
            'inputMode', 'dir', 'lang', 'translate', 'spellcheck', 'autocapitalize',
          ],
        },
      }
    };
  }
  static get groups() {
    return {
    };
  }
}

IoObject.Register = function() {
  IoElement.Register.call(this);
  Object.defineProperty(this.prototype, '__config', {value: new ProtoConfig(this.prototype.__prototypes)});
};

IoObject.Register();
