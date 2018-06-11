import * as THREE from "../../../../../lib/three.module.js";
import {ThreeShot} from "../../three-shot/three-shot.js";

export class Example extends ThreeShot {
  init() {

    let camera = this.camera = new THREE.PerspectiveCamera( 45, 1, .1, 20000 );
    let scene = this.scene = new THREE.Scene();

    camera.position.z = 1500;

    scene.background = new THREE.Color( 0xffffff );

    let light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 0, 1 );
    scene.add( light );

    // shadow

    let canvas = document.createElement( 'canvas' );
    canvas.width = 128;
    canvas.height = 128;

    let context = canvas.getContext( '2d' );
    let gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
    gradient.addColorStop( 0.1, 'rgba(210,210,210,1)' );
    gradient.addColorStop( 1, 'rgba(255,255,255,1)' );

    context.fillStyle = gradient;
    context.fillRect( 0, 0, canvas.width, canvas.height );

    let shadowTexture = new THREE.Texture( canvas );
    shadowTexture.needsUpdate = true;

    let shadowMaterial = new THREE.MeshBasicMaterial( { map: shadowTexture } );
    let shadowGeo = new THREE.PlaneBufferGeometry( 300, 300, 1, 1 );

    let shadowMesh;

    shadowMesh = new THREE.Mesh( shadowGeo, shadowMaterial );
    shadowMesh.position.y = - 250;
    shadowMesh.rotation.x = - Math.PI / 2;
    scene.add( shadowMesh );

    shadowMesh = new THREE.Mesh( shadowGeo, shadowMaterial );
    shadowMesh.position.y = - 250;
    shadowMesh.position.x = - 400;
    shadowMesh.rotation.x = - Math.PI / 2;
    scene.add( shadowMesh );

    shadowMesh = new THREE.Mesh( shadowGeo, shadowMaterial );
    shadowMesh.position.y = - 250;
    shadowMesh.position.x = 400;
    shadowMesh.rotation.x = - Math.PI / 2;
    scene.add( shadowMesh );

    let faceIndices = [ 'a', 'b', 'c' ];

    let color, f, f2, f3, p, vertexIndex,

      radius = 200,

      geometry  = new THREE.IcosahedronGeometry( radius, 1 ),
      geometry2 = new THREE.IcosahedronGeometry( radius, 1 ),
      geometry3 = new THREE.IcosahedronGeometry( radius, 1 );

    for ( let i = 0; i < geometry.faces.length; i ++ ) {

      f  = geometry.faces[ i ];
      f2 = geometry2.faces[ i ];
      f3 = geometry3.faces[ i ];

      for ( let j = 0; j < 3; j ++ ) {

        vertexIndex = f[ faceIndices[ j ] ];

        p = geometry.vertices[ vertexIndex ];

        color = new THREE.Color( 0xffffff );
        color.setHSL( ( p.y / radius + 1 ) / 2, 1.0, 0.5 );

        f.vertexColors[ j ] = color;

        color = new THREE.Color( 0xffffff );
        color.setHSL( 0.0, ( p.y / radius + 1 ) / 2, 0.5 );

        f2.vertexColors[ j ] = color;

        color = new THREE.Color( 0xffffff );
        color.setHSL( 0.125 * vertexIndex / geometry.vertices.length, 1.0, 0.5 );

        f3.vertexColors[ j ] = color;

      }

    }

    let mesh, wireframe;

    let material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors, shininess: 0 } );
    let wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } );

    mesh = new THREE.Mesh( geometry, material );
    wireframe = new THREE.Mesh( geometry, wireframeMaterial );
    mesh.add( wireframe );
    mesh.position.x = - 400;
    mesh.rotation.x = - 1.87;
    scene.add( mesh );

    mesh = new THREE.Mesh( geometry2, material );
    wireframe = new THREE.Mesh( geometry2, wireframeMaterial );
    mesh.add( wireframe );
    mesh.position.x = 400;
    scene.add( mesh );

    mesh = new THREE.Mesh( geometry3, material );
    wireframe = new THREE.Mesh( geometry3, wireframeMaterial );
    mesh.add( wireframe );
    scene.add( mesh );
  }
}
