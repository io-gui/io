import {IoElement} from "../dist/io.js";
import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  GridHelper,
  DirectionalLight,
  TextureLoader,
  BoxBufferGeometry,
  MeshLambertMaterial,
  Mesh,
} from "../../../three.js/build/three.module.js";
import {OrbitControls} from "../../../three.js/examples/jsm/controls/OrbitControls.js";
import {TransformControls} from "../../../three.js/examples/jsm/controls/TransformControls.js";

export class IoDemoThree extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex: 1 1;
      flex-direction: row;
      height: 100%;
    }
    :host > io-three-inspector {
      flex: 0 1 30em;
      overflow-y: auto;
    }
    :host > div {
      align-self: flex-stretch;
      flex: 1 0;
    }
    :host > div > canvas:focus {
      outline-offset: -4px;
    }
    :host > div > canvas {
      display: flex;
    }
    `;
  }
  static get Properties() {
    return {
      renderer: WebGLRenderer,
      scene: Scene,
      camera: PerspectiveCamera,
    };
  }
  get size() {
    const rect = this.$.content.getBoundingClientRect();
    return [Math.floor(rect.width), Math.floor(rect.height)];
  }
  render() {
    this.renderer.render( this.scene, this.camera );
  }
  onResized() {
    this.camera.aspect = this.size[0] / this.size[1];
    this.camera.near = 0.1;
    this.camera.far = 100000;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.size[0], this.size[1]);
    this.render();
  }
  constructor(props) {
    super(props);
    this.template([
      ['div', {id: 'content'}],
      ['io-three-inspector', {id: 'inspector', value: this}],
    ]);

    this.render = this.render.bind(this);

    this.init();
    this.render();
  }
  init() {
    const renderer = this.renderer;
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( this.size[0], this.size[1] );
    this.$.content.appendChild( renderer.domElement );
    renderer.domElement.setAttribute('tabindex', 0);
    
    const scene = this.scene;
    scene.add( new GridHelper( 1000, 10 ) );

    const camera = this.camera;
    camera.position.set( 1000, 500, 1000 );
    camera.lookAt( 0, 200, 0 );
    scene.add( camera );

    const light = new DirectionalLight( 0xffffff, 2 );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    const texture = new TextureLoader().load( 'images/logo/io-512.png', this.render );
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const geometry = new BoxBufferGeometry( 200, 200, 200 );
    const material = new MeshLambertMaterial( { map: texture, transparent: true } );

    const mesh = new Mesh( geometry, material );
    scene.add( mesh );

    const orbit = new OrbitControls( camera, renderer.domElement );
    orbit.update();
    orbit.addEventListener( 'change', this.render );

    const control = new TransformControls( camera, renderer.domElement );
    control.addEventListener( 'change', this.render );
    
    control.addEventListener( 'dragging-changed', function ( event ) {
      orbit.enabled = ! event.value;
    } );
    
    control.attach( mesh );
    scene.add( control );

    this.$.inspector.addEventListener( 'change', this.render );

    this.$.inspector.value = scene.children[3].material;
    window.object = this.$.inspector.value; // DEBUG
  }
}

IoDemoThree.Register();
