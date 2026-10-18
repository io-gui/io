import {
  DirectionalLight,
  Fog,
  IcosahedronGeometry,
  LOD,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PointLight
} from 'three/webgpu'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/**
 * 1000 wireframe spheres, each a `LOD` of five icosahedron details picked by its distance to the camera (50, 300, 1000,
 * 2000 and 8000 units). Each view picks levels for its own camera. The source flies its camera through the field
 * (`FlyControls`, dropped); the camera is kept as `Camera` at its start, inside the field, while whole-scene framing
 * shows the field from outside. Static.
 */
@Register
export class LodExample extends Document {

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 45, 1, 1, 15000 )
    camera.name = 'Camera'
    camera.position.z = 1000
    this.scene.add( camera )

    this.scene.fog = new Fog( 0x000000, 1, 15000 )

    const pointLight = new PointLight( 0xff2200, 3, 0, 0 )
    pointLight.name = 'Point'
    pointLight.position.set( 0, 0, 0 )
    this.scene.add( pointLight )

    const dirLight = new DirectionalLight( 0xffffff, 3 )
    dirLight.name = 'Key'
    dirLight.position.set( 0, 0, 1 ).normalize()
    this.scene.add( dirLight )

    const geometry: [ IcosahedronGeometry, number ][] = [
      [ new IcosahedronGeometry( 100, 16 ), 50 ],
      [ new IcosahedronGeometry( 100, 8 ), 300 ],
      [ new IcosahedronGeometry( 100, 4 ), 1000 ],
      [ new IcosahedronGeometry( 100, 2 ), 2000 ],
      [ new IcosahedronGeometry( 100, 1 ), 8000 ]
    ]

    const material = new MeshLambertMaterial( { color: 0xffffff, wireframe: true } )

    for ( let j = 0; j < 1000; j ++ ) {

      const lod = new LOD()
      lod.name = 'LOD'

      for ( let i = 0; i < geometry.length; i ++ ) {

        const mesh = new Mesh( geometry[ i ][ 0 ], material )
        mesh.name = `Detail ${geometry[ i ][ 0 ].parameters.detail}`
        mesh.scale.set( 1.5, 1.5, 1.5 )
        mesh.updateMatrix()
        mesh.matrixAutoUpdate = false
        lod.addLevel( mesh, geometry[ i ][ 1 ] )

      }

      lod.position.x = 10000 * ( 0.5 - Math.random() )
      lod.position.y = 7500 * ( 0.5 - Math.random() )
      lod.position.z = 10000 * ( 0.5 - Math.random() )
      lod.updateMatrix()
      lod.matrixAutoUpdate = false
      this.scene.add( lod )

    }
  }
}
