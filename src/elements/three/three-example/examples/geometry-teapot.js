import * as THREE from "../../../../../lib/three.module.js";
import {TeapotBufferGeometry} from "./js/geometries/TeapotBufferGeometry.js";
import {ThreeShot} from "../../three-shot/three-shot.js";

let TEAPOT_SIZE = 400;

export class Example extends ThreeShot {
  static get properties() {
    return {
      teapot: null,
      tess: { value: 15, config: {min: 2, max: 50, step: 1, label: 'tesselation' }},
      bottom: true,
      lid: true,
      body: true,
      fitLid: false,
      nonblinn: { value: false, config: {label: 'original scale'} },
      shading: { value: 'textured', config: { tag: 'io-option', options: [ 'wireframe', 'flat', 'smooth', 'glossy', 'textured', 'reflective' ] } }
    };
  }
  onPropertyChange(event) {
    if (event.object === this) {
      this.createNewTeapot();
    }
    this.rendered = false;
  }
  init() {
    let camera = this.camera = new THREE.PerspectiveCamera( 45, 1, .1, 20000 );
    let scene = this.scene = new THREE.Scene();

    // CAMERA
    camera.position.set( -600, 550, 1300 );
    scene.add( camera );

    // LIGHTS
    let ambientLight = new THREE.AmbientLight( 0x333333 );	// 0.2
    scene.add( ambientLight );

    let light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
    scene.add( light );

    // TEXTURE MAP
    let textureMap = new THREE.TextureLoader().load( this.path( 'textures/UV_Grid_Sm.jpg', import.meta.url ), () => {
      this.rendered = false;
    } );

    // REFLECTION MAP
    let path = this.path( "textures/cube/skybox/", import.meta.url );
    let urls = [
      path + "px.jpg", path + "nx.jpg",
      path + "py.jpg", path + "ny.jpg",
      path + "pz.jpg", path + "nz.jpg"
    ];

    let textureCube = new THREE.CubeTextureLoader().load( urls, () => {
      this.rendered = false;
    } );

    // MATERIALS
    this.materials = {
      'wireframe' : new THREE.MeshBasicMaterial( { wireframe: true, side: THREE.DoubleSide } ),
      'flat' : new THREE.MeshPhongMaterial( { flatShading: true, side: THREE.DoubleSide } ),
      'smooth' : new THREE.MeshLambertMaterial( { side: THREE.DoubleSide } ),
      'glossy' : new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, shininess: 40 } ),
      'textured' : new THREE.MeshPhongMaterial( { map: textureMap, side: THREE.DoubleSide } ),
      'reflective' : new THREE.MeshPhongMaterial( { envMap: textureCube, side: THREE.DoubleSide } )
    };

    // scene itself
    scene.background = textureCube;

    this.createNewTeapot();
  }
  createNewTeapot() {

    if ( this.teapot !== undefined ) {

      this.teapot.geometry.dispose();
      this.scene.remove( this.teapot );

    }

    let teapotGeometry = new TeapotBufferGeometry( TEAPOT_SIZE,
      this.tess,
      this.bottom,
      this.lid,
      this.body,
      this.fitLid,
      !this.nonblinn );

    this.teapot = new THREE.Mesh( teapotGeometry, this.materials[this.shading] );

    this.scene.add( this.teapot );

  }
}
