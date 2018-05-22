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
      time: 0,
      control: String
    }
  }
  static get listeners() {
    return {
      'scroll': '_stopEvent',
      'value-set': '_onValueSet'
    }
  }
  _stopEvent(event) {
    event.stopPropagation();
  }
  _onValueSet(event) {
    if (this._example) {
      this._example.onPropertyChange(event.detail);
    }
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
        this._example = new module.Example();
        this._example.play();
        // this._inspector.value = this._example;
        // TODO: temp debug
        // this._inspector.value = this._example.scene.children[2].material;
        // setTimeout(()=>{
        //   this._inspector.value = this._example.scene.children[2].material.map;
        // },100);
        this._example.time = 0;
        this._lastTime = Date.now() / 1000;
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
      this._example.time += Date.now() / 1000 - this._lastTime;
      if (!this._example.rendered) {
        this._example.rendered = true;
        this.rendered = false;
      }
      // this.fire('io-object-mutated', {object: this._example, key: 'time'}, false, window);
    }
    this._lastTime = Date.now() / 1000;
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
