import * as THREE from "../../../../lib/three.module.js";

class Properties {}

export default class ThreeShot {
  static get properties() {
    return {
      float: 0.0,
      floatSlider: {
        value: 0.17,
        config: {tag: 'io-slider', min: 0, max: 1}
      },
      integer: {
        value: 0,
        config: {tag: 'io-number', step: 1}
      },
      string: "hello",
      bool: true,
      option: {
        value: 'first',
        config: {tag: 'io-option', options: [{value: 1, label: 'first'}, {value: 2, label: 'second'}]}
      }
    }
  }
  constructor() {
    Object.defineProperty(this, 'properties', { value: new Properties() } );
    Object.defineProperty(this, 'configs', { value: {} } );
    let properties = this.__proto__.constructor.properties;
    for (let key in properties) {
      if (properties[key] instanceof Object) {
        this.properties[key] = properties[key].value;
        this.configs['key:' + key] = {tag: properties[key].config.tag, props: properties[key].config};
      } else {
        this.properties[key] = properties[key];
      }

    }
    this.init();
  }
  init() {
    let camera = this.camera = new THREE.PerspectiveCamera( 45, 1, .1, 20000 );
    let scene = this.scene = new THREE.Scene();
  }
  dispose() {
    // TODO
  }
  play() {

  }
  pause() {

  }
  stop() {

  }
  update(dtime, time, progress) {

  }
  preRender() {

  }
  postRender() {

  }
  path(path, importurl) {
    return new URL(path, importurl).pathname;
  }
}
