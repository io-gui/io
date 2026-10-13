import { AmbientLight, BoxGeometry, Color, Float32BufferAttribute, Mesh, MeshPhongMaterial, PointLight, Vector3 } from 'three/webgpu'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

function createGeometry() {
  const geometry = new BoxGeometry( 2, 2, 2, 32, 32, 32 )

  // create an empty array to hold targets for the attribute we want to morph
  // morphing positions and normals is supported
  geometry.morphAttributes.position = []

  // the original positions of the cube's vertices
  const positionAttribute = geometry.attributes.position

  // for the first morph target we'll move the cube's vertices onto the surface of a sphere
  const spherePositions: number[] = []

  // for the second morph target, we'll twist the cubes vertices
  const twistPositions: number[] = []
  const direction = new Vector3( 1, 0, 0 )
  const vertex = new Vector3()

  for ( let i = 0; i < positionAttribute.count; i ++ ) {
    const x = positionAttribute.getX( i )
    const y = positionAttribute.getY( i )
    const z = positionAttribute.getZ( i )

    spherePositions.push(
      x * Math.sqrt( 1 - ( y * y / 2 ) - ( z * z / 2 ) + ( y * y * z * z / 3 ) ),
      y * Math.sqrt( 1 - ( z * z / 2 ) - ( x * x / 2 ) + ( z * z * x * x / 3 ) ),
      z * Math.sqrt( 1 - ( x * x / 2 ) - ( y * y / 2 ) + ( x * x * y * y / 3 ) )
    )

    // stretch along the x-axis so we can see the twist better
    vertex.set( x * 2, y, z )

    vertex.applyAxisAngle( direction, Math.PI * x / 2 ).toArray( twistPositions, twistPositions.length )
  }

  // add the spherical positions as the first morph target
  geometry.morphAttributes.position[ 0 ] = new Float32BufferAttribute( spherePositions, 3 )

  // add the twisted positions as the second morph target
  geometry.morphAttributes.position[ 1 ] = new Float32BufferAttribute( twistPositions, 3 )

  return geometry
}

/** A subdivided cube with two morph targets, spherify and twist, weighted in the Document tab. */
@Register
export class MorphtargetsExample extends Document {

  public mesh: Mesh

  @Property({type: Number, value: 0})
  declare spherify: number

  @Property({type: Number, value: 0})
  declare twist: number

  constructor(args?: DocumentProps) {
    super(args)

    this.scene.background = new Color( 0x8FBCD4 )

    const ambientLight = new AmbientLight( 0x8FBCD4, 1.5 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    // The source attaches the light to its camera at (0, 0, 10).
    const pointLight = new PointLight( 0xffffff, 200 )
    pointLight.name = 'Point'
    pointLight.position.set( 0, 0, 10 )
    this.scene.add( pointLight )

    const material = new MeshPhongMaterial( {
      color: 0xff0000,
      flatShading: true
    } )

    this.mesh = new Mesh( createGeometry(), material )
    this.mesh.name = 'Cube'
    this.scene.add( this.mesh )

    this.spherifyChanged()
    this.twistChanged()
  }

  spherifyChanged() {
    if ( this.mesh ) this.mesh.morphTargetInfluences![ 0 ] = this.spherify
  }

  twistChanged() {
    if ( this.mesh ) this.mesh.morphTargetInfluences![ 1 ] = this.twist
  }
}

registerEditorConfig(MorphtargetsExample, [
  ['spherify', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['twist', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(MorphtargetsExample, {
  Main: ['spherify', 'twist'],
})
