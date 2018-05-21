import * as THREE from "../../../../../lib/three.module.js";
import {ThreeShot} from "../../three-shot/three-shot.js";

export class Example extends ThreeShot {
  static get properties() {
    return {
      time: {
        observer: 'update'
      }
    }
  }
  init() {
    let camera = this.camera = new THREE.PerspectiveCamera( 45, 1, .1, 20000 );
    let scene = this.scene = new THREE.Scene();

    camera.position.z = 5500;
    scene.background = new THREE.Color( 0xffffff );

    var geometry = new THREE.BoxGeometry( 100, 100, 100 );
    var material = new THREE.MeshNormalMaterial();

    let root = new THREE.Mesh( geometry, material );
    scene.add( root );

    var amount = 200, object, parent = root;

    for ( var i = 0; i < amount; i ++ ) {

      object = new THREE.Mesh( geometry, material );
      object.position.x = 100;

      parent.add( object );
      parent = object;

    }

    parent = root;

    for ( var i = 0; i < amount; i ++ ) {

      object = new THREE.Mesh( geometry, material );
      object.position.x = - 100;

      parent.add( object );
      parent = object;

    }

    parent = root;

    for ( var i = 0; i < amount; i ++ ) {

      object = new THREE.Mesh( geometry, material );
      object.position.y = - 100;

      parent.add( object );
      parent = object;

    }

    parent = root;

    for ( var i = 0; i < amount; i ++ ) {

      object = new THREE.Mesh( geometry, material );
      object.position.y = 100;

      parent.add( object );
      parent = object;

    }

    parent = root;

    for ( var i = 0; i < amount; i ++ ) {

      object = new THREE.Mesh( geometry, material );
      object.position.z = - 100;

      parent.add( object );
      parent = object;

    }

    parent = root;

    for ( var i = 0; i < amount; i ++ ) {

      object = new THREE.Mesh( geometry, material );
      object.position.z = 100;

      parent.add( object );
      parent = object;

    }

  }
  update() {
    var rx = Math.sin( this.time * 0.07 ) * 0.2;
    var ry = Math.sin( this.time * 0.03 ) * 0.1;
    var rz = Math.sin( this.time * 0.02 ) * 0.1;

    this.scene.traverse( function ( object ) {

      object.rotation.x = rx;
      object.rotation.y = ry;
      object.rotation.z = rz;

    } );

    this.rendered = false;
  }
}
