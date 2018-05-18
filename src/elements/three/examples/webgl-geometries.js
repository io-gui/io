import * as THREE from "../../../../lib/three.module.js";
import {WebglExample} from "./webgl-example.js";

export class WebglGeometries extends WebglExample {
  init() {

    let camera = this.camera;
    let scene = this.scene;

    camera.position.y = 400;

    var light, object;

    var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );

    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    scene.add( camera );

    var map = new THREE.TextureLoader().load( this.path('./textures/UV_Grid_Sm.jpg', import.meta.url ) );
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;

    var material = new THREE.MeshPhongMaterial( { map: map, side: THREE.DoubleSide } );

    //

    object = new THREE.Mesh( new THREE.SphereGeometry( 75, 20, 10 ), material );
    object.position.set( - 300, 0, 200 );
    scene.add( object );

    object = new THREE.Mesh( new THREE.IcosahedronGeometry( 75, 1 ), material );
    object.position.set( - 100, 0, 200 );
    scene.add( object );

    object = new THREE.Mesh( new THREE.OctahedronGeometry( 75, 2 ), material );
    object.position.set( 100, 0, 200 );
    scene.add( object );

    object = new THREE.Mesh( new THREE.TetrahedronGeometry( 75, 0 ), material );
    object.position.set( 300, 0, 200 );
    scene.add( object );

    //

    object = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100, 4, 4 ), material );
    object.position.set( - 300, 0, 0 );
    scene.add( object );

    object = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100, 4, 4, 4 ), material );
    object.position.set( - 100, 0, 0 );
    scene.add( object );

    object = new THREE.Mesh( new THREE.CircleGeometry( 50, 20, 0, Math.PI * 2 ), material );
    object.position.set( 100, 0, 0 );
    scene.add( object );

    object = new THREE.Mesh( new THREE.RingGeometry( 10, 50, 20, 5, 0, Math.PI * 2 ), material );
    object.position.set( 300, 0, 0 );
    scene.add( object );

    //

    object = new THREE.Mesh( new THREE.CylinderGeometry( 25, 75, 100, 40, 5 ), material );
    object.position.set( - 300, 0, - 200 );
    scene.add( object );

    var points = [];

    for ( var i = 0; i < 50; i ++ ) {

      points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * Math.sin( i * 0.1 ) * 15 + 50, ( i - 5 ) * 2 ) );

    }

    object = new THREE.Mesh( new THREE.LatheGeometry( points, 20 ), material );
    object.position.set( - 100, 0, - 200 );
    scene.add( object );

    object = new THREE.Mesh( new THREE.TorusGeometry( 50, 20, 20, 20 ), material );
    object.position.set( 100, 0, - 200 );
    scene.add( object );

    object = new THREE.Mesh( new THREE.TorusKnotGeometry( 50, 10, 50, 20 ), material );
    object.position.set( 300, 0, - 200 );
    scene.add( object );

  }
  update() {
    var timer = Date.now() * 0.0001;
    let camera = this.camera;
    let scene = this.scene;

    camera.position.x = Math.cos( timer ) * 800;
    camera.position.z = Math.sin( timer ) * 800;

    camera.lookAt( scene.position );

    scene.traverse( function( object ) {

      if ( object.isMesh === true ) {

        object.rotation.x = timer * 5;
        object.rotation.y = timer * 2.5;

      }

    } );
  }
}

WebglGeometries.Register();
