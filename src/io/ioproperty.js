export const IoPropertyMixin = (superclass) => class extends superclass {
  static get properties() {
    return {
      value: {
        type: Object,
        observer: 'update'
      },
      key: {
        type: String,
        observer: 'update'
      }
    }
  }
  constructor(props) {
    super(props);
    this.setProperty = this.setProperty.bind(this);
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('io-object-mutated', this._objectMutatedHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('io-object-mutated', this._objectMutatedHandler);
  }
  _objectMutatedHandler(event) {
    if (event.detail.object === this.value) {
      if (event.detail.key === this.key || event.detail.key === '*' || this.key === '*') {
        this.update();
      }
    }
  }
  setProperty(event) {
    this.value[this.key] = event.detail.value;
    window.dispatchEvent(new CustomEvent('io-object-mutated', {
      detail: {object: this.value, key: this.key},
      bubbles: false,
      composed: true
    }));
  }
};