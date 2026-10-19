import { Color, IcosahedronGeometry, InstancedMesh, Matrix4, MeshStandardMaterial, PerspectiveCamera, PMREMGenerator, WebGPURenderer } from 'three/webgpu'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Spheres per side of the cube (the source reads it from the URL query, default 3). */
const AMOUNT = 3

/**
 * A cube of randomly colored, half-transparent spheres drawn with alpha hashing (stochastic transparency, no
 * sorting) or classic blending; `alpha` and `alphaHash` are in the Document tab. The source's SSAA post pass, which
 * smooths the hash noise, is dropped (`document-pipeline`): the TRAA views converge it instead.
 */
@Register
export class MaterialsAlphahashExample extends Document {

  public mesh: InstancedMesh<IcosahedronGeometry, MeshStandardMaterial>

  @Property({type: Number, value: 0.5})
  declare alpha: number

  @Property({type: Boolean, value: true})
  declare alphaHash: boolean

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 60, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( AMOUNT, AMOUNT, AMOUNT )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    const count = Math.pow( AMOUNT, 3 )
    const color = new Color()

    this.scene.background = new Color( 0x000000 )

    const geometry = new IcosahedronGeometry( 0.5, 3 )
    const material = new MeshStandardMaterial( {
      color: 0xffffff,
      alphaHash: this.alphaHash,
      opacity: this.alpha
    } )

    this.mesh = new InstancedMesh( geometry, material, count )
    this.mesh.name = 'Spheres'

    let i = 0
    const offset = ( AMOUNT - 1 ) / 2

    const matrix = new Matrix4()

    for ( let x = 0; x < AMOUNT; x ++ ) {
      for ( let y = 0; y < AMOUNT; y ++ ) {
        for ( let z = 0; z < AMOUNT; z ++ ) {
          matrix.setPosition( offset - x, offset - y, offset - z )

          this.mesh.setMatrixAt( i, matrix )
          this.mesh.setColorAt( i, color.setHex( Math.random() * 0xffffff ) )

          i ++
        }
      }
    }

    this.scene.add( this.mesh )

    this.onMaterialUpdate()
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)

    const environment = new RoomEnvironment()
    const pmremGenerator = new PMREMGenerator( renderer )

    this.scene.environment = pmremGenerator.fromScene( environment, 0.04 ).texture
    environment.dispose()
    pmremGenerator.dispose()
  }

  alphaChanged() { this.onMaterialUpdate() }
  alphaHashChanged() { this.onMaterialUpdate() }

  private onMaterialUpdate() {
    if ( ! this.mesh ) return

    const material = this.mesh.material
    material.opacity = this.alpha
    material.alphaHash = this.alphaHash
    material.transparent = ! this.alphaHash
    material.depthWrite = this.alphaHash

    material.needsUpdate = true
  }
}

registerEditorConfig(MaterialsAlphahashExample, [
  ['alpha', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(MaterialsAlphahashExample, {
  Main: ['alpha', 'alphaHash'],
  Hidden: ['mesh'],
})
