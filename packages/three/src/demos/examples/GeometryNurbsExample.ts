import {
  AmbientLight,
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  Line,
  LineBasicMaterial,
  MathUtils,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  Vector4
} from 'three/webgpu'
import { NURBSCurve } from 'three/addons/curves/NURBSCurve.js'
import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js'
import { NURBSVolume } from 'three/addons/curves/NURBSVolume.js'
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/**
 * A random NURBS curve with its control polygon, a textured NURBS surface, and five slices of a NURBS volume drawn with
 * `ParametricGeometry`. The pointer drag that turned the group is dropped. Static.
 */
@Register
export class GeometryNurbsExample extends Document {

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 50, 400 / 250, 1, 2000 )
    camera.name = 'Camera'
    camera.position.set( 0, 150, 750 )
    this.activeCamera = camera

    this.scene.background = new Color( 0xf0f0f0 )

    const ambientLight = new AmbientLight( 0xffffff )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const light = new DirectionalLight( 0xffffff, 3 )
    light.name = 'Key'
    light.position.set( 1, 1, 1 )
    this.scene.add( light )

    const group = new Group()
    group.name = 'NURBS'
    group.position.y = 50
    this.scene.add( group )

    // NURBS curve

    const nurbsControlPoints: Vector4[] = []
    const nurbsKnots: number[] = []
    const nurbsDegree = 3

    for ( let i = 0; i <= nurbsDegree; i ++ ) {

      nurbsKnots.push( 0 )

    }

    for ( let i = 0, j = 20; i < j; i ++ ) {

      nurbsControlPoints.push(
        new Vector4(
          Math.random() * 400 - 200,
          Math.random() * 400,
          Math.random() * 400 - 200,
          1 // weight of control point: higher means stronger attraction
        )
      )

      const knot = ( i + 1 ) / ( j - nurbsDegree )
      nurbsKnots.push( MathUtils.clamp( knot, 0, 1 ) )

    }

    const nurbsCurve = new NURBSCurve( nurbsDegree, nurbsKnots, nurbsControlPoints )

    const nurbsGeometry = new BufferGeometry()
    nurbsGeometry.setFromPoints( nurbsCurve.getPoints( 200 ) )

    const nurbsMaterial = new LineBasicMaterial( { color: 0x333333 } )

    const nurbsLine = new Line( nurbsGeometry, nurbsMaterial )
    nurbsLine.name = 'Curve'
    nurbsLine.position.set( 0, - 100, 0 )
    group.add( nurbsLine )

    const nurbsControlPointsGeometry = new BufferGeometry()
    nurbsControlPointsGeometry.setFromPoints( nurbsControlPoints.map( point => new Vector3( point.x, point.y, point.z ) ) )

    const nurbsControlPointsMaterial = new LineBasicMaterial( { color: 0x333333, opacity: 0.25, transparent: true } )

    const nurbsControlPointsLine = new Line( nurbsControlPointsGeometry, nurbsControlPointsMaterial )
    nurbsControlPointsLine.name = 'Control Points'
    nurbsControlPointsLine.position.copy( nurbsLine.position )
    group.add( nurbsControlPointsLine )

    // Views draw on document changes only, so report the texture when it arrives.
    const loadMap = () => {
      const map = new TextureLoader().load( 'https://threejs.org/examples/textures/uv_grid_opengl.jpg', () => this.notify({kind: 'material'}) )
      map.wrapS = map.wrapT = RepeatWrapping
      map.anisotropy = 16
      map.colorSpace = SRGBColorSpace
      return map
    }

    // NURBS surface

    {

      const nsControlPoints = [
        [
          new Vector4( - 200, - 200, 100, 1 ),
          new Vector4( - 200, - 100, - 200, 1 ),
          new Vector4( - 200, 100, 250, 1 ),
          new Vector4( - 200, 200, - 100, 1 )
        ],
        [
          new Vector4( 0, - 200, 0, 1 ),
          new Vector4( 0, - 100, - 100, 5 ),
          new Vector4( 0, 100, 150, 5 ),
          new Vector4( 0, 200, 0, 1 )
        ],
        [
          new Vector4( 200, - 200, - 100, 1 ),
          new Vector4( 200, - 100, 200, 1 ),
          new Vector4( 200, 100, - 250, 1 ),
          new Vector4( 200, 200, 100, 1 )
        ]
      ]
      const degree1 = 2
      const degree2 = 3
      const knots1 = [ 0, 0, 0, 1, 1, 1 ]
      const knots2 = [ 0, 0, 0, 0, 1, 1, 1, 1 ]
      const nurbsSurface = new NURBSSurface( degree1, degree2, knots1, knots2, nsControlPoints )

      const map = loadMap()

      const getSurfacePoint = ( u: number, v: number, target: Vector3 ) => {

        return nurbsSurface.getPoint( u, v, target )

      }

      const geometry = new ParametricGeometry( getSurfacePoint, 20, 20 )
      const material = new MeshLambertMaterial( { map: map, side: DoubleSide } )
      const object = new Mesh( geometry, material )
      object.name = 'Surface'
      object.position.set( - 400, 100, 0 )
      object.scale.multiplyScalar( 1 )
      group.add( object )

    }

    // NURBS volume

    {

      const nsControlPoints = [
        [
          [
            new Vector4( - 200, - 200, - 200, 1 ),
            new Vector4( - 200, - 200, 200, 1 )
          ],
          [
            new Vector4( - 200, - 100, - 200, 1 ),
            new Vector4( - 200, - 100, 200, 1 )
          ],
          [
            new Vector4( - 200, 100, - 200, 1 ),
            new Vector4( - 200, 100, 200, 1 )
          ],
          [
            new Vector4( - 200, 200, - 200, 1 ),
            new Vector4( - 200, 200, 200, 1 )
          ]
        ],
        [
          [
            new Vector4( 0, - 200, - 200, 1 ),
            new Vector4( 0, - 200, 200, 1 )
          ],
          [
            new Vector4( 0, - 100, - 200, 1 ),
            new Vector4( 0, - 100, 200, 1 )
          ],
          [
            new Vector4( 0, 100, - 200, 1 ),
            new Vector4( 0, 100, 200, 1 )
          ],
          [
            new Vector4( 0, 200, - 200, 1 ),
            new Vector4( 0, 200, 200, 1 )
          ]
        ],
        [
          [
            new Vector4( 200, - 200, - 200, 1 ),
            new Vector4( 200, - 200, 200, 1 )
          ],
          [
            new Vector4( 200, - 100, 0, 1 ),
            new Vector4( 200, - 100, 100, 1 )
          ],
          [
            new Vector4( 200, 100, 0, 1 ),
            new Vector4( 200, 100, 100, 1 )
          ],
          [
            new Vector4( 200, 200, 0, 1 ),
            new Vector4( 200, 200, 100, 1 )
          ]
        ]
      ]
      const degree1 = 2
      const degree2 = 3
      const degree3 = 1
      const knots1 = [ 0, 0, 0, 1, 1, 1 ]
      const knots2 = [ 0, 0, 0, 0, 1, 1, 1, 1 ]
      const knots3 = [ 0, 0, 1, 1 ]
      const nurbsVolume = new NURBSVolume( degree1, degree2, degree3, knots1, knots2, knots3, nsControlPoints )

      const map = loadMap()

      // Since ParametricGeometry() only support bi-variate parametric geometries
      // we create evaluation functions for different surfaces with one of the three
      // parameter values (u, v, w) kept constant and create multiple Mesh
      // objects one for each surface

      const surfaces: [ string, ( a: number, b: number, target: Vector3 ) => void ][] = [
        [ 'Front', ( u, v, target ) => nurbsVolume.getPoint( u, v, 0, target ) ],
        [ 'Middle', ( u, v, target ) => nurbsVolume.getPoint( u, v, 0.5, target ) ],
        [ 'Back', ( u, v, target ) => nurbsVolume.getPoint( u, v, 1, target ) ],
        [ 'Top', ( u, w, target ) => nurbsVolume.getPoint( u, 1, w, target ) ],
        [ 'Side', ( v, w, target ) => nurbsVolume.getPoint( 0, v, w, target ) ],
      ]

      for ( const [ name, getSurfacePoint ] of surfaces ) {

        const geometry = new ParametricGeometry( getSurfacePoint, 20, 20 )
        const material = new MeshLambertMaterial( { map: map, side: DoubleSide } )
        const object = new Mesh( geometry, material )
        object.name = `Volume ${name}`
        object.position.set( 400, 100, 0 )
        object.scale.multiplyScalar( 0.5 )
        group.add( object )

      }

    }
  }
}
