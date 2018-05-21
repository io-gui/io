import {IoElement}from "../../../io-element.js";
import {ThreeViewport} from "../three-viewport/three-viewport.js";
import {ThreeInspector} from "../three-inspector/three-inspector.js";

export class ThreeExample extends ThreeViewport {
  static get style() {
    return html`<style>
      :host > three-inspector {
        position: absolute;
        max-height: 100%;
        right: 0;
      }
    </style>`;
  }
  static get properties() {
    return {
      example: {
        type: String,
        observer: 'loadExample'
      },
      control: String
    }
  }
  static get listeners() {
    return {
      'scroll': '_stopEvent'
    }
  }
  _stopEvent(event) {
    event.stopPropagation();
  }
  constructor(props) {
    super(props);
    this._inspector = new ThreeInspector({});
    this.appendChild(this._inspector);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._example) {
      this._example.stop();
      this._example.dispose();
      delete this._example;
    }
    if (this._control) {
      this._control.dispose();
      delete this._control;
    }
  }
  loadExample() {
    if (this._example) {
      this._example.stop();
      this._example.dispose();
      delete this._example;
    }
    if (this.example) {
      import('./examples/' + this.example + '.js').then(module => {
        this._example = new module.default();
        this._example.play();
        this._inspector.value = this._example.properties;
        this._inspector.configs = this._example.configs;
        this.setControl();
      });
    }
  }
  setControl() {
    if (this._control) {
      this._control.dispose();
      delete this._control;
    }
    if (this.control) {
      import('./examples/js/controls/' + this.control + '.js').then(module => {
        this._control = new module.default( this._example.camera, this );
        this._control.addEventListener('change', () => {
          this._example.rendered = false;
        });
        this._example.rendered = false;
      });
    }
  }
  update() {
    if (this._example) {
      this._example.update();
      if (!this._example.rendered) {
        this._example.rendered = true;
        this.rendered = false;
      }
    }
  }
  preRender() {
    if (this._example) this._example.preRender();
  }
  postRender() {
    if (this._example) this._example.postRender();
  }
  render() {
    if (this._example) {
      this._updateCameraAspect(this._example.camera);
      this.renderer.render(this._example.scene, this._example.camera);
    }
  }
}

ThreeExample.Register();
