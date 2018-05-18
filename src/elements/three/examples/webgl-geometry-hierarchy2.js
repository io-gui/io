import * as THREE from "../../../../lib/three.module.js";
import {WebglExample} from "./webgl-example.js";

export class WebglGeometryHierarchy2 extends WebglExample {
  init() {

    let camera = this.camera;
    let scene = this.scene;

    camera.position.z = 500;
    scene.background = new THREE.Color( 0xffffff );

    var geometry = new THREE.BoxGeometry( 100, 100, 100 );
    var material = new THREE.MeshNormalMaterial();

    let root = new THREE.Mesh( geometry, material );
    root.position.x = 1000;
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
    let camera = this.camera;
    let scene = this.scene;
    let mouseX = this.pointers[0] ? this.pointers[0].position.x * 3000.0 : 0;
    let mouseY = this.pointers[0] ? this.pointers[0].position.y * 3000.0 : 0;

    var time = Date.now() * 0.001;

    var rx = Math.sin( time * 0.7 ) * 0.2;
    var ry = Math.sin( time * 0.3 ) * 0.1;
    var rz = Math.sin( time * 0.2 ) * 0.1;

    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;

    camera.lookAt( scene.position );

    scene.traverse( function ( object ) {

      object.rotation.x = rx;
      object.rotation.y = ry;
      object.rotation.z = rz;

    } );
  }
}

WebglGeometryHierarchy2.Register();
