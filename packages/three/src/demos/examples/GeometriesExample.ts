import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  CapsuleGeometry,
  CircleGeometry,
  CylinderGeometry,
  DoubleSide,
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
  Vector2
} from 'three/webgpu'
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js'
import { plane, klein, mobius } from 'three/addons/geometries/ParametricFunctions.js'
import { Register, Property } from '@io-gui/core'
import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/** The built-in geometries in a 4×4 grid, sharing one UV grid textured material. Spins while playing; plays when opened. */
@Register
export class GeometriesExample extends ThreeDocument {
  private material: MeshPhongMaterial

  @Property({type: Boolean, value: false})
  declare wireframe: boolean

  constructor(args?: ThreeDocumentProps) {
    super({autoplay: true, ...args})

    const ambientLight = new AmbientLight( 0xcccccc, 1.5 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const pointLight = new PointLight( 0xffffff, 2.5, 0, 0 )
    pointLight.name = 'Point'
    pointLight.position.set( 0, 500, 0 )
    this.scene.add( pointLight )

    // Views draw on document changes only, so report the texture when it arrives.
    const map = new TextureLoader().load( 'https://threejs.org/examples/textures/uv_grid_opengl.jpg', () => this.notify({kind: 'material'}) )
    map.wrapS = map.wrapT = RepeatWrapping
    map.anisotropy = 16
    map.colorSpace = SRGBColorSpace

    this.material = new MeshPhongMaterial( { map: map, side: DoubleSide } )
    this.wireframeChanged()

    const add = (name: string, geometry: BufferGeometry, x: number, z: number, scale = 1) => {
      const object = new Mesh( geometry, this.material )
      object.name = name
      object.position.set( x, 0, z )
      object.scale.multiplyScalar( scale )
      this.scene.add( object )
    }

    // Row 1: Basic polyhedra
    add( 'Sphere', new SphereGeometry( 75, 20, 10 ), -300, 300 )
    add( 'Icosahedron', new IcosahedronGeometry( 75 ), -100, 300 )
    add( 'Octahedron', new OctahedronGeometry( 75 ), 100, 300 )
    add( 'Tetrahedron', new TetrahedronGeometry( 75 ), 300, 300 )

    // Row 2: Flat and box shapes
    add( 'Plane', new PlaneGeometry( 100, 100, 4, 4 ), -300, 100 )
    add( 'Box', new BoxGeometry( 100, 100, 100, 4, 4, 4 ), -100, 100 )
    add( 'Circle', new CircleGeometry( 50, 20, 0, Math.PI * 2 ), 100, 100 )
    add( 'Ring', new RingGeometry( 10, 50, 20, 5, 0, Math.PI * 2 ), 300, 100 )

    // Row 3: Revolution and toroidal shapes
    add( 'Cylinder', new CylinderGeometry( 25, 75, 100, 40, 5 ), -300, -100 )

    const points: Vector2[] = []
    for ( let i = 0; i < 50; i++ ) {
      points.push( new Vector2( Math.sin( i * 0.2 ) * Math.sin( i * 0.1 ) * 15 + 50, ( i - 5 ) * 2 ) )
    }
    add( 'Lathe', new LatheGeometry( points, 20 ), -100, -100 )
    add( 'Torus', new TorusGeometry( 50, 20, 20, 20 ), 100, -100 )
    add( 'TorusKnot', new TorusKnotGeometry( 50, 10, 50, 20 ), 300, -100 )

    // Row 4: Capsule and parametric geometries
    add( 'Capsule', new CapsuleGeometry( 20, 50 ), -300, -300 )

    const planeGeometry = new ParametricGeometry( plane, 10, 10 )
    planeGeometry.scale( 100, 100, 100 )
    planeGeometry.center()
    add( 'ParametricPlane', planeGeometry, -100, -300 )
    add( 'Klein', new ParametricGeometry( klein, 20, 20 ), 100, -300, 5 )
    add( 'Mobius', new ParametricGeometry( mobius, 20, 20 ), 300, -300, 30 )
  }

  wireframeChanged() {
    this.material.wireframe = this.wireframe
    this.material.emissive.set( this.wireframe ? 0xffffff : 0x000000 )
  }

  override onAnimate(delta: number, time: number) {
    this.scene.traverse( ( object ) => {
      if ( (object as Mesh).isMesh === true ) {
        object.rotation.x = time * 0.5
        object.rotation.y = time * 0.25
      }
    })
  }
}

registerEditorGroups(GeometriesExample, {
  Main: ['wireframe'],
})
