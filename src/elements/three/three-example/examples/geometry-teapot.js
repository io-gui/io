import * as THREE from "../../../../../lib/three.module.js";
import {TeapotBufferGeometry} from "./js/geometries/TeapotBufferGeometry.js";
import ThreeShot from "../three-shot.js";

var teapotSize = 400;

export default class extends ThreeShot {
  static get properties() {
    return {
      shininess: {value: 40.0, config: {tag: 'io-slider', min: 0, max: 400 }},
      ka: {value: 0.17, config: {tag: 'io-slider', min: 0, max: 1, label: 'ambient' }},
      kd: {value: 0.51, config: {tag: 'io-slider', min: 0, max: 1, label: 'diffuse strength' }},
      ks: {value: 0.2, config: {tag: 'io-slider', min: 0, max: 1, label: 'specular strength' }},
      metallic: true,
      hue: { value: 0.121, config: {tag: 'io-slider', min: 0, max: 1 }},
      saturation: { value: 0.73, config: {tag: 'io-slider', min: 0, max: 1 }},
      lightness: { value: 0.66, config: {tag: 'io-slider', min: 0, max: 1 }},
      lhue: { value: 0.04, config: {tag: 'io-slider', min: 0, max: 1, label: 'hue' }},
      lsaturation: { value: 0, config: {tag: 'io-slider', min: 0, max: 1, label: 'saturation' }},
      llightness: { value: 1, config: {tag: 'io-slider', min: 0, max: 1, label: 'lightness' }},
      // ldirection: { value: new THREE.Vector3() },
      lx: 0.32,
      ly: 0.39,
      lz: 0.7,
      // tess: { value: 15, config: {min: 2, max: 50, step: 1, label: 'tesselation' }},
      bottom: true,
      lid: true,
      body: true,
      fitLid: false,
      nonblinn: false,
      shading: { value: 'textured', config: { tag: 'io-option', options: [ 'wireframe', 'flat', 'smooth', 'glossy', 'textured', 'reflective' ] } }
    }
  }
  init() {

    let camera = this.camera = new THREE.PerspectiveCamera( 45, 1, .1, 20000 );
    let scene = this.scene = new THREE.Scene();

    var props = this.properties;

    var ambientLight, light;
    var skybox;

    var tess = -1;	// force initialization
    var bBottom ;
    var bLid;
    var bBody;
    var bFitLid;
    var bNonBlinn;
    var shading;

    var teapot, textureCube;

    // allocate these just once
    var diffuseColor = new THREE.Color();
    var specularColor = new THREE.Color();

    // CAMERA
    camera.position.set( -600, 550, 1300 );

    // LIGHTS
    ambientLight = new THREE.AmbientLight( 0x333333 );	// 0.2

    light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
    // direction is set in GUI

    // TEXTURE MAP
    var textureMap = new THREE.TextureLoader().load( this.path( 'textures/UV_Grid_Sm.jpg', import.meta.url ), () => {
      this.rendered = false;
    } );
    textureMap.wrapS = textureMap.wrapT = THREE.RepeatWrapping;
    textureMap.anisotropy = 16;

    // REFLECTION MAP
    var path = this.path( "textures/cube/skybox/", import.meta.url );
    var urls = [
      path + "px.jpg", path + "nx.jpg",
      path + "py.jpg", path + "ny.jpg",
      path + "pz.jpg", path + "nz.jpg"
    ];

    textureCube = new THREE.CubeTextureLoader().load( urls, () => {
      this.rendered = false;
    } );

    // MATERIALS
    var materialColor = new THREE.Color();
    materialColor.setRGB( 1.0, 1.0, 1.0 );

    this.materials = {
      'wireframe' : new THREE.MeshBasicMaterial( { color: 0xFFFFFF, wireframe: true } ),
      'flat' : new THREE.MeshPhongMaterial( { color: materialColor, specular: 0x000000, flatShading: true, side: THREE.DoubleSide } ),
      'smooth' : new THREE.MeshLambertMaterial( { color: materialColor, side: THREE.DoubleSide } ),
      'glossy' : new THREE.MeshPhongMaterial( { color: materialColor, side: THREE.DoubleSide } ),
      'textured' : new THREE.MeshPhongMaterial( { color: materialColor, map: textureMap, side: THREE.DoubleSide } ),
      'reflective' : new THREE.MeshPhongMaterial( { color: materialColor, envMap: textureCube, side: THREE.DoubleSide } )
    }

    // scene itself
    scene.background = textureCube;

    scene.add( ambientLight );
    scene.add( light );

    this.createNewTeapot();

  }
  update() {
    // let props = this.properties;
    // let scene = this.scene;
    // let camera = this.camera;
    //TODO: onChange
    // createNewTeapot();
  }
  createNewTeapot() {

    let props = this.properties;

    if ( this.teapot !== undefined ) {

      this.teapot.geometry.dispose();
      this.scene.remove( this.teapot );

    }

    var teapotGeometry = new TeapotBufferGeometry( teapotSize,
      props.tess,
      props.bottom,
      props.lid,
      props.body,
      props.fitLid,
      !props.nonblinn );

    this.teapot = new THREE.Mesh( teapotGeometry, this.materials[props.shading] );

    this.scene.add( this.teapot );

  }
}
