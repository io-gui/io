import {
  AmbientLight,
  CatmullRomCurve3,
  Color,
  ExtrudeGeometry,
  MathUtils,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PointLight,
  Shape,
  Vector2,
  Vector3
} from 'three/webgpu'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/**
 * `ExtrudeGeometry` three ways: a triangle along a closed spline, a star along a random spline, and a beveled star
 * extruded straight with a material per group (caps, sides).
 */
@Register
export class GeometryExtrudeShapesExample extends Document {

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 45, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 500 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x222222 )

    const ambientLight = new AmbientLight( 0x666666 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    // The source places the light at its camera.
    const light = new PointLight( 0xffffff, 3, 0, 0 )
    light.name = 'Point'
    light.position.set( 0, 0, 500 )
    this.scene.add( light )

    //

    const closedSpline = new CatmullRomCurve3( [
      new Vector3( - 60, - 100, 60 ),
      new Vector3( - 60, 20, 60 ),
      new Vector3( - 60, 120, 60 ),
      new Vector3( 60, 20, - 60 ),
      new Vector3( 60, - 100, - 60 )
    ] )

    closedSpline.curveType = 'catmullrom'
    closedSpline.closed = true

    const extrudeSettings1 = {
      steps: 100,
      bevelEnabled: false,
      extrudePath: closedSpline
    }

    const pts1: Vector2[] = [], count = 3

    for ( let i = 0; i < count; i ++ ) {
      const l = 20

      const a = 2 * i / count * Math.PI

      pts1.push( new Vector2( Math.cos( a ) * l, Math.sin( a ) * l ) )
    }

    const shape1 = new Shape( pts1 )

    const geometry1 = new ExtrudeGeometry( shape1, extrudeSettings1 )

    const material1 = new MeshLambertMaterial( { color: 0xb00000, wireframe: false } )

    const mesh1 = new Mesh( geometry1, material1 )
    mesh1.name = 'ClosedSpline'

    this.scene.add( mesh1 )

    //

    const randomPoints: Vector3[] = []

    for ( let i = 0; i < 10; i ++ ) {
      randomPoints.push( new Vector3( ( i - 4.5 ) * 50, MathUtils.randFloat( - 50, 50 ), MathUtils.randFloat( - 50, 50 ) ) )
    }

    const randomSpline = new CatmullRomCurve3( randomPoints )

    //

    const extrudeSettings2 = {
      steps: 200,
      bevelEnabled: false,
      extrudePath: randomSpline
    }

    const pts2: Vector2[] = [], numPts = 5

    for ( let i = 0; i < numPts * 2; i ++ ) {
      const l = i % 2 === 1 ? 10 : 20

      const a = i / numPts * Math.PI

      pts2.push( new Vector2( Math.cos( a ) * l, Math.sin( a ) * l ) )
    }

    const shape2 = new Shape( pts2 )

    const geometry2 = new ExtrudeGeometry( shape2, extrudeSettings2 )

    const material2 = new MeshLambertMaterial( { color: 0xff8000, wireframe: false } )

    const mesh2 = new Mesh( geometry2, material2 )
    mesh2.name = 'RandomSpline'

    this.scene.add( mesh2 )

    //

    const materials = [ material1, material2 ]

    const extrudeSettings3 = {
      depth: 20,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 4,
      bevelSegments: 1
    }

    const geometry3 = new ExtrudeGeometry( shape2, extrudeSettings3 )

    const mesh3 = new Mesh( geometry3, materials )
    mesh3.name = 'BeveledStar'

    mesh3.position.set( 50, 100, 50 )

    this.scene.add( mesh3 )
  }
}
