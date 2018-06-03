import {html} from "../../../io-element.js";
import {ThreeViewport} from "../three-viewport/three-viewport.js";
import {ThreeInspector} from "../three-inspector/three-inspector.js";

import {TransformControls} from "./examples/js/controls/TransformControls.js";

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
      control: 'EditorControls'
    };
  }
  static get listeners() {
    return {
      'scroll': '_stopEvent',
      'value-set': '_onValueSet'
    };
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

    this._transformControl = new TransformControls(this.camera, this);
    this._transformControl.addEventListener('change', () => {
      if (this._transformControl.object) {
        this.dispatchEvent('io-object-mutated', {object: this._transformControl.object, key: '*'}, false, window);
        this.dispatchEvent('io-object-mutated', {object: this._transformControl.object.matrix, key: '*'}, false, window);
        this.dispatchEvent('io-object-mutated', {object: this._transformControl.object.matrixWorld, key: '*'}, false, window);
      }
      if (this._example) {
        this._example.rendered = false;
      }
      if (this._control) {
        this._control.enabled = !this._transformControl.dragging;
      }
    });

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

        this.camera = this._example.camera;
        this.scene = this._example.scene;
        this._inspector.value = this._example;

        this._example.time = 0;
        this._lastTime = Date.now() / 1000;
        this.setControl();

        this._transformControl.camera = this._example.camera;
        this._transformControl.attach(this._example.scene.children[3]);
        this._example.scene.add(this._transformControl);
        this._example.rendered = false;
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
          this.dispatchEvent('io-object-mutated', {object: this._example.camera, key: '*'}, false, window);
          this.dispatchEvent('io-object-mutated', {object: this._example.camera.matrix, key: '*'}, false, window);
          this.dispatchEvent('io-object-mutated', {object: this._example.camera.matrixWorld, key: '*'}, false, window);
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
      this._updateCameraAspect(this.camera);
      this.renderer.render(this.scene, this.camera);
    }
  }
}

ThreeExample.Register();
