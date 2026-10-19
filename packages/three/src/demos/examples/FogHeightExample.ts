import { AmbientLight, BoxGeometry, DirectionalLight, InstancedMesh, MeshPhongNodeMaterial, Object3D, PerspectiveCamera } from 'three/webgpu'
import { exponentialHeightFogFactor, uniform, fog, color } from 'three/tsl'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * A grid of tall boxes standing in exponential height fog; fog density and height are in the Document tab. The fog
 * thickens with distance, so the source's camera, inside the grid, is the active camera.
 */
@Register
export class FogHeightExample extends Document {

  public boxes: InstancedMesh
  private densityUniform = uniform( 0.04 )
  private heightUniform = uniform( 2 )

  @Property({type: Number, value: 0.04})
  declare density: number

  @Property({type: Number, value: 2})
  declare height: number

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 45, 400 / 250, 1, 600 )
    camera.name = 'Camera'
    camera.position.set( 20, 10, 25 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    // height fog

    const fogFactor = exponentialHeightFogFactor( this.densityUniform, this.heightUniform )

    this.scene.fogNode = fog( color( 0xffdfc1 ), fogFactor )
    this.scene.backgroundNode = color( 0xffdfc1 )

    // meshes

    const geometry = new BoxGeometry( 1, 25, 1 )
    const material = new MeshPhongNodeMaterial( { color: 0xcd959a } )

    this.boxes = new InstancedMesh( geometry, material, 100 )
    this.boxes.name = 'Boxes'
    this.boxes.position.y = - 10
    this.scene.add( this.boxes )

    const dummy = new Object3D()

    let index = 0

    for ( let i = 0; i < 10; i ++ ) {
      for ( let j = 0; j < 10; j ++ ) {
        dummy.position.x = - 18 + ( i * 4 )
        dummy.position.z = - 18 + ( j * 4 )
        dummy.updateMatrix()
        this.boxes.setMatrixAt( index ++, dummy.matrix )
      }
    }

    // lights

    const directionalLight = new DirectionalLight( 0xffc0cb, 2 )
    directionalLight.name = 'Key'
    directionalLight.position.set( - 10, 10, 10 )
    this.scene.add( directionalLight )

    const ambientLight = new AmbientLight( 0xcccccc )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )
  }

  densityChanged() { this.densityUniform.value = this.density }
  heightChanged() { this.heightUniform.value = this.height }
}

registerEditorConfig(FogHeightExample, [
  ['density', ioNumberSlider({min: 0.001, max: 0.1, step: 0.0001})],
  ['height', ioNumberSlider({min: - 5, max: 5, step: 0.01})],
])

registerEditorGroups(FogHeightExample, {
  Main: ['density', 'height'],
})
