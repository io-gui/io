import {
  AmbientLight,
  BoxGeometry,
  CapsuleGeometry,
  CircleGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  LatheGeometry,
  Mesh,
  MeshPhongMaterial,
  OctahedronGeometry,
  PlaneGeometry,
  PointLight,
  RepeatWrapping,
  RingGeometry,
  SphereGeometry,
  SRGBColorSpace,
  TetrahedronGeometry,
  TextureLoader,
  TorusGeometry,
  TorusKnotGeometry,
  Vector2,
  DoubleSide,
  BufferGeometry
} from 'three/webgpu'
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js'
import { plane, klein, mobius } from 'three/addons/geometries/ParametricFunctions.js'
import { Register, ReactiveProperty } from '@io-gui/core'
import { ThreeApplet, IoThreeExample, ioThreeViewport, ThreeAppletProps } from '@io-gui/three'
import { Split, ioSplit } from '@io-gui/layout'
import { ioPropertyEditor, ioObject } from '@io-gui/editors'

@Register
export class GeometriesExample extends ThreeApplet {

  public geometries: BufferGeometry[] = []
  public material: MeshPhongMaterial

  constructor(args: ThreeAppletProps) {
    super(args)

    const ambientLight = new AmbientLight( 0xcccccc, 1.5 )
    this.scene.add( ambientLight )

    const pointLight = new PointLight( 0xffffff, 2.5, 0, 0 )
    pointLight.position.set( 0, 500, 0 )
    this.scene.add( pointLight )

    const map = new TextureLoader().load( 'https://threejs.org/examples/textures/uv_grid_opengl.jpg' )
    map.wrapS = map.wrapT = RepeatWrapping
    map.anisotropy = 16
    map.colorSpace = SRGBColorSpace

    const material = new MeshPhongMaterial( { map: map, side: DoubleSide } )
    this.material = material

    let object: Mesh
    let geometry

    // Row 1: Basic polyhedra
    object = new Mesh( new SphereGeometry( 75, 20, 10 ), material )
    object.position.set( -300, 0, 300 )
    this.scene.add( object )

    object = new Mesh( new IcosahedronGeometry( 75 ), material )
    object.position.set( -100, 0, 300 )
    this.scene.add( object )

    object = new Mesh( new OctahedronGeometry( 75 ), material )
    object.position.set( 100, 0, 300 )
    this.scene.add( object )

    object = new Mesh( new TetrahedronGeometry( 75 ), material )
    object.position.set( 300, 0, 300 )
    this.scene.add( object )

    // Row 2: Flat and box shapes
    object = new Mesh( new PlaneGeometry( 100, 100, 4, 4 ), material )
    object.position.set( -300, 0, 100 )
    this.scene.add( object )

    object = new Mesh( new BoxGeometry( 100, 100, 100, 4, 4, 4 ), material )
    object.position.set( -100, 0, 100 )
    this.scene.add( object )

    object = new Mesh( new CircleGeometry( 50, 20, 0, Math.PI * 2 ), material )
    object.position.set( 100, 0, 100 )
    this.scene.add( object )

    object = new Mesh( new RingGeometry( 10, 50, 20, 5, 0, Math.PI * 2 ), material )
    object.position.set( 300, 0, 100 )
    this.scene.add( object )

    // Row 3: Revolution and toroidal shapes
    object = new Mesh( new CylinderGeometry( 25, 75, 100, 40, 5 ), material )
    object.position.set( -300, 0, -100 )
    this.scene.add( object )

    const points: Vector2[] = []
    for ( let i = 0; i < 50; i++ ) {
      points.push( new Vector2( Math.sin( i * 0.2 ) * Math.sin( i * 0.1 ) * 15 + 50, ( i - 5 ) * 2 ) )
    }

    object = new Mesh( new LatheGeometry( points, 20 ), material )
    object.position.set( -100, 0, -100 )
    this.scene.add( object )

    object = new Mesh( new TorusGeometry( 50, 20, 20, 20 ), material )
    object.position.set( 100, 0, -100 )
    this.scene.add( object )

    object = new Mesh( new TorusKnotGeometry( 50, 10, 50, 20 ), material )
    object.position.set( 300, 0, -100 )
    this.scene.add( object )

    // Row 4: Capsule and parametric geometries
    object = new Mesh( new CapsuleGeometry( 20, 50 ), material )
    object.position.set( -300, 0, -300 )
    this.scene.add( object )

    geometry = new ParametricGeometry( plane, 10, 10 )
    geometry.scale( 100, 100, 100 )
    geometry.center()
    object = new Mesh( geometry, material )
    object.position.set( -100, 0, -300 )
    this.scene.add( object )

    geometry = new ParametricGeometry( klein, 20, 20 )
    object = new Mesh( geometry, material )
    object.position.set( 100, 0, -300 )
    object.scale.multiplyScalar( 5 )
    this.scene.add( object )

    geometry = new ParametricGeometry( mobius, 20, 20 )
    object = new Mesh( geometry, material )
    object.position.set( 300, 0, -300 )
    object.scale.multiplyScalar( 30 )
    this.scene.add( object )

    this.scene.children.forEach((child) => {
      if (child instanceof Mesh) {
        this.geometries.push(child.geometry)
      }
    })
  }

  onAnimate(delta: number, time: number) {
    if (this.material.wireframe) {
      this.material.emissive.set(0xffffff)
    } else {
      this.material.emissive.set(0x000000)
    }

    this.scene.traverse( ( object ) => {
      if ( (object as Mesh).isMesh === true ) {
        object.rotation.x = time * 0.5
        object.rotation.y = time * 0.25
      }
    })
  }
}

@Register
export class IoGeometriesExample extends IoThreeExample {

  @ReactiveProperty({type: GeometriesExample, init: {isPlaying: true}})
  declare applet: GeometriesExample

  ready() {

    this.render([
      ioSplit({
        elements: [
          ioThreeViewport({id: 'Top', applet: this.applet, cameraSelect: 'top'}),
          ioPropertyEditor({id: 'PropertyEditor', value: this.applet, properties: ['material', 'geometries'], config: [
            ['geometries', ioPropertyEditor({label: '_hidden_'})],
            [BufferGeometry, ioObject({properties: []})],
            [MeshPhongMaterial, ioPropertyEditor({label: '_hidden_', properties: ['wireframe']})],
          ]})
        ],
        split: new Split({
          type: 'split',
          orientation: 'horizontal',
          children: [
            {
              type: 'split',
              flex: '2 1 auto',
              orientation: 'vertical',
              children: [
                {type: 'panel',flex: '1 1 100%',tabs: [{id: 'Top'}]},
              ]
            },
            {
              type: 'panel',
              flex: '0 0 320px',
              tabs: [{id: 'PropertyEditor'}]
            }
          ]
        })
      })
    ])

  }

}

export const ioGeometriesExample = IoGeometriesExample.vConstructor
